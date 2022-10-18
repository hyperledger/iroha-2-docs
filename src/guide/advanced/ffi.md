# Foreign Function Interfaces (FFI)

As we [mentioned before](./wasm.md), to reduce the sizes of smartcontracts,
we provide a dynamic library in the execution environment. We shall detail
how to link against that library and use the functions at a later date, but
for now, let's explore how to include functions and trait implementations
into that library.

## Why FFI

A function is a rather abstract entity, and while most languages agree on
what a function should do, the way in which said functions are represented
is very different. Moreover, in some languages (like Rust), the
consequences of calling a function, and the things that it is allowed to do
are different. Because one can use any language to create a
[WASM smartcontract](./wasm.md), we need to level the playing field. This
is where the concept of foreign function interface (FFI) comes in.

The main standard used today is the C application binary interface. It's
simple, it's guaranteed to be available even in languages which can't
compile to WASM, and it's stable. In principle, you could do everything
manually, but Iroha provides you with a crate `iroha_ffi` which contains
all you need to generate FFI-compliant functions out of your existing `Rust` API. 

Automatic generation of FFI bindings and conversion of types alleviates the user of the mental dilligence required not to induce UB when interfacing `unsafe` code which essentially every FFI function call is. This is achieved by insisting that every type used in the generated extern function API is a **robust** `repr(C)` type. The only notable exception being pointers where, except for the null check, pointer validity cannot be determined.

## Example

```rs
#[derive(FfiType)]
struct DaysSinceEquinox(u32);

#[ffi_export]
impl DaysSinceEquinox {
    pub fn update_value(&mut self, a: &u8) {
        self.0 = *a as u32;
    }
}
```

will generate the following binding with `DaysSinceEquinox` represented as an opaque pointer:

```rs
pub extern fn DaysSinceEquinox__update_value(handle: *mut DaysSinceEquinox, a: *const u8) -> FfiReturn {
    // function implementation
}
```

## FFI Binding Generation

The `iroha_ffi` crate is used to generate functions that are callable via FFI out of existing `Rust` structs and methods.

A Rust type is converted into a robust `repr(C)` type that can cross FFI boundary with `FfiType::into_ffi`. This goes the other way around as well: FFI `ReprC` type is converted into a `Rust` type via `FfiType::try_from_ffi`. Obviously, the conversion in the other direction is fallible and the library makes the best effort to protect the caller from all possible forms of accidental UB. 

The diagram below uses the creation of a new domain as an example to show the conversion process (more on the name mangling semantics in a
[separate section](#name-mangling)).

![Untitled](/img/ffi.png)

The main traits that enable binding generation are `ReprC`, `FfiType` and `FfiConvert`

<!-- Check: might change in future releases -->

| Trait        | Description                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| `ReprC`      | This trait represents a robust type that conforms to C ABI. The type can be safely shared across FFI boundaries.    |
| `FfiType`    | This trait defines a corresponding `ReprC` type for a given `Rust` type. The defined `ReprC` type is used in place of the `Rust` type in the API of the generated FFI function.|
| `FfiConvert` | This trait defines two methods `into_ffi` and `try_from_ffi` that are used to perform the conversion of the `Rust` type to/from `ReprC` type. |

Note that there is no ownership transfer over FFI except for opaque pointer types. Any other types that carry ownership, such as `Vec<T>`, are cloned.

### Name Mangling

Note the use of double underscores in generated names of FFI objects:

- For the `inherent_fn` method defined on the `StructName` struct, the FFI name would be `StructName__inherent_fn`.
- For the `MethodName` method from the `TraitName` trait in `StructName` struct, the FFI name would be `StructName__TraitName__MethodName`.
- For setting the `field_name` field in `StructName` struct, the FFI function name would be `StructName__set_field_name`.
- For getting the `field_name` field in `StructName` struct, the FFI function name would be `StructName__field_name`.
- For getting the mutable `field_name` field in `StructName` struct, the FFI function name would be `StrucuName__field_name_mut`.
- For the freestanding `module_name::fn_name`, the FFI name would be `module_name::__fn_name`.
- For the traits that are not generic and allow sharing their implementation in the FFI (see `Clone` below), the FFI name would be `module_name::__clone`.

  ```rust
  impl Clone for Type1 {
      fn clone(&self) -> Self;
  }
  impl Clone for Type2 {
      fn clone(&self) -> Self;
  }
  ```
