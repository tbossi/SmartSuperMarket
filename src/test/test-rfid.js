var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it
var assert = require('chai').assert

describe('rfid', function () {
    it('get correct value after creation', function () {
        const rfidDevice = require('../devices/rfid-device');
        var rfid = new rfidDevice("#rfid", 1234);
        assert.equal(1234, rfid.value);
    });

    it('get correct value after set', function () {
        const rfidDevice = require('../devices/rfid-device');
        var rfid = new rfidDevice("#rfid", 1234);
        rfid.value = 2345;
        assert.equal(2345, rfid.value);
    });

    it('get empty string after set acrive false', function () {
        const rfidDevice = require('../devices/rfid-device');
        var rfid = new rfidDevice("#rfid", 1234);
        rfid.active = false;
        assert.equal('', rfid.value);
    });
});