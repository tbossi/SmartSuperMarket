'use strict';
const server = require('./server');
const http = require('http');
const debug = require('debug')('code:server');

class httpServer extends server {
    constructor(port, app) {
        super(port);

        this.httpServer = http.createServer(app.toExpressApp(this.port));
    }

    start() {
        this.httpServer.listen(this.port);
        this.httpServer.on('error', error => this.onError(error));
        this.httpServer.on('listening', () => this.onListening());

        console.log(`Server started on port ${this.port}`);
    }

    onListening() {
        let addr = this.httpServer.address();
        let bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
        debug('Listening on ' + bind);
    }

    onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        let bind = typeof this.port === 'string' ? `Pipe ${this.port}` : `Port ${this.port}`;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
}

module.exports = httpServer;