'use strict';
const CommandError = require('./command-error');
const device = require('./device');

class analogicalDevice extends device {
    parseValue(value) {
        if (typeof value === 'number')
            return value;

        let parsed = parseFloat(value);
        if (isNaN(parsed)) {
            throw new CommandError(CommandError.INVALID_ARGUMENT, `Invalid value ${value}`);
        }
        return parsed;
    }
}

module.exports = analogicalDevice;