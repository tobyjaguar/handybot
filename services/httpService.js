const config = require('config');
const axios = require('axios');

const { NodeClient } = require('hs-client');
const { Network } = require('hsd');
const network = Network.get('main');

const apikey = config.get('key');

// network type derived from hsd object, client object stores API key
const clientOptions = {
  network: network.type,
  port: network.rpcPort,
  apiKey: apikey
}

const client = new NodeClient(clientOptions);

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
    result = {};
    let data = await client.execute('getnameinfo', [ `${name}` ]);
    if (data.info === null) {
      result.name = null;
      return result;
    } else {
      result.name = data.info.name;
      result.nameHash = data.info.nameHash;
      result.owner = data.info.owner.hash;
      result.state = data.info.state;
      result.height= data.info.height;
      result.renewal= data.info.renewal;
      result.value = data.info.value;
      result.registered = data.info.registered;
      result.expired = data.info.expired;
      result.daysToExpiry = data.info.stats.daysUntilExpire;

      data =await client.execute('getnameresource', [ `${name}` ]); // ns

      if(data) {
        let record = '';
        for(const [key, value] of Object.entries(data)) {
          value.map(e => {
            record = record + `\ntype: ${e.type}\nns: ${e.ns}`;
            (e.address) ? record = record + `\naddress: ${e.address}\n` : null;
          })
        }
        result.ns = record;
      }
      return result;
    }
  }
  catch (ex) {
    console.log(ex);
  }
  finally {
    return result;
  }
}

module.exports = {
  getInfo,
  getName
}
