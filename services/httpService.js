const config = require('config');
const axios = require('axios');

const { NodeClient } = require('hs-client');
const { Network } = require('hsd');
const network = Network.get('main');

//const ACCESS_KEY = config.get('apikey');
//const SECRET_KEY = config.get('apisecret');
//const baseURL = config.get('endpoint');

//const credentials = Buffer.from(`${ACCESS_KEY}:${SECRET_KEY}`);
//const encodedCredentials = credentials.toString('base64');
//const authorization = `Basic ${encodedCredentials}`;

const apikey = config.get('key');

// network type derived from hsd object, client object stores API key
const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: apikey
}

const client = new NodeClient(clientOptions);

async function getDomain(domain) {
  let result = {};
  //let endpoint = `${baseURL}/api/v0/dns/domains/${domain}`
  let endpoint = `${baseURL}/api/v0/dns/domains/estatex`
  try {
    let result = await axios.get(endpoint, {
      headers: {
        Authorization: authorization,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    });
    console.log("result: ")
    console.log(result)
  }
  catch(ex) {
    console.log(ex);
    //log(ex);
  }
  finally {
    return result;
  }
}

async function getInfo() {
  let result = null;
  try {
    result = await client.getInfo();
  }
  catch (ex) {
    console.log(ex);
  }
  finally {
    return result;
  }
}

async function getName(name) {
  let result = null;
  try {
    result = await client.execute('getnameinfo', [ `${name}` ]);
  }
  catch (ex) {
    console.log(ex);
  }
  finally {
    return result;
  }
}

module.exports = {
  getDomain,
  getInfo,
  getName
}
