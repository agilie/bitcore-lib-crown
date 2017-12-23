'use strict';

let Transaction = require('../transaction');

class MerkleTransaction extends Transaction {
  fromBufferReader(reader) {
    super.fromBufferReader(reader);
    reader.read(32);
    let size = reader.readVarintNum();
    this.merkleBranch = []; // merkle branch of coinbase link
    for (let i = 0; i < size; i++) {
      this.merkleBranch.push(reader.read(32));
    }
    this.merkleBranchSideMask = reader.readUInt32LE(); // branch sides bitmask
    return this;
  }

  fromObject(arg) {
    super.fromObject(arg);
    this.merkleBranch = arg.merkleBranch;
    this.merkleBranchSideMask = arg.merkleBranchSideMask;
    return this;
  }
}

module.exports = MerkleTransaction;
