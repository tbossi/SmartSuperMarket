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
            heatmap: [
                ['S', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
                ['S', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
                ['S', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
                ['S', 'N', 'N', 'S', 'S', 'S', 'S', 'S', 'N', 'N'],
                ['S', 'N', 'N', 'S', 'S', 'S', 'S', 'S', 'N', 'N'],
                ['S', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'E'],
                ['S', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'E'],
                ['S', 'N', 'N', 'S', 'S', 'S', 'S', 'S', 'N', 'N'],
                ['S', 'N', 'N', 'S', 'S', 'S', 'S', 'S', 'N', 'N'],
                ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
                ['N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N'],
                ['N', 'E', 'E', 'N', 'S', 'S', 'S', 'S', 'S', 'S'],

            ]
        });
    });

    return router;
}

module.exports = router;