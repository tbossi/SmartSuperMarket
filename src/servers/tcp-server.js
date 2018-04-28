'use strict';
const server = require('./server');
const net = require('net');

class tcpServer extends server {
    constructor(port, ioDevice) {
        super(port);

        this.server = net.createServer(socket => {
            socket.on('data', data => {
                let text = data.toString('utf8');

                console.log(`received >>> ${text}`);
                let response = ioDevice.onMessage(text);
                socket.write(response);
                console.log(`response <<< ${response}`);
            });
        })
    }

    start() {
        this.server.listen(this.port, '127.0.0.1')
    }
}

module.exports = tcpServer;