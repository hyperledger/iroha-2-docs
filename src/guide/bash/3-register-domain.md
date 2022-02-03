# 3. Registering a Domain (Bash)

To get started, you must register a domain. Run

```bash
./iroha_client_cli domain register --id="looking_glass"
```

You will receive a confirmation of the domain creation, however, this information will not be clearly visible within the message. To confirm the new domain _looking_glass_ has been created successfully, run

```bash
./iroha_client_cli domain list all
```

The printout should contain the recently-created _looking_glass_ domain

```rust
Domain {
	name: "looking_glass",
	accounts: {},
	asset_definitions: {},
	metadata: Metadata {
		map: {},
	},
},
```

With a domain available, it is time to register an account.
