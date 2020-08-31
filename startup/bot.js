const config = require('config');
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = config.get('botkey');

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const { getInfo, getName } = require('../services/httpService');
const { getPrice, getStats } = require('../services/priceService');

module.exports = function() {

  // Listen for any kind of message. There are different kinds of
  // messages.
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    let request = (msg.text) ? msg.text.trim().toLowerCase() : '';

    if (request.includes(':')) {
      let reqArr = request.split(':');
      let command = reqArr[0];
      let query = (reqArr.length > 1) ? reqArr[1] : '';
      switch(command) {
        case '/name':
        let result = await getName(query);
        (result) ?
        (result.name) ?
          bot.sendMessage(chatId, `
            name: ${result.name}\n\nname hash:\n${result.nameHash}\n\nowner:\n${result.owner}\n\nstate: ${result.state}\nheight: ${result.height}\nrenewal: ${result.renewal}\nvalue: ${result.value}\nregistered: ${result.registered}\nexpired: ${result.expired}\ndays until expired: ${result.daysToExpiry}\n\nDNS: ${result.ns}
          `)
          : bot.sendMessage(chatId, `Oops, I couldn't find that name registered.`)
        : bot.sendMessage(chatId, `Oops, I didn't get that. Try Again`);
        break;
      }
    }
    else {
      switch(request) {
        case '/price':
          let price = getPrice();
          bot.sendMessage(chatId, `
            The latest price I have from Namebase is: \n${price} BTC
          `);
          break;
        case '/stats':
          let stats = getStats();
          bot.sendMessage(chatId, `
            The latest stats I have from Namebase are: \nVolume Weighted Average Price: ${stats.volumeWeightedAveragePrice}\nPrice Change: ${stats.priceChange}\nPrice Change Percent: ${stats.priceChangePercent}\nOpen Price: ${stats.openPrice}\nClose Price: ${stats.closePrice}\nVolume: ${stats.volume}\nNumber Of Trades: ${stats.numberOfTrades}
          `);
          break;
        case '/help':
          bot.sendMessage(chatId, `
            I can send you info on the Handshake network. Try /commands for a list of commands.
          `);
          break;
        case '/commands':
          bot.sendMessage(chatId, `
            /getInfo - for network info\n/name:'search name' - look up info on a domain, e.g. /name:nb\n/price - for Namebase $HNSBTC price info\n/stats - for Nambase market info
          `);
          break;
        case '/getinfo':
        let result = await getInfo();
        (result) ?
        bot.sendMessage(chatId, `
          network: ${result.network}\nheight: ${result.chain.height}\nprogress: ${result.chain.progress}\ntx: ${result.chain.state.tx}\ncoin: ${result.chain.state.coin}\nvalue: ${result.chain.state.value}\nburned: ${result.chain.state.burned}
        `)
        : bot.sendMessage(chatId, `Oops, I didn't get that. Try Again`);
          break;
        default:
        bot.sendMessage(chatId, `Oops, I didn't get that. Try Again`);
      }
    }

    // send a message to the chat acknowledging receipt of their message
    //bot.sendMessage(chatId, 'Received your message');

  });
}
