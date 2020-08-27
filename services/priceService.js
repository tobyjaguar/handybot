const config = require('config');
const axios = require('axios');

const ACCESS_KEY = config.get('accessKey');
const SECRET_KEY = config.get('secretKey');

const baseURL = config.get('nbEndpoint');
const endpoint = `${baseURL}/api/v0/ticker`;

const credentials = Buffer.from(`${ACCESS_KEY}:${SECRET_KEY}`);
const encodedCredentials = credentials.toString('base64');
const authorization = `Basic ${encodedCredentials}`;

let latestPrice = '0';
let stats = {
  volumeWeightedAveragePrice: '0',
  priceChange: '0',
  priceChangePercent: '0',
  openPrice: '0',
  closePrice: '0',
  volume: '0',
  numberOfTrades: '0'
}

async function setPrice() {
  try {
    let result = await axios.get(`${endpoint}/price`, {
      headers: {
        Authorization: authorization,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        symbol: 'HNSBTC'
      }
    });
    if (result.data.price) {
      latestPrice = result.data.price;
    }
  }
  catch(ex) {
    console.log(ex);
  }
}

async function setStats() {
  try {
    let result = await axios.get(`${endpoint}/day`, {
      headers: {
        Authorization: authorization,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        symbol: 'HNSBTC'
      }
    });
    if (result.data.volumeWeightedAveragePrice) {
      stats.volumeWeightedAveragePrice = result.data.volumeWeightedAveragePrice;
      stats.priceChange = result.data.priceChange;
      stats.priceChangePercent = result.data.priceChangePercent;
      stats.openPrice = result.data.openPrice;
      stats.closePrice = result.data.closePrice;
      stats.volume = result.data.volume;
      stats.numberOfTrades = result.data.numberOfTrades;
    }
  }
  catch(ex) {
    console.log(ex);
  }
}

function getPrice() {
  return latestPrice;
}

function getStats() {
  return stats;
}

module.exports = {
  setPrice,
  setStats,
  getPrice,
  getStats
}
