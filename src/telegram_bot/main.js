const smarketbot = require('./telegram_bot');

let bot = new smarketbot();

setTimeout(
    function(){
        bot.brodcastMessage('ciao a tutti');
    }
    , 10*1000
);

console.log('end');