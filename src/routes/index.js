const express = require('express');
const router = express.Router();

let routes = [
    {url: 'http://localhost:3000/devices', name: 'Devices hardware interface'},
    {url: 'http://localhost:1880/ui/#/0', name: 'Dashboard temperature'},
    {url: 'http://localhost:1880/ui/#/1', name: 'Dashboard carts heatmap'},
    {url: 'http://localhost:1880/managesupermarket', name: 'Products price manager'}
];
for (let i = 0; i < 20; i++) {
    routes.push({url: `http://localhost:1880/cart/${i}`, name: `Products in cart ${i}`});
}

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Smart Super Market',
        subtitle: 'All available routes',
        routes: routes
    });
});

module.exports = router;
