const config = require('config');
const cron = require('node-cron');
const { setPrice, setStats } = require('../services/priceService');

module.exports = function() {
  cron.schedule(config.get('updateSchedule'), () => {
    (async() => {
      await setPrice();
      await setStats();
    })();
  });
}
