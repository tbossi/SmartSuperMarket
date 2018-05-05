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
        //0.0.0.0 allows connections from outside of the docker container!
        this.server.listen(this.port, '0.0.0.0');
    }
}

module.exports = tcpServer;