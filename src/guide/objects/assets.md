# Assets

Iroha has been built with few underlying assumptions about what the assets
need to be.

The assets can be **fungible** (every £1 is exactly the same as every other
£1) or **non-fungible** (a £1 bill signed by the Queen of Hearts is not the
same as a £1 bill signed by the King of Spades).

The assets can also be **mintable** (you can make more of them) and
**non-mintable** (you can only specify their initial quantity in the
[genesis block](../configure/genesis.md)).

## Value Types

Additionally, the assets have different underlying value types.
Specifically, we have `AssetValueType.Quantity`, which is effectively an
unsigned 32-bit integer, a `BigQuantity`, which is an unsigned 128-bit
integer, and `Fixed`, which is a positive (though signed) 64-bit
fixed-precision number with nine significant digits after the decimal
point. All three types can be registered as either **mintable** or
**non-mintable**.

There is also the `Store` asset type, which is used for storing key-values
in object's metadata. We talk in detail about `Store` asset in the chapter
related to [metadata](metadata.md).

## Asset Structure

![Untitled](/img/asset-diagram.png)

## Instructions

Assets can be [registered](../advanced/isi.md#unregister) and
[minted/burned](../advanced/isi.md#mintburn).

Refer to one of the language-specific guide to walk you through the process
of registering and minting assets in a blockchain:

- [Bash](../bash.md#_5-registering-and-minting-assets)
- [Rust](../rust.md#_5-registering-and-minting-assets)
- [Kotlin/Java](../kotlin-java.md#_5-registering-and-minting-assets)
- [Python](../python.md#_5-registering-and-minting-assets)
- [JavaScript/TypeScript](../javascript.md#_5-registering-and-minting-assets)
