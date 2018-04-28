'use strict';
const server = require('./server');
const net = require('net');

class tcpServer extends server {
    constructor(port) {
        super(port);

        this.server = net.createServer(socket => {
            socket.on('data', data => {
                let text = data.toString('utf8');

                console.log(text);
                //do something with text...
            });
        })
    }

    start() {
        this.server.listen(this.port, '127.0.0.1')
    }
}

module.exports = tcpServer;