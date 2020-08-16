module.exports = function() {
  const config = require('config');
  const TelegramBot = require('node-telegram-bot-api');

  // replace the value below with the Telegram token you receive from @BotFather
  const token = config.get('botkey');

  // Create a bot that uses 'polling' to fetch new updates
  const bot = new TelegramBot(token, {polling: true});

  const { getInfo, getName } = require('../services/httpService');

  // Listen for any kind of message. There are different kinds of
  // messages.
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    //console.log(msg);
    //console.log(`chatId: ${chatId}`);
    //console.log(`hello ${msg.from.first_name}`);
    //console.log(`you wrote ${msg.text}`);

    //await getDomain(msg.text);
    //await getInfo();
    await getName('nb');
    let request = msg.text.trim().toLowerCase();

    if (request.includes(':')) {
      let reqArr = request.split(':');
      let command = reqArr[0];
      let query = (reqArr.length > 1) ? reqArr[1] : '';
      switch(command) {
        case '/name':
        let result = await getName(query);
        console.log(result);
        (result) ?
        (result.info) ?
          bot.sendMessage(chatId, `
            name: ${result.info.name}\nname hash:\n${result.info.nameHash}\nowner:\n${result.info.owner.hash}\nstate: ${result.info.state}\nheight: ${result.info.height}\nrenewal: ${result.info.renewal}\nvalue: ${result.info.value}\nregistered: ${result.info.registered}\nexpired: ${result.info.expired}\ndays until expired: ${result.info.stats.daysUntilExpire}
          `)
          : bot.sendMessage(chatId, `Oops, I couldn't find that name registered.`) 
        : bot.sendMessage(chatId, `Oops, I didn't get that. Try Again`);
        break;
      }
    }
    else {
      switch(request) {
        case '/help':
          bot.sendMessage(chatId, `
            I can send you info on the Handshake network. Try /commands for a list of commands.
          `);
          break;
        case '/commands':
          bot.sendMessage(chatId, `
            /getInfo - for network info\n/name:'search name' - look up info on a domain, e.g. /name:nb
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
