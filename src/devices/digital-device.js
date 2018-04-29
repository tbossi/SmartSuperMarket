'use strict';
const CommandError = require('./command-error');
const device = require('./device');

class digitalDevice extends device {
    parseValue(value) {
        if (typeof value === 'boolean')
            return value;

        switch (value) {
            case 'true':
            case 'false':
                return value === 'true';
            default:
                throw new CommandError(CommandError.INVALID_ARGUMENT, `Invalid value ${value}`);
        }
    }
}

module.exports = digitalDevice;