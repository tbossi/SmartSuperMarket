'use strict';
const server = require('./server');
const net = require('net');
const paymentCommandHandler = require('../fake-payment/command-handler');

class paymentServer extends server {
    constructor(port) {
        super(port);
        let commandHandler = new paymentCommandHandler();
        this.server = net.createServer(socket => {
            socket.on('data', data => {
                let result = commandHandler.handle(data);
                socket.write(result);
            });
        })
    }

    start() {
        //0.0.0.0 allows connections from outside of the docker container!
        this.server.listen(this.port, '0.0.0.0');
    }
}

module.exports = paymentServer;