const express = require('express');

function router(devices) {
    const router = express.Router();

    router.get('/', function (req, res, next) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.render('devices', {
            title: 'Devices status',
            devices: devices.map(d => d.devicesValues)
        });
    });

    router.post('/set', function (req, res, next) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        let te = 'SET ' + req.body.id + ' ' + req.body.text;
        let response = devices[parseInt(req.body.devices_id)].onMessage(te);
        res.send(response);
    });

    return router;
}

module.exports = router;