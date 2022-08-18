# Foreign Function Interfaces (FFI)

As we mentioned before, Iroha 2 relies on the C-linkage to generate
[WASM](./wasm.md) bindings, and the `iroha_wasm` crate deals with foreign
function interfaces (FFI). Here we will discuss in more detail how Iroha 2
handles FFI logic.

## FFI Binding Generation

The `iroha_ffi` crate is used to generate functions that are callable via
FFI.

A Rust structure is converted into an intermediary FFI struct via `IntoFfi`
trait, which implements the `AsReprCRef` trait and can be converted into a
type that can cross FFI boundary. This goes the other way around as well:
FFI ReprC type is converted into a struct via `TryFromReprC`.

The diagram below uses the creation of a new domain as an example to show
the conversion process (more on the name mangling semantics in a
[separate section](#name-mangling)).

![Untitled](/img/ffi.png)

The traits that enable binding generation are `ReprC`, `AsReprCRef`,
`TryFromReprC`, and `IntoFfi`:

| Trait          | Description                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| `ReprC`        | This trait represents the robust type that conforms to C ABI. The type can be safely shared across FFI boundaries. |
| `AsReprCRef`   | This trait is used to convert from a Rust type reference to `ReprC` reference.                                     |
| `TryFromReprC` | This trait is used to perform a conversion from a type that implements `ReprC`.                                      |
| `IntoFfi`      | This trait is used to convert into a type that can then be converted to an FFI-compatible `ReprC` type.                 |

Note that there is no ownership transfer over FFI except for opaque pointer
types.

### Name Mangling

Note the use of double underscores in generated names of FFI objects:

- For the `inherent_fn` function in the `StructName` struct, the FFI name
  would be `StructName__inherent_fn`.
- For the `trait_method_name` method in `StructName` struct, the FFI name
  would be `StructName__trait_method_name`.
- For setting the `field_name` field in `StructName` struct, the FFI name
  would be `StrucuName__set_field_name`.
- For getting the `field_name` field in `StructName` struct, the FFI name
  would be `StrucuName__field_name`.
- For getting the mutable `field_name` field in `StructName` struct, the
  FFI name would be `StrucuName__field_name_mut`.
- For the `method_name` method in `module_name`, the FFI name would be
  `module__name::__method_name`.
