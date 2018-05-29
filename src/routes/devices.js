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

    return router;
}

module.exports = router;