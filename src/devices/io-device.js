'use strict';
const CommandError = require('./command-error');

const GET = 1;
const SET = 2;

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

    onDeviceStatusChange(id, callback) {
        this.devices[id].onValueChange(callback);
    }

    onDevicesStatusChange(bicallback) {
        Object.keys(this.devices).forEach(k => this.onDeviceStatusChange(k, bicallback(this.devices[k].name)));
    }

    onMessage(message) {
        try {
            let command = ioDevice.convertMessageToCommand(message);
            let result = this.handleCommand(command);

            return `OK ${result.device} ${result.value}\n`;
        } catch (e) {
            if (e.code !== undefined) {
                return `ERROR ${e.code} ${e.information}\n`;
            }
            return `ERROR ${CommandError.UNKNOWN}\n`;
        }
    }

    handleCommand(command) {
        function ensureDeviceExists(id, devices) {
            if (devices[id] === undefined || devices[id] === null) {
                throw new CommandError(CommandError.UNKNOWN_DEVICE, "unknown device");
            }
        }

        let result = {};
        switch (command.operation) {
            case GET:
                ensureDeviceExists(command.device, this.devices);
                result.device = command.device;
                result.value = this.devices[command.device].value;
                break;
            case SET:
                ensureDeviceExists(command.device, this.devices);
                this.devices[command.device].value = command.value;
                result.device = command.device;
                result.value = command.value;
                break;
        }
        return result;
    }

    static convertMessageToCommand(message) {
        function checkArgument(argument) {
            if (argument === undefined || argument === null || argument === "") {
                throw new CommandError(CommandError.MISSING_ARGUMENT, "missing argument");
            }
            return argument;
        }

        let messageTokens = message.split(/\s+/);

        let command = {};
        switch (messageTokens[0]) {
            case 'GET':
                command.operation = GET;
                command.device = checkArgument(messageTokens[1]);
                break;
            case 'SET':
                command.operation = SET;
                command.device = checkArgument(messageTokens[1]);
                command.value = checkArgument(messageTokens[2]);
                break;
            default:
                throw new CommandError(CommandError.UNKNOWN_COMMAND, "unknown command");
        }
        return command;
    }
}

module.exports = ioDevice;