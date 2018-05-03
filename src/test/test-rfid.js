const mocha = require('mocha');
const describe = mocha.describe;
const it = mocha.it;
const assert = require('chai').assert;

describe('rfid', function () {
    const rfidDevice = require('../devices/rfid-device');
    let rfid = new rfidDevice("#rfid", 1234);

    it('get correct value after creation', function () {
        assert.equal(1234, rfid.value);
    });

    it('get correct value after set', function () {
        rfid.value = 2345;
        assert.equal(2345, rfid.value);
    });

    it('get empty string after set acrive false', function () {
        rfid.active = false;
        assert.equal('', rfid.value);
    });
});