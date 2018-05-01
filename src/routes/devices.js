const express = require('express');

function router(devices) {
    const router = express.Router();

    router.get('/', function (req, res, next) {
        res.header('Cache-Control','private, no-cache, no-store, must-revalidate');
        res.header('Expires','-1');
        res.header('Pragma','no-cache');
        res.render('devices', {
            title: 'Devices status',
            devices: devices.map(d => d.devicesValues),
            hitmap: [
                ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
                ['F', 'N', 'N', 'S', 'S', 'N', 'N', 'S'],
                ['F', 'N', 'N', 'S', 'S', 'N', 'N', 'S'],
                ['F', 'N', 'N', 'S', 'S', 'N', 'N', 'S'],
                ['N', 'E', 'E', 'N', 'N', 'N', 'N', 'N']
            ]
        });
    });

    return router;
}

module.exports = router;