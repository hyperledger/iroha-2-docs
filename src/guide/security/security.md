# Security

This section provides a comprehensive overview of the foundational principles and practices that ensure the robustness and integrity of your Iroha 2 blockchain environment.

This section covers the following topics:

  1. [**Security Principles**](/security-principles.md): Study the guidelines for both individual users and organizations to enhance network and data protection, authentication, and communication while fostering a culture of continuous improvement.

      - [General Security Principles](/security-principles.md#general);

      - [Security Principles for Individual Users](/security-principles.md#users);

      - [Security Principles for Organizations](/security-principles.md#orgs).

  2. [**Operational Security**](/operational-security.md): Explore the systematic approach to cybersecurity and risk management that focuses on strategies to prevent unauthorized access and protect sensitive data.

      - [Recommended OpSEC Measures](/operational-security.md#measures);

      - [Using Browsers](/operational-security.md#browsers);

      - [Recovery Plan](/operational-security.md#recovery).

  3. [**Public Key Cryptography**](/public-key-cryptography.md): Learn how encryption and digital signatures ensure privacy, authenticity, and data integrity.

      - [Encryption and Signatures](/public-key-cryptography.md#encryption-and-signatures)

    1. [**Generating Cryptographic Keys**](/generating-cryptographic-keys.md): Learn about generating cryptographic keys using `kagami`, the designated tool in-built into the Iroha 2 framework.

      - [Generating Cryptographic Keys with Kagami](/generating-cryptographic-keys.md#kagami);

      - [Other Operations with Kagami](/generating-cryptographic-keys.md#kagami-other):

        - [Building `kagami`](/generating-cryptographic-keys.md#kagami-op1);

        - [Moving `kagami` to the `/bin` directory](/generating-cryptographic-keys.md#kagami-op2);

        - [Moving `kagami` to the `.local/bin` directory](/generating-cryptographic-keys.md#kagami-op3);

        - [Making the `<username>/.local/bin` directory available to the shell](/generating-cryptographic-keys.md#kagami-op4).

    2. [**Storing Cryptographic Keys**](/storing-cryptographic-keys.md): Learn about storing cryptographic keys safely with a number of proven methods.

      - [Storing Cryptographic Keys Digitally](/storing-cryptographic-keys.md#store-digitally):

        - [Using SSH and SSH Agent](/storing-cryptographic-keys.md#ssh-and-ssh-agent);

        - [Adding a Password Manager Program](/storing-cryptographic-keys.md#password-manager):

          - [Configuring KeePassXC](/storing-cryptographic-keys.md#store-digitally#keepassxc).

      - [Storing Cryptographic Keys Physically](/storing-cryptographic-keys.md#store-physically):

        - [Using a Hardware Key](/storing-cryptographic-keys.md#hardware-key);

        - [Using a Mnemonic Phrase](/storing-cryptographic-keys.md#mnemonic-phrase).

    3. [**Keys for Deploying a Network**](/keys-for-network-deployment.md): Learn about the important aspects of deploying a custom instance of the Iroha 2 hyperledger.

      - [Setting Keys For a New Network](/keys-for-network-deployment.md#setting-keys);

      - [Keys on the Client Side](/keys-for-network-deployment.md#client-side).


---

# Security

This section provides a comprehensive overview of the foundational principles and practices that ensure the robustness and integrity of your Iroha 2 blockchain environment.

This section cover the following topics:

## Security Principles

Study the guidelines for both individual users and organizations to enhance network and data protection, authentication, and communication while fostering a culture of continuous improvement.

This topic covers the following:

- General Security Principles

- Security Principles for Individual Users

- Security Principles for Organizations

## Operational Security

Explore the systematic approach to cybersecurity and risk management that focuses on strategies to prevent unauthorized access and protect sensitive data.

This topic covers the following:

- Recommended OpSEC Measures

- Using Browsers

- Recovery Plan

## Public Key Cryptography

Learn how encryption and digital signatures ensure privacy, authenticity, and data integrity.

This topic contains the following subtopics:

1.  Generating Cryptographic Keys

  - Generating Cryptographic Keys with Kagami

  - Other Operations with Kagami

    - Building `kagami`

    - Moving `kagami` to the `/bin` directory

    - Moving `kagami` to the `.local/bin` directory

    - Making the `<username>/.local/bin` directory available to the shell

2. Storing Cryptographic Keys

  - Storing Cryptographic Keys Digitally

    - Using SSH and SSH Agent

    - Adding a Password Manager Program

      - Configuring KeePassXC

  - Storing Cryptographic Keys Physically

    - Using a Hardware Key

    - Using a Mnemonic Phrase

3. Keys for Deploying a Network

  - Setting Keys For a New Network

  - Keys on the Client Side
