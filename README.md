bitcore-lib-crown
=================

This package is under development. It may be unstable, or not work as expected.

What's Different
================

This package is a variant of [bitcore-lib](https://www.npmjs.com/package/bitcore-lib) with some differences.

`BlockHeader` instance now has a property `auxPow` (an `AuxPow` instance). `AuxPow` inherits `MerkleTransaction`, and `MerkleTransaction` inherits `Transaction`. The same mechanism can be found in Crown Core.

Note that by definition, AuxPow doesn't belong to the block header. `BlockHeader` has `auxPow` property just for convenience. The AuxPow data doesn't contribute to computing the block hash. The return values of `toBuffer`, `toObject` and `toJSON` method of `BlockHeader` also don't include the AuxPow data.

`BlockHeader` instance now has a property `versionObject`. AuxPow validation needs it. Our block version number is more complex than Bitcoin.

Note that the return values of `toBuffer`, `toObject` and `toJSON` method of `MerkleTransaction` and `AuxPow` don't include the coinbase link, aux blockchain link or the parent block header. It only includes the parent block coinbase transaction, that is, the first part of the AuxPow data. `hash` property and `_getHash` method also refers to the hash of this part. So, the `AuxPow` class should be treated as just a part of the whole AuxPow. Other parts are in its properties just for convenience.

The return values of `toBuffer`, `toObject` and `toJSON` method of `Block` include the whole AuxPow data.

`BlockHeader`'s `validProofOfWork` method now checks AuxPow if it's an AuxPow block, while still using the original way if it's a legacy block (not AuxPow).

Contributing
============

See `CONTRIBUTING.md` file.

License
=======

See `LICENSE` file.
