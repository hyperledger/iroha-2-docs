# Language-specific guides

In our continuous efforts to provide clear documentation and to ensure seamless compatibility across multiple SDKs, 
we present the SDK Compatibility Matrix. This matrix provides an instantaneous overview of how different stories, 
sourced from TestOps API, fare across varying SDKs.

# Compatibility Matrix

The **SDK Compatibility Matrix** provides a visual representation of the compatibility 
of different stories across various SDKs. 

- **Stories**: Represented in the first column of the matrix, these are directly fetched from the TestOps API.
  
- **SDKs**: Each subsequent column represents an SDK, such as "Java/Kotlin", "JavaScript", "Swift", etc.
  
- **Status Symbols**: The status of each story for an SDK is denoted with:
  - "Passed" indicating the story passed.
  - "Not Passed" for all other cases.

Data for this matrix is dynamically sourced from our backend "SDK Compatibility Matrix Service". 
This ensures the most updated and accurate information is presented at all times.

<CompatibilityMatrixTable />

_Note: The data in the compatibility matrix is updated in real-time to provide the most accurate 
and current information._