> 🚧 **This project is maintenance mode!** 🚧
> 
> I will be fixing and responding to pull requests and issues, but it is not in active development.

# VATSIM Multiproxy

Every wanted tower view for VRC, or to test a new radar client while keeping your primary? VATSIM Multiproxy is a simple CoC-friendly packet sniffing local proxy server.

It works by listening to inbound traffic from VATSIM and forwarding it to connected clients.

![Basic demonstration](https://doggo.ninja/FagUul.jpg)

## Installation and Usage

- Install [Npcap](https://nmap.org/npcap/dist/npcap-1.31.exe) (make sure WinPcap compatibility mode is enabled)
- Download the [Multiproxy executable](https://github.com/kognise/vatsim-multiproxy/releases/latest)
- Open a Command Prompt window in the folder you downloaded Multiproxy to, an easy way is to click in the top bar of File Explorer and type `cmd`
- Type `.\multiproxy` to get a list of network interfaces
- Type `.\multiproxy <INTERFACE>`, with the name of a valid network interface

In vPilot, type `.towerview` to connect your simulator. I'm not familiar with the steps for other pilot clients.

## FAQ

*Feel free to contact me at Kognise#6356 on Discord with any other questions.*

**Will using this be counted as a VATSIM Code of Conduct violation?**

I'm not a VATSIM staff member so I cannot guarantee anything, but to my knowledge it does not violate any of the CoC terms. Multiproxy does not connect to VATSIM, or send, modify, or receive packets in any way, and as such doesn't count as a client.

**I'm getting an error saying `Error: The specified module could not be found.`, what did I do wrong?**

Make sure you installed Npcap with WinPcap compatibility mode enabled.

**What's happening? Some of the aircraft are invisible!**

Due to the way this works, you may have to wait for them to move positions until they show up. You may also be able to disconnect and reconnect your radar client.

**I tried to connect a radar client to the proxy but it isn't working properly, what's the issue?**

Multiproxy does not send any outbound packets so not everything may work as expected, and at least so far I haven't tested any radar client connections.
