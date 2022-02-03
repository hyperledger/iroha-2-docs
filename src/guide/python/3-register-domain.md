# 3. Registering a Domain (Python 3)

It is important to remember, that Iroha python is wrapping `rust` code. As such. many of Python's idioms are not yet accommodated: for example, there's no duck-typing of the `Register` instruction.

```python
from iroha2.data_model.isi import *
from iroha2.data_model.domain import *
from iroha2.data_model.expression import *
from iroha2.data_model.events import EventFilter, pipeline
from iroha2.data_model import *

domain = Domain("looking_glass")
register = Register(Expression(Value(Identifiable(domain))))
```

We are creating a domain and wrapping it in multiple type-erasing constructs. A domain is wrapped in `Identifiable` (which would be a trait in `rust`), which is wrapped in `Value`, which is wrapped in `Expression`, which finally is wrapped in the `Register` instruction. This is not entirely against Python's conventions, (it is strongly typed, after all), and not entirely counter-intuitive, once you see the corresponding `rust` code.

The instruction to register must be submitted, in order for anything to happen.

```python
hash = cl.submit_isi(register)
```

Note that we also keep track of the `hash` of the transaction. This will become useful [later](./6-output).
