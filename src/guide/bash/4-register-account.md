# 4. Registering an Account (Bash)

To register a new account within the _looking_glass_ domain, run:

```bash
./iroha_client_cli account register \
    --id="mad_hatter@looking_glass" \
    --key="ed0120a753146e75b910ae5e2994dc8adea9e7d87e5d53024cfa310ce992f17106f92c"
```

If the account registration is successful, you will receive a confirmation message. Like before, it is necessary to query the accounts list to verify that _mad_hatter_ has been registered.

To see all the accounts on the network, run

```bash
./iroha_client_cli account list all
```

This will list the active accounts on the network, along with their assets

```rust
Account {
	id: Id {
		name: "mad_hatter",
		domain_name: "looking_glass",
	},
	assets: {},
	signatories: [
	PublicKey {
		digest_function: "ed25519",
		payload: "A753146E75B910AE5E2994DC8ADEA9E7D87E5D53024CFA310CE992F17106F92C",
	},
}
```

Another way to create a user (and the user's keys) is as follows:

Open a new tab and navigate to the `/iroha` directory, then run

```bash
./target/debug/iroha_crypto_cli
```

Copy the public key, and repeat the instructions for registering a new account. Every time you run this command, you will generate a new keypair.

In this case, we will create an account for _late_bunny_ within the _looking_glass_ domain, so we will run

```bash
./iroha_client_cli account register \
    --id="late_bunny@looking_glass" \
    --key="ed0120a4c4dadd9f18b0f63d6a420151fe0748d785475dec63034a15fcf999ceda1e65"
```

And like before, the new active user will be listed on the network

```rust
Account {
        id: Id {
            name: "late_bunny",
            domain_name: "looking_glass",
        },
        assets: {},
        signatories: [
            PublicKey {
                digest_function: "ed25519",
                payload: "A4C4DADD9F18B0F63D6A420151FE0748D785475DEC63034A15FCF999CEDA1E65",
            },
        ]
}
```

Now that the network and users are registered, it is possible to mint assets.
