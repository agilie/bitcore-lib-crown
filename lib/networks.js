'use strict';
var _ = require('lodash');

var BufferUtil = require('./util/buffer');
var JSUtil = require('./util/js');
var networks = [];
var networkMaps = {};

/**
 * A network is merely a map containing values that correspond to version
 * numbers for each bitcoin network. Currently only supporting "livenet"
 * (a.k.a. "mainnet") and "testnet".
 * @constructor
 */
function Network() {}

Network.prototype.toString = function toString() {
  return this.name;
};

/**
 * @function
 * @member Networks#get
 * Retrieves the network associated with a magic number or string.
 * @param {string|number|Buffer|Network} arg
 * @param {string|Array} keys - if set, only check if the magic number associated with this name matches
 * @return Network
 */
function get(arg, keys) {
  if (~networks.indexOf(arg)) {
    return arg;
  }
  if (keys) {
    if (!_.isArray(keys)) {
      keys = [keys];
    }
    var containsArg = function(key) {
      if (arg instanceof Buffer && networks[index][key] instanceof Buffer) {
        return networks[index][key].equals(arg);
      }
      else {
        return networks[index][key] === arg;
      }
    };
    for (var index in networks) {
      if (_.any(keys, containsArg)) {
        return networks[index];
      }
    }
    return undefined;
  }
  return networkMaps[arg];
}

/**
 * @function
 * @member Networks#add
 * Will add a custom Network
 * @param {Object} data
 * @param {string} data.name - The name of the network
 * @param {string} data.alias - The aliased name of the network
 * @param {Buffer} data.pubkeyAddressPrefix - The publickey address prefix
 * @param {Number} data.pubkeyhash - The publickey hash prefix
 * @param {Number} data.privatekey - The privatekey prefix
 * @param {Buffer} data.scriptAddressPrefix - The script address prefix
 * @param {Number} data.scripthash - The scripthash prefix
 * @param {Number} data.xpubkey - The extended public key magic
 * @param {Number} data.xprivkey - The extended private key magic
 * @param {Number} data.networkMagic - The network magic number
 * @param {Number} data.port - The network port
 * @param {Array}  data.dnsSeeds - An array of dns seeds
 * @return Network
 */
function addNetwork(data) {

  var network = new Network();

  JSUtil.defineImmutable(network, {
    name: data.name,
    alias: data.alias,
    pubkeyAddressPrefix: data.pubkeyAddressPrefix,
    pubkeyhash: data.pubkeyhash,
    privatekey: data.privatekey,
    scriptAddressPrefix: data.scriptAddressPrefix,
    scripthash: data.scripthash,
    xpubkey: data.xpubkey,
    xprivkey: data.xprivkey
  });

  if (data.networkMagic) {
    JSUtil.defineImmutable(network, {
      networkMagic: BufferUtil.integerAsBuffer(data.networkMagic)
    });
  }

  if (data.port) {
    JSUtil.defineImmutable(network, {
      port: data.port
    });
  }

  if (data.dnsSeeds) {
    JSUtil.defineImmutable(network, {
      dnsSeeds: data.dnsSeeds
    });
  }
  _.each(network, function(value) {
    if (!_.isUndefined(value) && !_.isObject(value)) {
      networkMaps[value] = network;
    }
  });

  networks.push(network);

  return network;

}

/**
 * @function
 * @member Networks#remove
 * Will remove a custom network
 * @param {Network} network
 */
function removeNetwork(network) {
  for (var i = 0; i < networks.length; i++) {
    if (networks[i] === network) {
      networks.splice(i, 1);
    }
  }
  for (var key in networkMaps) {
    if (networkMaps[key] === network) {
      delete networkMaps[key];
    }
  }
}

addNetwork({
  name: 'livenet',
  alias: 'mainnet',
  pubkeyAddressPrefix: Buffer.from([0x01, 0x75, 0x07]), // represents "CRW" after converting to base58
  pubkeyhash: 0x00,
  privatekey: 0x80,
  scriptAddressPrefix: Buffer.from([0x01, 0x74, 0xf1]), // represents "CRM" after converting to base58
  scripthash: 0x1c,
  xpubkey: 0x0488b21e,
  xprivkey: 0x0488ade4,
  networkMagic: 0xb8ebb3df,
  port: 9340,
  dnsSeeds: [
    'fra-crwdns.crowndns.info',
    'blr-crwdns.crowndns.info',
    'sgp-crwdns.crowndns.info',
    'lon-crwdns.crowndns.info',
    'nyc-crwdns.crowndns.info',
    'tor-crwdns.crowndns.info',
    'sfo-crwdns.crowndns.info',
    'ams-crwdns.crowndns.info'
  ]
});

