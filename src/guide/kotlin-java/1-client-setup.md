# 1. Iroha 2 Client Setup (Kotlin/Java)

In this part we shall cover the main things to look out for if you want to use Iroha 2 in your Kotlin application. Instead of providing the complete basics, we shall assume knowledge of the most widely used concepts, explain the unusual, and provide some instructions for creating your own Iroha 2-compatible client.

We assume that you know how to create a new package, and have basic understanding of the fundamental kotlin code. Specifically, we shall assume that you know how to build and deploy your program on the target platforms. The Iroha 2 JVM-compatible SDKs are as much a work-in-progress as the rest of this guide, and significantly more so than the `rust` library.

Without further ado, here’s an example `build.gradle` file.

```kotlin
allprojects {
    repositories {
        ...
        maven { url 'https://jitpack.io' }
    }
}

dependencies {
        api 'com.github.hyperledger.iroha-java:client:iroha2-dev-SNAPSHOT'
        api 'com.github.hyperledger.iroha-java:model:iroha2-dev-SNAPSHOT'
        api 'com.github.hyperledger.iroha-java:block:iroha2-dev-SNAPSHOT'
        api 'com.github.hyperledger.iroha-java:testcontainers:iroha2-dev-SNAPSHOT'
}
```

This will give you the latest development release of Iroha 2.
