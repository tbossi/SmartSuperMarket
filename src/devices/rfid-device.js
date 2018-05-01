'use strict';
const CommandError = require('./command-error');
const device = require('./device');

class RFIDDevice extends device {
    constructor(name, defaultValue) {
        super(name, defaultValue);
        this.active = true
    }

    parseValue(value) {
        if (typeof value === 'number' || value === '')
            return value;

        let parsed = parseInt(value);
        if (isNaN(parsed)) {
            throw new CommandError(CommandError.INVALID_ARGUMENT, `Invalid value ${value}`);
        }
        return parsed;
    }

    set active(state) { // bisogna ricordarsi di non fare più set value dopo averlo disattivato
        this._active = state;
        if (!this._active) {
            this.value = '';
        }
    }

    get active() {
        this._active;
    }
}

module.exports = RFIDDevice;