'use strict';
const CommandError = require('./command-error');
const device = require('./device');

class positionDevice extends device {
    parseValue(value) {
        if (typeof value === 'object' &&
            typeof value.x === 'number' &&
            typeof value.y === 'number')
            return value;

        let splittedValue = value.split(',');
        let parsedX = parseFloat(splittedValue[0]);
        let parsedY = parseFloat(splittedValue[1]);

        if (isNaN(parsedX) || isNaN(parsedY)) {
            throw new CommandError(CommandError.INVALID_ARGUMENT, `Invalid value ${value}`);
        }

        return {
            x: parsedX,
            y: parsedY
        };
    }
}

module.exports = positionDevice;