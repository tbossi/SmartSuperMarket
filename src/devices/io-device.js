'use strict';

class ioDevice {
    constructor(name) {
        this.name = name;
        this.devices = {};
    }

    addDevice(id, device) {
        if (this.devices[id] !== undefined) {
            throw new Error(`${id} already in use.`);
        }

        this.devices[id] = device;
    }

    onMessage(message) {
        //todo implement message parsing
        return `###${message}###`;
    }
}

module.exports = ioDevice;