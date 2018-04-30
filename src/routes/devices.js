var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('devices', { title: 'Devices status' });
});

module.exports = router;
