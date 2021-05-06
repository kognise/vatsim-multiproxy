const { Cap, decoders } = require('cap')
const net = require('net')
const chalk = require('chalk')

const { PROTOCOL } = decoders

module.exports.start = (device) => {
  const server = net.createServer()
  const clients = []
  
  server.on('connection', (client) => {
    console.log(chalk.gray('Got client connection'))
  
    client.write('$DISERVER:CLIENT:MULTIPROXY:\r\n\r\n')
  
    client.on('data', (data) => {
      const parts = data.toString().split('\r\n')
  
      for (const part of parts) {
        if (part.startsWith('$ID') && !clients.includes(client)) {
          const split = part.split(':')
          console.log(chalk.blue(`"${split[3]}" is now being forwarded packets`))
          clients.push(client)
          client.write(`#TMserver:${split[0].slice(3)}:Welcome to the multiproxy server!\r\n\r\n`)
        }
      }
    })
  
    client.on('close', () => {
      console.log(chalk.gray('Client disconnected'))
  
      const index = clients.indexOf(client)
      if (index !== -1) clients.splice(index, 1)
    })
  })
  
  server.listen(6809, '127.0.0.1', () => console.log(chalk.gray('Multiproxy is waiting for connections...')))
  
  const cap = new Cap()
  const filter = 'tcp and src port 6809'
  
  const bufSize = 10 * 1024 * 1024
  const buffer = Buffer.alloc(65535)
  const linkType = cap.open(device, filter, bufSize, buffer)
  
  cap.setMinBytes && cap.setMinBytes(0)
  
  let notifiedLive = false
  cap.on('packet', (_, trunc) => {
    if (trunc) return
  
    if (linkType !== 'ETHERNET') return
    const ethDecoder = decoders.Ethernet(buffer)
  
    if (ethDecoder.info.type !== PROTOCOL.ETHERNET.IPV4) return
    const ipDecoder = decoders.IPV4(buffer, ethDecoder.offset)
  
    if (ipDecoder.info.protocol !== PROTOCOL.IP.TCP) return
    const tcpDecoder = decoders.TCP(buffer, ipDecoder.offset)
  
    const dataLength = ipDecoder.info.totallen - ipDecoder.hdrlen - tcpDecoder.hdrlen
    const data = buffer.slice(tcpDecoder.offset, tcpDecoder.offset + dataLength)
  
    if (!notifiedLive) {
      notifiedLive = true
      console.log(chalk.green('VATSIM packets detected successfully'))
    }
  
    for (const client of clients) {
      client.write(data)
    }
  })
}