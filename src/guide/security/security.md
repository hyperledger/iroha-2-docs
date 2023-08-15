# Security

This section provides a comprehensive overview of the foundational principles and practices that ensure the robustness and integrity of your Iroha 2 blockchain environment.

This section covers the following topics:

- [**Security Principles**](./security-principles.md): Study the guidelines for both individual users and organizations to enhance network and data protection, authentication, and communication while fostering a culture of continuous improvement.

    - [General Security Principles](./security-principles.md#general);

    - [Security Principles for Individual Users](./security-principles.md#users);

    - [Security Principles for Organizations](./security-principles.md#orgs).

- [**Operational Security**](./operational-security.md): Explore the systematic approach to cybersecurity and risk management that focuses on strategies to prevent unauthorized access and protect sensitive data.

    - [Recommended OpSEC Measures](./operational-security.md#measures);

    - [Using Browsers](./operational-security.md#browsers);

    - [Recovery Plan](./operational-security.md#recovery).

- [**Public Key Cryptography**](./public-key-cryptography.md): Learn how encryption and digital signatures ensure privacy, authenticity, and data integrity.

    - [Encryption and Signatures](./public-key-cryptography.md#encryption-and-signatures)

  - [**Generating Cryptographic Keys**](./generating-cryptographic-keys.md): Learn about generating cryptographic keys using `kagami`, the designated tool in-built into the Iroha 2 framework.

    - [Generating Cryptographic Keys with Kagami](./generating-cryptographic-keys.md#kagami);

    - [Other Operations with Kagami](./generating-cryptographic-keys.md#kagami-other):

    - [Building `kagami`](./generating-cryptographic-keys.md#kagami-op1);

    - [Moving `kagami` to the `/bin` directory](./generating-cryptographic-keys.md#kagami-op2);

    - [Moving `kagami` to the `.local/bin` directory](./generating-cryptographic-keys.md#kagami-op3);

    - [Making the `<username>/.local/bin` directory available to the shell](./generating-cryptographic-keys.md#kagami-op4).

  - [**Storing Cryptographic Keys**](./storing-cryptographic-keys.md): Learn about storing cryptographic keys safely with a number of proven methods.

    - [Storing Cryptographic Keys Digitally](./storing-cryptographic-keys.md#store-digitally):

      - [Using SSH and SSH Agent](./storing-cryptographic-keys.md#ssh-and-ssh-agent);

      - [Adding a Password Manager Program](./storing-cryptographic-keys.md#password-manager):

        - [Configuring KeePassXC](./storing-cryptographic-keys.md#store-digitally#keepassxc).

    - [Storing Cryptographic Keys Physically](./storing-cryptographic-keys.md#store-physically):

      - [Using a Hardware Key](./storing-cryptographic-keys.md#hardware-key);

      - [Using a Mnemonic Phrase](./storing-cryptographic-keys.md#mnemonic-phrase).

  - [**Keys for Deploying a Network**](./keys-for-network-deployment.md): Learn about the important aspects of deploying a custom instance of the Iroha 2 hyperledger.

      - [Setting Keys For a New Network](./keys-for-network-deployment.md#setting-keys);

      - [Keys on the Client Side](./keys-for-network-deployment.md#client-side).
