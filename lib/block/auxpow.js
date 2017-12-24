'use strict';

let MerkleTransaction = require('./merkletransaction');

class AuxPow extends MerkleTransaction {
  fromBufferReader(reader) {
    super.fromBufferReader(reader);
    let size = reader.readVarintNum();
    this.chainMerkleBranch = []; // merkle branch of aux blockchain link
    for (let i = 0; i < size; i++) {
      this.chainMerkleBranch.push(reader.read(32));
    }
    this.chainMerkleBranchSideMask = reader.readUInt32LE(); // branch sides bitmask

    // This import couldn't be at the top of file due to cyclic problem.
    let BlockHeader = require('./blockheader');

    this.parentBlockHeader = BlockHeader.fromBufferReader(reader);
    return this;
  }

  fromObject(arg) {
    super.fromObject(arg);
    this.chainMerkleBranch = arg.chainMerkleBranch;
    this.chainMerkleBranchSideMask = arg.chainMerkleBranchSideMask;
    this.parentBlockHeader = arg.parentBlockHeader;
    return this;
  }
}

module.exports = AuxPow;
