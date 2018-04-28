'use strict';

class server {
    constructor(port) {
        this.port = server.normalizePort(port);
    }

    start() {
        throw new Error("Method not implemented.");
    }

    static normalizePort(val) {
        let port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }
}

module.exports = server;