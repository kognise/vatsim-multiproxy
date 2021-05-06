const { Cap } = require('cap')
const { start } = require('./start')
const chalk = require('chalk')

if (process.argv.length < 3 || process.argv[2].trim() === '') {
  const deviceList = Cap.deviceList()

  console.error(chalk.bold.red('No device specified!'))
  console.error('')

  console.error('All devices:')
  for (const device of deviceList) {
    if (device.addresses.length === 0) continue
    console.error(chalk.cyan(`  "${device.name}"`))
    console.error(chalk.gray(`  ${device.description}`))
    console.error(chalk.gray(`  ${device.addresses.map(({ addr }) => addr).join(', ')}`))
  }
  console.error('')

  const suggestedDevice = deviceList
    .filter((device) => device.addresses.some(({ addr }) => addr.startsWith('192.')))
    .sort((a, b) => b.addresses.length - a.addresses.length)[0]
  console.error(`Suggested device: ${chalk.cyan('"' + suggestedDevice.name + '"')}`)
  console.error(`                  ${chalk.gray(suggestedDevice.description)}`)

  process.exit(1)
} else {
  try {
    start(process.argv[2])
  } catch (error) {
    console.error(chalk.bold.red('Multiproxy exited unsuccessfully!'))
    console.error(error)
    process.exit(1)
  }
}