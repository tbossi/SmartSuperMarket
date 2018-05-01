'use strict';

class device {
    get value() {
        return this._value;
    }

    set value(x) {
        this._value = this.parseValue(x);
        this.onValueChangeCallbacks.forEach(c => c(this.value));
    }

    constructor(name, defaultValue) {
        this.name = name;
        this.onValueChangeCallbacks = [];

        this.value = defaultValue;
    }

    onValueChange(callback) {
        this.onValueChangeCallbacks.push(callback);
    }

    parseValue(value) {
        throw new Error("not implemented");
    }
}

module.exports = device;