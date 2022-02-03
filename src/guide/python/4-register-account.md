# 4. Registering an Account (Python 3)

Similarly to the previous case. Except the wrapping structures are different. There are a couple of things to watch out for: First of all, we can only register an account to an existing domain. The best UX design practices dictate that you should check if the requested domain exists now, and if it doesn’t — suggest a fix to the user.

```python
from iroha2.data_model.isi import *
from iroha2.data_model.domain import *
from iroha2.data_model.expression import *
from iroha2.data_model.events import EventFilter, pipeline
from iroha2.data_model import *

public_key = … # Get this from late_bunny.
bunny = Account("late_bunny", "looking_glass", signatories=[public_key])
register = Register(Expression(Value(Identifiable(bunny))))
```

Second, you should provide the account with a public key. It is tempting to generate both it and the private key at this time, but it isn't the brightest idea. Remember, that _the late_bunny_ trusts _you, alice@wonderland,_ to create an account for them in the domain _looking_glass, **but doesn't want you to have access to that account after creation**._ If you gave _late_bunny_ a key that you generated yourself, how would they know if you don't have a copy of their private key? Instead, the best way is to **ask** _late_bunny_ to generate a new key-pair, and give you the public half of it.

After putting all of this together, we submit it as before:

```python
hash = cl.submit_isi(register)
```
