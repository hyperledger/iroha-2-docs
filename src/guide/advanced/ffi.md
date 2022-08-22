# Foreign Function Interfaces (FFI)

As we mentioned before, Iroha 2 relies on the C-linkage to generate
[WASM](./wasm.md) bindings, and the `iroha_wasm` crate deals with foreign
function interfaces (FFI). Here we will discuss in more detail how Iroha 2
handles FFI logic.

## FFI Binding Generation

The `iroha_ffi` crate is used to generate functions that are callable via
FFI.

A Rust structure is converted into an intermediary FFI struct via the
`IntoFfi` trait, which implements the `AsReprCRef` trait, and can be
converted into a type that can cross FFI boundary. This goes the other way
around as well: FFI ReprC type is converted into a struct via
`TryFromReprC`.

The diagram below uses the creation of a new domain as an example to show
the conversion process (more on the name mangling semantics in a
[separate section](#name-mangling)).

![Untitled](/img/ffi.png)

The traits that enable binding generation are `ReprC`, `AsReprCRef`,
`TryFromReprC`, and `IntoFfi`:

<!-- Check: might change in future releases -->

| Trait          | Description                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| `ReprC`        | This trait represents the robust type that conforms to C ABI. The type can be safely shared across FFI boundaries. |
| `AsReprCRef`   | This trait is used to convert from a Rust type reference to `ReprC` reference.                                     |
| `TryFromReprC` | This trait is used to perform a conversion from a type that implements `ReprC`.                                    |
| `IntoFfi`      | This trait is used to convert into a type that can then be converted to an FFI-compatible `ReprC` type.            |

Note that there is no ownership transfer over FFI except for opaque pointer
types.

### Name Mangling

Note the use of double underscores in generated names of FFI objects:

- For the `inherent_fn` function in the `StructName` struct, the FFI name
  would be `StructName__inherent_fn`.
- For the `MethodName` method from the `TraitName` trait in `StructName`
  struct, the FFI name would be `StructName__TraitName__MethodName`.
- For setting the `field_name` field in `StructName` struct, the FFI name
  would be `StrucuName__set_field_name`.
- For getting the `field_name` field in `StructName` struct, the FFI name
  would be `StrucuName__field_name`.
- For getting the mutable `field_name` field in `StructName` struct, the
  FFI name would be `StrucuName__field_name_mut`.
- For the freestanding `fn_name` function in `module_name`, the FFI name
  would be `module_name::__fn_name`.
- For the traits that are not generic and allow sharing their
  implementation in the FFI (see `Clone` below), the FFI name would be
  `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