/**
 * @instance
 * @member Networks#livenet
 */
var livenet = get('livenet');

addNetwork({
  name: 'testnet',
  alias: 'regtest',
  pubkeyAddressPrefix: Buffer.from([0x01, 0x7a, 0xcd, 0x67]), // represents "tCRW" after converting to base58
  pubkeyhash: 0x6f,
  privatekey: 0xef,
  scriptAddressPrefix: Buffer.from([0x01, 0x7a, 0xcd, 0x51]), // represents "tCRM" after converting to base58
  scripthash: 0xc4,
  xpubkey: 0x043587cf,
  xprivkey: 0x04358394
});

/**
 * @instance
 * @member Networks#testnet
 */
var testnet = get('testnet');


addNetwork({
  name: 'bismuth',
  alias: 'bismuth',
  pubkeyAddressPrefix: Buffer.from([0x4f,0x54,0x5b]), // represents "tCRW" after converting to base58
  pubkeyhash: 0x4f545b,
  privatekey: 0x80,
  scriptAddressPrefix: Buffer.from([0x01, 0x7a, 0xcd, 0x51]), // represents "tCRM" after converting to base58
  scripthash: 0x4f54c8,
  xpubkey: 0x0488b21e,
  xprivkey: 0x0488ade4
});

/**
 * @instance
 * @member Networks#livenet
 */
var bismuth = get('bismuth');

// Add configurable values for testnet/regtest

var TESTNET = {
  PORT: 19340,
  NETWORK_MAGIC: BufferUtil.integerAsBuffer(0x0f180e06),
  DNS_SEEDS: [
    'fra-testnet-crwdns.crowndns.info',
    'blr-testnet-crwdns.crowndns.info',
    'sgp-testnet-crwdns.crowndns.info',
    'lon-testnet-crwdns.crowndns.info',
    'nyc-testnet-crwdns.crowndns.info',
    'tor-testnet-crwdns.crowndns.info',
    'sfo-testnet-crwdns.crowndns.info',
    'ams-testnet-crwdns.crowndns.info'
  ]
};

for (var key in TESTNET) {
  if (!_.isObject(TESTNET[key])) {
    networkMaps[TESTNET[key]] = testnet;
  }
}

var REGTEST = {
  PORT: 19445,
  NETWORK_MAGIC: BufferUtil.integerAsBuffer(0xfbaec6df),
  DNS_SEEDS: []
};

for (var key in REGTEST) {
  if (!_.isObject(REGTEST[key])) {
    networkMaps[REGTEST[key]] = testnet;
  }
}

Object.defineProperty(testnet, 'port', {
  enumerable: true,
  configurable: false,
  get: function() {
    if (this.regtestEnabled) {
      return REGTEST.PORT;
    } else {
      return TESTNET.PORT;
    }
  }
});

Object.defineProperty(testnet, 'networkMagic', {
  enumerable: true,
  configurable: false,
  get: function() {
    if (this.regtestEnabled) {
      return REGTEST.NETWORK_MAGIC;
    } else {
      return TESTNET.NETWORK_MAGIC;
    }
  }
});

Object.defineProperty(testnet, 'dnsSeeds', {
  enumerable: true,
  configurable: false,
  get: function() {
    if (this.regtestEnabled) {
      return REGTEST.DNS_SEEDS;
    } else {
      return TESTNET.DNS_SEEDS;
    }
  }
});

/**
 * @function
 * @member Networks#enableRegtest
 * Will enable regtest features for testnet
 */
function enableRegtest() {
  testnet.regtestEnabled = true;
}

/**
 * @function
 * @member Networks#disableRegtest
 * Will disable regtest features for testnet
 */
function disableRegtest() {
  testnet.regtestEnabled = false;
}

/**
 * @namespace Networks
 */
module.exports = {
  add: addNetwork,
  remove: removeNetwork,
  defaultNetwork: livenet,
  livenet: livenet,
  mainnet: livenet,
  testnet: testnet,
  bismuth: bismuth,
  get: get,
  enableRegtest: enableRegtest,
  disableRegtest: disableRegtest
};
