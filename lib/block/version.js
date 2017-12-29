'use strict';

class Version {
  constructor(version) {
    this.version = version;
  }

  getBaseVersion () {
    return this.version % Version.AUXPOW;
  }

  getChainId() {
    return Math.floor(this.version / Version.CHAIN_START);
  }

  isAuxPow() {
    return (this.version & Version.AUXPOW) !== 0;
  }

  isLegacy() {
    return this.version < Version.AUXPOW;
  }
}

Version.AUXPOW = 0x100;
Version.CHAIN_START = 0x10000;
Version.CHAIN_ID = 20;

module.exports = Version;
