'use strict';

let Transaction = require('../transaction');
let BufferWriter = require('../encoding/bufferwriter');

class MerkleTransaction extends Transaction {
  fromBufferReader(reader) {
    super.fromBufferReader(reader);
    this.redundantParentBlockHash = reader.read(32);
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
    this.redundantParentBlockHash = arg.redundantParentBlockHash;
    this.merkleBranch = arg.merkleBranch;
    this.merkleBranchSideMask = arg.merkleBranchSideMask;
    return this;
  }

  toBufferWhole() {
    var writer = new BufferWriter();
    return this.toBufferWriterWhole(writer).toBuffer();
  }

  toBufferWriterWhole(writer) {
    super.toBufferWriter(writer);
    writer.write(this.redundantParentBlockHash);
    writer.writeVarintNum(this.merkleBranch.length);
    this.merkleBranch.forEach(m => writer.write(m));
    writer.writeUInt32LE(this.merkleBranchSideMask);
    return writer;
  }
}

module.exports = MerkleTransaction;
