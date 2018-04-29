'use strict';

class CommandError extends Error {
    constructor(code, infoText) {
        super();
        this.information = infoText;
        this.code = code;
    }
}

CommandError["UNKNOWN"] = 0;
CommandError["UNKNOWN_COMMAND"] = -1;
CommandError["MISSING_ARGUMENT"] = -2;
CommandError["UNKNOWN_DEVICE"] = -3;
CommandError["INVALID_ARGUMENT"] = -4;

module.exports = CommandError;