'use strict';

class device {
    get value() {
        return this._value;
    }

    set value(x) {
        this._value = this.parseValue(x);
        this.callbacks.forEach(c => c());
    }

    constructor(name, defaultValue) {
        this.name = name;
        this.callbacks = [];

        this.value = defaultValue;
    }

    onValueChange(callback) {
        this.callbacks.push(callback);
    }

    parseValue(value) {
        throw new Error("not implemented");
    }
}

module.exports = device;