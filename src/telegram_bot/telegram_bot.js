const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');


var token = fs.readFileSync('./token').toString();

const bot = new TelegramBot(token, {polling: true});
var arrayOfChat = [];

bot.onText(/^(\/subscribe$)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (arrayOfChat.includes(chatId)) {
        bot.sendMessage(chatId, 'Your subscription was accepted yet');
    }
    else {
        arrayOfChat.push(chatId);
        console.log(arrayOfChat.length);
        bot.sendMessage(chatId, 'Your subscription is accepted');
    }
});

bot.onText(/^(\/unsubscribe$)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (arrayOfChat.includes(chatId)) {
        arrayOfChat.splice(arrayOfChat.indexOf(chatId), 1);
        console.log(arrayOfChat.length);
        bot.sendMessage(chatId, 'Your subscription is removed');
    }
    else {
        bot.sendMessage(chatId, 'Your subscription was removed yet');
    }
});

function brodcastMessage(message) {
    arrayOfChat.forEach(function (chatId) {
            bot.sendMessage(chatId, message);
        }
    );
}

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, 'Received your message');
// });