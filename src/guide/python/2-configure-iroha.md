# 2. Configuring Iroha 2 (Python 3)

Unlike `iroha_client_cli` finding the configuration file in a scripting language is the responsibility of the person writing the script. The easiest method is to de-serialise a dictionary type from the provided `config.json` .

This is an example of how you could do that in Python:

```python
import json
from iroha2 import Client

cfg = json.loads(open("config.json").read())
cl = Client(cfg)
```

If the configuration file is malformed, you can expect an `exception` to notify you. However, the client doesn't do any verification: if the account used in `config.json` is not in the blockchain, or has the wrong private key, you won't know that until you try and execute a simple instruction. More on that in the following section.

It should also be noted that Iroha Python is under heavy development. It severely lacks in documentation, and its API can be made more idiomatically Python. At the time of writing there are no active maintainers of the Iroha Python library.
