# Generating Cryptographic Keys

In the realm of blockchain technology, cryptographic keys play a crucial role in upholding the security and authenticity of data transactions. With Iroha 2, you can create these vital keys for safeguarding your digital assets and communications.

This section describes how to generate keys using `kagami` a supporting tool shipped alongside the node program.

In the future, alternative methods of generating public keys shall be added.

## Generating Cryptographic Keys with Kagami {#kagami}

::: tip Note

Iroha 2 and specifically the integrated `kagami` toolset do not come with a manual page.

You can use the `--help` (`-h`) command to retrieve a brief summary of all the usable `kagami` parameters within the CLI you are using.

:::

To generate a new key pair having only just cloned the Iroha repo, run the following command from the project root.

```bash

$ cargo run --bin kagami crypto

```

You can specify a number of different parameters to tailor the generated key pair to your specific needs. The following parameters are available:

  - `--algorithm` (`-a`): Specifies the algorithm used for the key pair generation and encryption. If no algorithm is specified, `ed25519` is used by default.
    Can be one of the following:

    - `ed25519` — an elliptic curve cryptography (ECC) algorithm that utilizes the Ed25519 curve, offering efficient and secure cryptographic operations for digital signatures and key exchange.

    - `secp256k1` — an elliptic curve cryptography (ECC) algorithm known for its application in blockchain systems like Bitcoin. It provides a robust foundation for secure key generation, digital signatures, and encryption.

    - `bls_small` — Boneh-Lynn-Shacham algorithm with a _small_ parameter configuration. This variant of the BLS cryptographic scheme is optimized for efficiency in certain resource-constrained environments while maintaining fundamental security properties.

    - `bls_normal` — Boneh-Lynn-Shacham algorithm with a _standard_ parameter configuration. This configuration of the BLS cryptographic scheme offers a balanced approach between efficiency and security, making it suitable for a wide range of applications in blockchain and cryptographic protocols.

  - `--seed` (`-s`): Specifies a string that serves as a deterministic starting point for the key pair generation. If a seed string is specified, `kagami` crypto will generate the same key for the same string. If no seed is specified, a random `seed` value is chosen, and each invocation of `kagami crypto` will result in a different key. This parameter accepts a valid string of [Unicode](https://home.unicode.org/) characters. For example, the seed string can contain not only numeric and latin, but also cyrillic, logographic (e.g., Japanese kanji characters) and ideographic (e.g., emojis) characters, as well as any font-related variations of those characters introduced to Unicode over the years.

  If one chooses to use a `seed` it must be treated as if it were a password: more randomness and longer seed strings make the cryptographic keys more resilient to [dictionary attacks](https://en.wikipedia.org/wiki/Dictionary_attack).

  - `--private-key` (`-p`): Specifies an existing private key as a string in the [`multihash`](https://github.com/multiformats/multihash) format that is used as to generate a _public_ key.

  - `--json` (`-j`): Specifies that the output must be generated in the JSON format, which is mostly useful for copy-and-pasting into the `config.json`.

  - `--compact` (`-c`): Specifies that the output private and public keys are displayed on separate lines and are not labeled.

**Examples**:

::: code-group Examples

```bash [No parameters]

# Input
$ cargo run --bin kagami crypto

# Possible Output (same layout, different keys)
Public key (multihash): "ed01206B0F56F58761060056355DBA0E0FC489CFB2F974481ED64873082E6032796235"
Private key (ed25519): "F71EA9D897C4338CBF4F1DC7B492AAD0BF6CE896B803D7CDB9CF25ECC15109826B0F56F58761060056355DBA0E0FC489CFB2F974481ED64873082E6032796235"

```

```bash [--algorithm]

# Input
$ cargo run --bin kagami crypto -a secp256k1

# Possible output
Public key (multihash): "e70121022A9D6E0D54022C0E2752E43ADD91ADA28259E1F2CE0C6D4E9183FB2882DE6749"
Private key (secp256k1): "7687B1433FB6731E6DC635A376B3EB3B5FCD1E02C9775C1642E7FD5DA035EC75"

```

```bash [--seed]

# Input
$ cargo run --bin kagami crypto -s 1729

# Exact output
Public key (multihash): "ed0120B678073CFAE6E247A58B442661C7DA0E13BAC5031CBC6343EF566B8718D47D04"
Private key (ed25519): "2669BB1099477B970E1D7D7C54E345A64A54213FCFBA2465CBCD6D4E5091A71DB678073CFAE6E247A58B442661C7DA0E13BAC5031CBC6343EF566B8718D47D04"

```

```bash [--private-key]

# Input
$ cargo run --bin kagami crypto -p 2669BB1099477B970E1D7D7C54E345A64A54213FCFBA2465CBCD6D4E5091A71DB678073CFAE6E247A58B442661C7DA0E13BAC5031CBC6343EF566B8718D47D04

# Exact output
Public key (multihash): "ed0120B678073CFAE6E247A58B442661C7DA0E13BAC5031CBC6343EF566B8718D47D04"
Private key (ed25519): "2669BB1099477B970E1D7D7C54E345A64A54213FCFBA2465CBCD6D4E5091A71DB678073CFAE6E247A58B442661C7DA0E13BAC5031CBC6343EF566B8718D47D04"

```

```bash [--json]

# Input
$ cargo run --bin kagami crypto -j

# Possible output
{
  "public_key": "ed0120B678073CFAE6E247A58B442661C7DA0E13BAC5031CBC6343EF566B8718D47D04",
  "private_key": {
    "digest_function": "ed25519",
    "payload": "2669bb1099477b970e1d7d7c54e345a64a54213fcfba2465cbcd6d4e5091a71db678073cfae6e247a58b442661c7da0e13bac5031cbc6343ef566b8718d47d04"
  }
}

```

```bash [--compact]

# Input
$ cargo run --bin kagami crypto -c

# Possible output
ed0120B678073CFAE6E247A58B442661C7DA0E13BAC5031CBC6343EF566B8718D47D04
2669BB1099477B970E1D7D7C54E345A64A54213FCFBA2465CBCD6D4E5091A71DB678073CFAE6E247A58B442661C7DA0E13BAC5031CBC6343EF566B8718D47D04
ed25519

```

```bash [Combination of parameters]

# Input
$ cargo run --bin kagami crypto -a bls_normal -s 2048

# Exact output
Public key (multihash): "ea01610402A54ABCC40819F15E3553CC8D42D628EEAD7E1B10724BD2AFE523A7C0446EB1CB3F14D4500BD68C997784136FD056BA04215DFD2D3FDC7883B43AE94AC52B7D01525F5A80B41C01701502B46DBB9F0384CC7BE037DC2CBC928014E52A4C5C3B"
Private key (bls_normal): "0000000000000000000000000000000035D9120A174E35E966DD92DE90B2446D4B060C8B72018B3917A1C97D7E93EAEC"

```

:::

---

### Other Operations with Kagami

#### 1. Building `kagami`

The Iroha v2 node binary as well as all supporting tools are supplied in the official docker image. However, such usage is cumbersome, as `kagami` is meant to be used as a standalone external tool. As such, it is useful to show how to build `kagami` from source.

To build `kagami`, run the following:

```bash
$ cargo build --bin kagami
```

This will produce a single statically linked executable in the target/debug directory, that still links dynamically against the system-provided standard C-library.

::: info Note

Iroha and all supporting tools can also be built to statically link against the musl standard library, which allows the application to run on any POSIX-compliant ELF-capable system (all GNU+Linux distributions, some BSD variants).

:::

#### 2. Installing the source-built `kagami` into `/bin`

There are multiple ways to make your command line be able to use the `kagami` version that you have just compiled. One of the easiest ways that should work on most systems is to move or link the binary into the `/bin` directory on UNIX systems.

```bash
$ sudo mv target/debug/kagami /bin
```

#### 3. Moving `kagami` to the `.local/bin` directory

To circumvent the requirement of having the binary in the global binary folder, and thus necessarily exposing the binary to all other users, as well as requiring root authentication (which is not always available), one can instead install the application as a regular user.

To move `kagami` to the authenticated user's `.local/bin` directory, making it uniquely accessible only by that user, run the following:

```bash
$ mv target/debug/kagami ~/.local/bin
```

This trick works on most GNU Linux distributions, but is not guaranteed to do so. In order to have the desired effect please do the following:

1. Ensure that the directory exists, easiest method to do so is to run

```bash
mkdir -p ~/.local/bin
```

If this command fails, you have an exotic permissions set up and should consult your systems administrator (or look for an answer online).

Ensure that the PATH environment variable exported into your current shell contains the directory ~/.local/bin.

There are multiple ways of doing that:

for `zsh` (default on Mac OS) The [Arch Wiki](https://wiki.archlinux.org/title/Zsh#Configuring_$PATH) states that the best way to configure the `PATH` variable is by modifying the `.zshenv` file: ```zsh typeset -U path PATH path=(~/.local/bin $path) export PATH ```
While the same statements can be added to .zshrc they do not belong there and will be overridden by e.g. oh-my-zsh and other package distributions.

on `fish` The friendly interactive shell has the simplest method for adding directories to the `PATH` variable.
fish_add_path ~/.local/bin
removing this from PATH may be problematic, as it is not a one-to-one correspondence as with other POSIX-compliant shells.

for `bash`
For the longest time the Bourne again shell was considered the standard POSIX-compliant shell for UNIX-like operating systems. It is the default on many GNU Linux distributions with very few notable exceptions (Arch Linux). To add the path to PATH, execute the following:

echo 'export PATH=~/.local/bin:$PATH' >> ~/.bash_profile
which will be read automatically.

In addition to the above methods, please consult the shell manual or consider adding the PATH variant to the terminal session configuration.

#### Making the `<username>/.local/bin` directory available to the shell

To make the `<username>/.local/bin` directory available to your shell's `.rc` file, perform the following:

  1. Check if `kagami` is available by running the following:

  ```bash

  $ whereis kagami
  kagami:

  ```

  2. Depending on the shell that you are using, perform one of the following:

    - **If using [Bash](https://www.gnu.org/software/bash/)**: Fix the `PATH` variable for the shell and then reload the `.bashrc` script by running the following:

      ```bash

      $ echo "export PATH='${HOME}/.local/bin:${PATH}'" >> ~/.bashrc
      $ source ~/.bashrc

      ```

    - **If using [Zsh](https://www.zsh.org/)**: Fix the `PATH` variable for the shell and reload the `.zshrc` script by running the following:

      ```bash

      $ echo "export PATH='${HOME}/.local/bin:${PATH}'" >> ~/.zshrc
      $ source ~/.zshrc

      ```

    - **If using [fish](https://fishshell.com/)**: Fix the `PATH` variable for the shell variable permanently by running the following:

      ```bash
      $ fish_add_path ~/.local/bin
      ```
