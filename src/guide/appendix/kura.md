# Kura

Kura is the “warehouse” engine of Iroha; it can store blocks in custom locations, if for some reason `./blocks` is not available or desirable. There are plans to make Iroha’s storage tiered: when you reach a certain number of blocks, they get moved elsewhere.
The `KURA` init mode at present does nothing. In the future, it will affect whether or not your block storage does a `strict` initialisation: checks everything, or a `fast` one, where everything is “probably alright™”.
