'use strict';

let MerkleTransaction = require('./merkletransaction');
let Hash = require('../crypto/hash');
let BufferUtil = require('../util/buffer');

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

    this.parentBlockHeader = new BlockHeader(reader.read(80));
    return this;
  }

  fromObject(arg) {
    super.fromObject(arg);
    this.chainMerkleBranch = arg.chainMerkleBranch;
    this.chainMerkleBranchSideMask = arg.chainMerkleBranchSideMask;
    this.parentBlockHeader = arg.parentBlockHeader;
    return this;
  }

  toBufferWriterWhole(writer) {
    super.toBufferWriterWhole(writer);
    writer.writeVarintNum(this.chainMerkleBranch.length);
    this.chainMerkleBranch.forEach(m => writer.write(m));
    writer.writeUInt32LE(this.chainMerkleBranchSideMask);
    this.parentBlockHeader.toBufferWriter(writer);
    return writer;
  }

  check(blockHash, chainId) {
    let chainRootHash = BufferUtil.reverse(AuxPow._computeMerkleBranch(
      blockHash,
      this.chainMerkleBranch,
      this.chainMerkleBranchSideMask
    ));
    let scriptSig = this.inputs[0]._scriptBuffer;
    let symbolPos = scriptSig.indexOf(AuxPow.SCRIPT_SYMBOL);
    let hashPos = scriptSig.indexOf(chainRootHash);

    if (!BufferUtil.equals(
      AuxPow._computeMerkleBranch(this._getHash(), this.merkleBranch, this.merkleBranchSideMask), this.parentBlockHeader.merkleRoot
    )) throw new Error();

    if (hashPos === -1) throw new Error("Chain merkle root not found in parent block coinbase scriptSig.");

    if (symbolPos !== -1) {
    }
    else {
      if (hashPos > 20) throw new Error();
    }
  }

  static _computeMerkleBranch(hash, merkleBranch, sideMask) {
    if (merkleBranch.length > 30) throw new Error("Merkle branch too long.");
    merkleBranch.forEach(item => {
      if (sideMask & 1) {
        hash = Hash.sha256sha256(Buffer.concat([item, hash]));
      }
      else {
        hash = Hash.sha256sha256(Buffer.concat([hash, item]));
      }
      sideMask >>= 1;
    });
    return hash;
  }
}

AuxPow.SCRIPT_SYMBOL = Buffer.from("fabe6d6d","hex");

module.exports = AuxPow;
