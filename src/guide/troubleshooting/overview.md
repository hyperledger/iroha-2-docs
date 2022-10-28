# Troubleshooting

This section is intended to help you if you encounter issues while working
with Iroha. If something goes wrong, please
[check the keys](#check-the-keys) first. If that doesn't help, check
troubleshooting instructions for each stage:

- [Installation issues](./installation-issues.md)
- [Configuration issues](./configuration-issues.md)
- [Deployment issues](./deployment-issues.md)
- [Integration issues](./integration-issues.md)

If the issue you are experiencing is not described here, contact us via
[Telegram](https://t.me/hyperledgeriroha).

## Check the keys

Most issues arise as a result of the keys not matching. This is why we
recommend to follow this rule: **If something goes wrong, please check the
keys first.**

Here's a quick explanation. It is not possible to differentiate the error
messages that arise when the keys of peers are not matching the keys in the
array of
[trusted peers](./../configure/peer-configuration.md#trusted-peers) because
it would expose the public key of the peers. As such, if you have Helm
charts, K8s deployments with keys defined via the environment variables,
you should check for Key definitions.

If in doubt,
[generate a fresh pair](./../configure/keys.md#_1-generate-new-key-pairs).
