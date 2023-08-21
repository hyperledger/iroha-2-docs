# Compatibility Matrix

In our continuous efforts to provide clear documentation and to ensure seamless compatibility across multiple SDKs,
we present the **SDK Compatibility Matrix**. This matrix provides an instantaneous overview of how different stories,
sourced from TestOps API, fare across varying SDKs.

The matrix consists of:

- **Stories**: Represented in the first column of the matrix, these are directly fetched from the TestOps API.
- **SDKs**: Each subsequent column represents an SDK, such as "Java/Kotlin", "JavaScript", "Swift", etc.
- **Status Symbols**: The status of each story for an SDK is denoted with:
    - <CompatibilityMatrixTableIcon status="ok" class="inline-block relative -top-0.5" /> indicating the story passed.
    - <CompatibilityMatrixTableIcon status="failed" class="inline-block relative -top-0.5" /> indicating the story failed to pass.
    - <CompatibilityMatrixTableIcon status="no-data" class="inline-block relative -top-0.5" /> indicating the data is missing.

<CompatibilityMatrixTable />

_Note: The data for this matrix is retrieved dynamically from our [backend service](https://github.com/soramitsu/iroha2-docs-compat-matrix-service), balancing the latest information with a swift response for documentation readers._
