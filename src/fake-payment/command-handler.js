'use strict';
const crypto = require('crypto-js');

class commandHandler {
    constructor() {
        this.accounts = [];

        this.accounts.push({
            id: "SuperMarketId",
            key: "M@rk3tP@ssw0rd",
            amount: 100000
        });
    }

    handle(data) {
        let result;
        try {
            let command = JSON.parse(data);
            switch (command.request) {
                case "payment":
                    result = this.doPayment(command);
                    break;
                default:
                    result = {error: `Invalid request ${command.request}`};
            }
        } catch (e) {
            result = {error: `JSON message parsing error`};
        }
        return `${JSON.stringify(result)}\n`;
    }

    doPayment(command) {
        try {
            let account = this.accounts.find(value => value.id === command.sender);
            let decPayInfo = crypto.AES.decrypt(command.payment, account.key).toString(crypto.enc.Utf8);
            let payment = JSON.parse(decPayInfo);

            payment.result = payment.from % 2 === 0 ? "ok" : "failed";

            let result = crypto.AES.encrypt(JSON.stringify(payment), account.key).toString();
            return {payment: result};
        } catch (e) {
            return {error: `Cannot decrypt payment info`};
        }
    }
}

module.exports = commandHandler;