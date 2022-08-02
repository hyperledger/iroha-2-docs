import{_ as s,o as n,c as a,d as l}from"./app.22d6dd61.js";var p="/iroha-2-docs/assets/sample-vue-app.4caffed6.gif";const F=JSON.parse('{"title":"JavaScript/TypeScript Guide","description":"","frontmatter":{},"headers":[{"level":2,"title":"1. Client Installation","slug":"_1-client-installation"},{"level":2,"title":"2. Client Configuration","slug":"_2-client-configuration"},{"level":2,"title":"3. Registering a Domain","slug":"_3-registering-a-domain"},{"level":2,"title":"4. Registering an Account","slug":"_4-registering-an-account"},{"level":2,"title":"5. Registering and minting assets","slug":"_5-registering-and-minting-assets"},{"level":2,"title":"6. Visualizing outputs","slug":"_6-visualizing-outputs"}],"relativePath":"guide/javascript.md","lastUpdated":1659428266000}'),o={name:"guide/javascript.md"},e=l(`<h1 id="javascript-typescript-guide" tabindex="-1">JavaScript/TypeScript Guide <a class="header-anchor" href="#javascript-typescript-guide" aria-hidden="true">#</a></h1><div class="info custom-block"><p class="custom-block-title">INFO</p><p>This guide targets <code>@iroha2/client</code> and <code>@iroha/data-model</code> version <strong><code>^1.2</code></strong>.</p></div><h2 id="_1-client-installation" tabindex="-1">1. Client Installation <a class="header-anchor" href="#_1-client-installation" aria-hidden="true">#</a></h2><p>The Iroha 2 JavaScript library consists of multiple packages:</p><table><thead><tr><th>Package</th><th>Description</th></tr></thead><tbody><tr><td><code>client</code></td><td>Submits requests to Iroha Peer</td></tr><tr><td><code>data-model</code></td><td>Provides <a href="https://github.com/paritytech/parity-scale-codec" target="_blank" rel="noopener noreferrer">SCALE</a> (Simple Concatenated Aggregate Little-Endian)-codecs for the Iroha 2 Data Model</td></tr><tr><td><code>crypto-core</code></td><td>Contains cryptography types</td></tr><tr><td><code>crypto-target-node</code></td><td>Provides compiled crypto WASM (<a href="https://webassembly.org/" target="_blank" rel="noopener noreferrer">Web Assembly</a>) for the Node.js environment</td></tr><tr><td><code>crypto-target-web</code></td><td>Provides compiled crypto WASM for native Web (ESM)</td></tr><tr><td><code class="whitespace-pre">crypto-target-bundler</code></td><td>Provides compiled crypto WASM to use with bundlers such as Webpack</td></tr></tbody></table><p>All of these are published under the <code>@iroha2</code> scope into Iroha Nexus Registry. In the future, they will be published in the main NPM Registry. To install these packages, you first need to set up a registry:</p><div class="language-ini"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#768390;"># FILE: .npmrc</span></span>
<span class="line"><span style="color:#ADBAC7;">@iroha2:</span><span style="color:#F47067;">registry</span><span style="color:#ADBAC7;">=https://nexus.iroha.tech/repository/npm-group/</span></span>
<span class="line"></span></code></pre></div><p>Then you can install these packages as any other NPM package:</p><div class="language-bash"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#ADBAC7;">npm i @iroha2/client</span></span>
<span class="line"><span style="color:#ADBAC7;">yarn add @iroha2/data-model</span></span>
<span class="line"><span style="color:#ADBAC7;">pnpm add @iroha2/crypto-target-web</span></span>
<span class="line"></span></code></pre></div><p>The set of packages that you need to install depends on your intention. Maybe you only need to play with the Data Model to perform (de-)serialisation, in which case the <code>data-model</code> package is enough. If you only need to check on a peer in terms of its status or health, you just need the client library, because this API doesn&#39;t require any interactions with crypto or Data Model.</p><p>For the purposes of this tutorial, it&#39;s better to install everything. However, in general, the packages are maximally decoupled, so you can minimise the footprint.</p><p>Moving on, if you are planning to use the Transaction or Query API, you&#39;ll also need to inject an appropriate <code>crypto</code> instance into the client at runtime. This has to be adjusted depending on your particular environment. For example, for Node.js users, such an injection may look like the following:</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { crypto } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/crypto-target-node&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { setCrypto } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/client&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB;">setCrypto</span><span style="color:#ADBAC7;">(crypto)</span></span>
<span class="line"></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Please refer to the related <code>@iroha2/crypto-target-*</code> package documentation because it may require some specific configuration. For example, the <code>web</code> target requires to call an asynchronous <code>init()</code> function before using <code>crypto</code>.</p></div><h2 id="_2-client-configuration" tabindex="-1">2. Client Configuration <a class="header-anchor" href="#_2-client-configuration" aria-hidden="true">#</a></h2><p>The JavaScript Client is fairly low-level in a sense that it doesn&#39;t expose any convenience features like a <code>TransactionBuilder</code> or a <code>ConfigBuilder</code>.</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>The work on implementing those is underway, and these features will very likely be available in the second round of this tutorial&#39;s release.</p></div><p>Thus, on the plus side, configuration of the client is simple. On the downside, you have to prepare a lot manually.</p><p>You may need to use transactions or queries, so before we initialize the client, let&#39;s set up this part. Let&#39;s assume that you have stringified public &amp; private keys (more on that later). Thus, a key-pair generation could look like this:</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { crypto } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/crypto-target-node&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { KeyPair } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/crypto-core&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">// the package for hex-bytes transform</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { hexToBytes } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;hada&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">function</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">generateKeyPair</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">params</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F69D50;">publicKeyMultihash</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">string</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F69D50;">privateKey</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">digestFunction</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">string</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">payload</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">string</span></span>
<span class="line"><span style="color:#ADBAC7;">  }</span></span>
<span class="line"><span style="color:#ADBAC7;">})</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">KeyPair</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">multihashBytes</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">Uint8Array</span><span style="color:#ADBAC7;">.</span><span style="color:#DCBDFB;">from</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">hexToBytes</span><span style="color:#ADBAC7;">(params.publicKeyMultihash),</span></span>
<span class="line"><span style="color:#ADBAC7;">  )</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">multihash</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> crypto.</span><span style="color:#DCBDFB;">createMultihashFromBytes</span><span style="color:#ADBAC7;">(multihashBytes)</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">publicKey</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> crypto.</span><span style="color:#DCBDFB;">createPublicKeyFromMultihash</span><span style="color:#ADBAC7;">(multihash)</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">privateKey</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> crypto.</span><span style="color:#DCBDFB;">createPrivateKeyFromJsKey</span><span style="color:#ADBAC7;">(params.privateKey)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">keyPair</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> crypto.</span><span style="color:#DCBDFB;">createKeyPairFromKeys</span><span style="color:#ADBAC7;">(publicKey, privateKey)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#768390;">// don&#39;t forget to &quot;free&quot; created structures</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">x</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">of</span><span style="color:#ADBAC7;"> [publicKey, privateKey, multihash]) {</span></span>
<span class="line"><span style="color:#ADBAC7;">    x.</span><span style="color:#DCBDFB;">free</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> keyPair</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">kp</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">generateKeyPair</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">  publicKeyMultihash:</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#96D0FF;">&#39;ed0120e555d194e8822da35ac541ce9eec8b45058f4d294d9426ef97ba92698766f7d3&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  privateKey: {</span></span>
<span class="line"><span style="color:#ADBAC7;">    digestFunction: </span><span style="color:#96D0FF;">&#39;ed25519&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">    payload:</span></span>
<span class="line"><span style="color:#ADBAC7;">      </span><span style="color:#96D0FF;">&#39;de757bcb79f4c63e8fa0795edc26f86dfdba189b846e903d0b732bb644607720e555d194e8822da35ac541ce9eec8b45058f4d294d9426ef97ba92698766f7d3&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  },</span></span>
<span class="line"><span style="color:#ADBAC7;">})</span></span>
<span class="line"></span></code></pre></div><p>A basic client setup requires a Torii configuration and an account ID. This allows you to perform basic operations like health or status checks. As described above, to use transactions or queries you&#39;ll need to have a <code>keyPair</code> parameter as a part of the <code>Client</code> instance definition:</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { Client } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/client&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">client</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Client</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">  torii: {</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">// Both URLs are optional in case you only need one of them,</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">// e.g. only the telemetry endpoints</span></span>
<span class="line"><span style="color:#ADBAC7;">    apiURL: </span><span style="color:#96D0FF;">&#39;http://127.0.0.1:8080&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">    telemetryURL: </span><span style="color:#96D0FF;">&#39;http://127.0.0.1:8081&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  },</span></span>
<span class="line"><span style="color:#ADBAC7;">  accountId: </span><span style="color:#DCBDFB;">AccountId</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">// Account name</span></span>
<span class="line"><span style="color:#ADBAC7;">    name: </span><span style="color:#96D0FF;">&#39;alice&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">// The domain where this account is registered</span></span>
<span class="line"><span style="color:#ADBAC7;">    domain_id: </span><span style="color:#DCBDFB;">DomainId</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">      name: </span><span style="color:#96D0FF;">&#39;wonderland&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">    }),</span></span>
<span class="line"><span style="color:#ADBAC7;">  }),</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#768390;">// A key pair, needed for transactions and queries</span></span>
<span class="line"><span style="color:#ADBAC7;">  keyPair: kp,</span></span>
<span class="line"><span style="color:#ADBAC7;">})</span></span>
<span class="line"></span></code></pre></div><h2 id="_3-registering-a-domain" tabindex="-1">3. Registering a Domain <a class="header-anchor" href="#_3-registering-a-domain" aria-hidden="true">#</a></h2><p>Here we see how similar the JavaScript code is to the Rust counterpart. It should be emphasised that the JavaScript library is a thin wrapper: It doesn&#39;t provide any special builder structures, meaning you have to work with bare-bones compiled Data Model structures and define all internal fields explicitly.</p><p>Doubly so, since JavaScript employs many implicit conversions, we highly recommend that you employ TypeScript. This makes many errors far easier to debug, but, unfortunately, results in more boilerplates.</p><p>Let&#39;s register a new domain named <code>looking_glass</code> using our current account, <em>alice@wondeland</em>.</p><p>First, we need to import necessary models and a pre-configured client instance:</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { Client } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/client&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  DomainId,</span></span>
<span class="line"><span style="color:#ADBAC7;">  EvaluatesToRegistrableBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Executable,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Expression,</span></span>
<span class="line"><span style="color:#ADBAC7;">  IdentifiableBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Instruction,</span></span>
<span class="line"><span style="color:#ADBAC7;">  MapNameValue,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Metadata,</span></span>
<span class="line"><span style="color:#ADBAC7;">  NewDomain,</span></span>
<span class="line"><span style="color:#ADBAC7;">  OptionIpfsPath,</span></span>
<span class="line"><span style="color:#ADBAC7;">  QueryBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  RegisterBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Value,</span></span>
<span class="line"><span style="color:#ADBAC7;">  VecInstruction,</span></span>
<span class="line"><span style="color:#ADBAC7;">} </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">// --snip--</span></span>
<span class="line"><span style="color:#F47067;">declare</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">client</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">Client</span></span>
<span class="line"></span></code></pre></div><p>To register a new domain, we need to submit a transaction with a single instruction: to register a new domain. Let&#39;s wrap it all in an async function:</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">async</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">function</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">registerDomain</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">domainName</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">string</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">registerBox</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">RegisterBox</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">    object: </span><span style="color:#DCBDFB;">EvaluatesToRegistrableBox</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">      expression: </span><span style="color:#DCBDFB;">Expression</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;Raw&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">Value</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#96D0FF;">&#39;Identifiable&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#DCBDFB;">IdentifiableBox</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#96D0FF;">&#39;NewDomain&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">NewDomain</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">              id: </span><span style="color:#DCBDFB;">DomainId</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">                name: domainName,</span></span>
<span class="line"><span style="color:#ADBAC7;">              }),</span></span>
<span class="line"><span style="color:#ADBAC7;">              metadata: </span><span style="color:#DCBDFB;">Metadata</span><span style="color:#ADBAC7;">({ map: </span><span style="color:#DCBDFB;">MapNameValue</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">Map</span><span style="color:#ADBAC7;">()) }),</span></span>
<span class="line"><span style="color:#ADBAC7;">              logo: </span><span style="color:#DCBDFB;">OptionIpfsPath</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;None&#39;</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">            }),</span></span>
<span class="line"><span style="color:#ADBAC7;">          ),</span></span>
<span class="line"><span style="color:#ADBAC7;">        ),</span></span>
<span class="line"><span style="color:#ADBAC7;">      ),</span></span>
<span class="line"><span style="color:#ADBAC7;">    }),</span></span>
<span class="line"><span style="color:#ADBAC7;">  })</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">await</span><span style="color:#ADBAC7;"> client.</span><span style="color:#DCBDFB;">submit</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">Executable</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">      </span><span style="color:#96D0FF;">&#39;Instructions&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">      </span><span style="color:#DCBDFB;">VecInstruction</span><span style="color:#ADBAC7;">([</span><span style="color:#DCBDFB;">Instruction</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;Register&#39;</span><span style="color:#ADBAC7;">, registerBox)]),</span></span>
<span class="line"><span style="color:#ADBAC7;">    ),</span></span>
<span class="line"><span style="color:#ADBAC7;">  )</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span></code></pre></div><p>Which we use to register the domain like so:</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">await</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">registerDomain</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;looking_glass&#39;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"></span></code></pre></div><p>We can also use Query API to ensure that the new domain is created. Let&#39;s create another function that wraps that functionality:</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">async</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">function</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">ensureDomainExistence</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">domainName</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">string</span><span style="color:#ADBAC7;">) {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#768390;">// Query all domains</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">result</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">await</span><span style="color:#ADBAC7;"> client.</span><span style="color:#DCBDFB;">request</span><span style="color:#ADBAC7;">(</span><span style="color:#DCBDFB;">QueryBox</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;FindAllDomains&#39;</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">null</span><span style="color:#ADBAC7;">))</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#768390;">// Display the request status</span></span>
<span class="line"><span style="color:#ADBAC7;">  console.</span><span style="color:#DCBDFB;">log</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;%o&#39;</span><span style="color:#ADBAC7;">, result)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#768390;">// Obtain the domain</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">domain</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> result</span></span>
<span class="line"><span style="color:#ADBAC7;">    .</span><span style="color:#DCBDFB;">as</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;Ok&#39;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    .result.</span><span style="color:#DCBDFB;">as</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;Vec&#39;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    .</span><span style="color:#DCBDFB;">map</span><span style="color:#ADBAC7;">((</span><span style="color:#F69D50;">x</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> x.</span><span style="color:#DCBDFB;">as</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;Identifiable&#39;</span><span style="color:#ADBAC7;">).</span><span style="color:#DCBDFB;">as</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;Domain&#39;</span><span style="color:#ADBAC7;">))</span></span>
<span class="line"><span style="color:#ADBAC7;">    .</span><span style="color:#DCBDFB;">find</span><span style="color:#ADBAC7;">((</span><span style="color:#F69D50;">x</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> x.id.name </span><span style="color:#F47067;">===</span><span style="color:#ADBAC7;"> domainName)</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#768390;">// Throw an error if the domain is unavailable</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">if</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">!</span><span style="color:#ADBAC7;">domain) </span><span style="color:#F47067;">throw</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">Error</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;Not found&#39;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span></code></pre></div><p>Now you can ensure that domain is created by calling:</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">await</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">ensureDomainExistence</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;looking_glass&#39;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"></span></code></pre></div><h2 id="_4-registering-an-account" tabindex="-1">4. Registering an Account <a class="header-anchor" href="#_4-registering-an-account" aria-hidden="true">#</a></h2><p>Registering an account is a bit more involved than registering a domain. With a domain, the only concern is the domain name. However, with an account, there are a few more things to worry about.</p><p>First of all, we need to create an <code>AccountId</code>. Note that we can only register an account to an existing domain. The best UX design practices dictate that you should check if the requested domain exists <em>now</em>, and if it doesn&#39;t, suggest a fix to the user. After that, we can create a new account named <em>white_rabbit</em>.</p><p>Imports we need:</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  AccountId,</span></span>
<span class="line"><span style="color:#ADBAC7;">  DomainId,</span></span>
<span class="line"><span style="color:#ADBAC7;">  EvaluatesToRegistrableBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Expression,</span></span>
<span class="line"><span style="color:#ADBAC7;">  IdentifiableBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Instruction,</span></span>
<span class="line"><span style="color:#ADBAC7;">  MapNameValue,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Metadata,</span></span>
<span class="line"><span style="color:#ADBAC7;">  NewAccount,</span></span>
<span class="line"><span style="color:#ADBAC7;">  PublicKey,</span></span>
<span class="line"><span style="color:#ADBAC7;">  RegisterBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Value,</span></span>
<span class="line"><span style="color:#ADBAC7;">  VecPublicKey,</span></span>
<span class="line"><span style="color:#ADBAC7;">} </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"></span></code></pre></div><p>The <code>AccountId</code> structure:</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">accountId</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">AccountId</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">  name: </span><span style="color:#96D0FF;">&#39;white_rabbit&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  domain_id: </span><span style="color:#DCBDFB;">DomainId</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">    name: </span><span style="color:#96D0FF;">&#39;looking_glass&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  }),</span></span>
<span class="line"><span style="color:#ADBAC7;">})</span></span>
<span class="line"></span></code></pre></div><p>Second, you should provide the account with a public key. It is tempting to generate both it and the private key at this time, but it isn&#39;t the brightest idea. Remember that <em>the white_rabbit</em> trusts <em>you, alice@wonderland,</em> to create an account for them in the domain <em>looking_glass</em>, <strong>but doesn&#39;t want you to have access to that account after creation</strong>.</p><p>If you gave <em>white_rabbit</em> a key that you generated yourself, how would they know if you don&#39;t have a copy of their private key? Instead, the best way is to <strong>ask</strong> <em>white_rabbit</em> to generate a new key-pair, and give you the public half of it.</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">pubKey</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">PublicKey</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">  payload: </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">Uint8Array</span><span style="color:#ADBAC7;">([</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">/* put bytes here */</span></span>
<span class="line"><span style="color:#ADBAC7;">  ]),</span></span>
<span class="line"><span style="color:#ADBAC7;">  digest_function: </span><span style="color:#96D0FF;">&#39;some_digest&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">})</span></span>
<span class="line"></span></code></pre></div><p>Only then do we build an instruction from it:</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">registerAccountInstruction</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Instruction</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#96D0FF;">&#39;Register&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#DCBDFB;">RegisterBox</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">    object: </span><span style="color:#DCBDFB;">EvaluatesToRegistrableBox</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">      expression: </span><span style="color:#DCBDFB;">Expression</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;Raw&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">Value</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#96D0FF;">&#39;Identifiable&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#DCBDFB;">IdentifiableBox</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#96D0FF;">&#39;NewAccount&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">NewAccount</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">              id: accountId,</span></span>
<span class="line"><span style="color:#ADBAC7;">              signatories: </span><span style="color:#DCBDFB;">VecPublicKey</span><span style="color:#ADBAC7;">([pubKey]),</span></span>
<span class="line"><span style="color:#ADBAC7;">              metadata: </span><span style="color:#DCBDFB;">Metadata</span><span style="color:#ADBAC7;">({ map: </span><span style="color:#DCBDFB;">MapNameValue</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">Map</span><span style="color:#ADBAC7;">()) }),</span></span>
<span class="line"><span style="color:#ADBAC7;">            }),</span></span>
<span class="line"><span style="color:#ADBAC7;">          ),</span></span>
<span class="line"><span style="color:#ADBAC7;">        ),</span></span>
<span class="line"><span style="color:#ADBAC7;">      ),</span></span>
<span class="line"><span style="color:#ADBAC7;">    }),</span></span>
<span class="line"><span style="color:#ADBAC7;">  }),</span></span>
<span class="line"><span style="color:#ADBAC7;">)</span></span>
<span class="line"></span></code></pre></div><p>Which is then wrapped in a transaction and submitted to the peer the same way as in the previous section when we registered a domain.</p><h2 id="_5-registering-and-minting-assets" tabindex="-1">5. Registering and minting assets <a class="header-anchor" href="#_5-registering-and-minting-assets" aria-hidden="true">#</a></h2><p>Now we must talk a little about assets. Iroha has been built with few underlying assumptions about what the assets need to be.</p><p>The assets can be fungible (every \xA31 is exactly the same as every other \xA31), or non-fungible (a \xA31 bill signed by the Queen of Hearts is not the same as a \xA31 bill signed by the King of Spades), mintable (you can make more of them) and non-mintable (you can only specify their initial quantity in the genesis block).</p><p>Additionally, the assets have different underlying value types. Specifically, we have <code>AssetValueType.Quantity</code>, which is effectively an unsigned 32-bit integer, a <code>BigQuantity</code>, which is an unsigned 128-bit integer, and <code>Fixed</code>, which is a positive (though signed) 64-bit fixed-precision number with nine significant digits after the decimal point. All three types can be registered as either <strong>mintable</strong> or <strong>non-mintable</strong>.</p><p>In JS, you can create a new asset with the following construction:</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  NewAssetDefinition,</span></span>
<span class="line"><span style="color:#ADBAC7;">  AssetDefinitionId,</span></span>
<span class="line"><span style="color:#ADBAC7;">  AssetValueType,</span></span>
<span class="line"><span style="color:#ADBAC7;">  DomainId,</span></span>
<span class="line"><span style="color:#ADBAC7;">  EvaluatesToRegistrableBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Expression,</span></span>
<span class="line"><span style="color:#ADBAC7;">  IdentifiableBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Instruction,</span></span>
<span class="line"><span style="color:#ADBAC7;">  MapNameValue,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Metadata,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Mintable,</span></span>
<span class="line"><span style="color:#ADBAC7;">  RegisterBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Value,</span></span>
<span class="line"><span style="color:#ADBAC7;">} </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">newTimeAsset</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">NewAssetDefinition</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">  value_type: </span><span style="color:#DCBDFB;">AssetValueType</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;Quantity&#39;</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">  id: </span><span style="color:#DCBDFB;">AssetDefinitionId</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">    name: </span><span style="color:#96D0FF;">&#39;time&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">    domain_id: </span><span style="color:#DCBDFB;">DomainId</span><span style="color:#ADBAC7;">({ name: </span><span style="color:#96D0FF;">&#39;looking_glass&#39;</span><span style="color:#ADBAC7;"> }),</span></span>
<span class="line"><span style="color:#ADBAC7;">  }),</span></span>
<span class="line"><span style="color:#ADBAC7;">  metadata: </span><span style="color:#DCBDFB;">Metadata</span><span style="color:#ADBAC7;">({ map: </span><span style="color:#DCBDFB;">MapNameValue</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">Map</span><span style="color:#ADBAC7;">()) }),</span></span>
<span class="line"><span style="color:#ADBAC7;">  mintable: </span><span style="color:#DCBDFB;">Mintable</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;Not&#39;</span><span style="color:#ADBAC7;">), </span><span style="color:#768390;">// If only we could mint more time.</span></span>
<span class="line"><span style="color:#ADBAC7;">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">register</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Instruction</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#96D0FF;">&#39;Register&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#DCBDFB;">RegisterBox</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">    object: </span><span style="color:#DCBDFB;">EvaluatesToRegistrableBox</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">      expression: </span><span style="color:#DCBDFB;">Expression</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;Raw&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">Value</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#96D0FF;">&#39;Identifiable&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#DCBDFB;">IdentifiableBox</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;NewAssetDefinition&#39;</span><span style="color:#ADBAC7;">, newTimeAsset),</span></span>
<span class="line"><span style="color:#ADBAC7;">        ),</span></span>
<span class="line"><span style="color:#ADBAC7;">      ),</span></span>
<span class="line"><span style="color:#ADBAC7;">    }),</span></span>
<span class="line"><span style="color:#ADBAC7;">  }),</span></span>
<span class="line"><span style="color:#ADBAC7;">)</span></span>
<span class="line"></span></code></pre></div><p>Pay attention to the fact that we have defined the asset as <code>Mintable(&#39;Not&#39;)</code>. What this means is that we cannot create more of <code>time</code>. The late bunny will always be late, because even the super-user of the blockchain cannot mint more of <code>time</code> than already exists in the genesis block.</p><p>This means that no matter how hard the <em>white_rabbit</em> tries, the time that he has is the time that was given to him at genesis. And since we haven&#39;t defined any time in the domain <em>looking_glass</em> at genesis and defined time in a non-mintable fashion afterwards, the <em>white_rabbit</em> is doomed to always be late.</p><p>If we had set <code>mintable: Mintable(&#39;Infinitely&#39;)</code> on our time asset, we could mint it:</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  AssetDefinitionId,</span></span>
<span class="line"><span style="color:#ADBAC7;">  DomainId,</span></span>
<span class="line"><span style="color:#ADBAC7;">  EvaluatesToIdBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  EvaluatesToValue,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Expression,</span></span>
<span class="line"><span style="color:#ADBAC7;">  IdBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  AssetId,</span></span>
<span class="line"><span style="color:#ADBAC7;">  AccountId,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Instruction,</span></span>
<span class="line"><span style="color:#ADBAC7;">  MintBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Value,</span></span>
<span class="line"><span style="color:#ADBAC7;">} </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">mint</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Instruction</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#96D0FF;">&#39;Mint&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#DCBDFB;">MintBox</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">    object: </span><span style="color:#DCBDFB;">EvaluatesToValue</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">      expression: </span><span style="color:#DCBDFB;">Expression</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;Raw&#39;</span><span style="color:#ADBAC7;">, </span><span style="color:#DCBDFB;">Value</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;U32&#39;</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">42</span><span style="color:#ADBAC7;">)),</span></span>
<span class="line"><span style="color:#ADBAC7;">    }),</span></span>
<span class="line"><span style="color:#ADBAC7;">    destination_id: </span><span style="color:#DCBDFB;">EvaluatesToIdBox</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">      expression: </span><span style="color:#DCBDFB;">Expression</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;Raw&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">Value</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#96D0FF;">&#39;Id&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#DCBDFB;">IdBox</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#96D0FF;">&#39;AssetId&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">AssetId</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">              account_id: </span><span style="color:#DCBDFB;">AccountId</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">                name: </span><span style="color:#96D0FF;">&#39;alice&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                domain_id: </span><span style="color:#DCBDFB;">DomainId</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">                  name: </span><span style="color:#96D0FF;">&#39;wonderland&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                }),</span></span>
<span class="line"><span style="color:#ADBAC7;">              }),</span></span>
<span class="line"><span style="color:#ADBAC7;">              definition_id: </span><span style="color:#DCBDFB;">AssetDefinitionId</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">                name: </span><span style="color:#96D0FF;">&#39;time&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                domain_id: </span><span style="color:#DCBDFB;">DomainId</span><span style="color:#ADBAC7;">({ name: </span><span style="color:#96D0FF;">&#39;looking_glass&#39;</span><span style="color:#ADBAC7;"> }),</span></span>
<span class="line"><span style="color:#ADBAC7;">              }),</span></span>
<span class="line"><span style="color:#ADBAC7;">            }),</span></span>
<span class="line"><span style="color:#ADBAC7;">          ),</span></span>
<span class="line"><span style="color:#ADBAC7;">        ),</span></span>
<span class="line"><span style="color:#ADBAC7;">      ),</span></span>
<span class="line"><span style="color:#ADBAC7;">    }),</span></span>
<span class="line"><span style="color:#ADBAC7;">  }),</span></span>
<span class="line"><span style="color:#ADBAC7;">)</span></span>
<span class="line"></span></code></pre></div><p>Again it should be emphasised that an Iroha 2 network is strongly typed. You need to take special care to make sure that only unsigned integers are passed to the <code>Value.variantsUnwrapped.U32</code> factory method. Fixed precision values also need to be taken into consideration. Any attempt to add to or subtract from a negative Fixed-precision value will result in an error.</p><h2 id="_6-visualizing-outputs" tabindex="-1">6. Visualizing outputs <a class="header-anchor" href="#_6-visualizing-outputs" aria-hidden="true">#</a></h2><p>Finally, we should talk about visualising data. The Rust API is currently the most complete in terms of available queries and instructions. After all, this is the language in which Iroha 2 was built.</p><p>Let&#39;s build a small Vue 3 application that uses each API we&#39;ve discovered in this guide!</p><p>Our app will consist of 3 main views:</p><ul><li>Status checker that periodically requests peer status (e.g. current blocks height) and shows it;</li><li>Domain creator, which is a form to create a new domain with specified name;</li><li>Listener with a toggle to setup listening for events.</li></ul><p>Our client config is the following (<code>config.json</code> file in the project):</p><div class="language-json"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#6CB6FF;">&quot;torii&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">&quot;apiURL&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;http://127.0.0.1:8080&quot;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">&quot;telemetryURL&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;http://127.0.0.1:8081&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">  },</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#6CB6FF;">&quot;account&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">&quot;name&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;alice&quot;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">&quot;domain_id&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">      </span><span style="color:#6CB6FF;">&quot;name&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;wonderland&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">  },</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#6CB6FF;">&quot;publicKey&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0&quot;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#6CB6FF;">&quot;privateKey&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">&quot;digestFunction&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;ed25519&quot;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#6CB6FF;">&quot;payload&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;9ac47abf59b356e0bd7dcbbbb4dec080e302156a48ca907e47cb6aea1d32719e7233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">  }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span></code></pre></div><p>To use these, firstly, we need to initialize our client and crypto.</p><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#768390;">// FILE: crypto.ts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { init, crypto } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/crypto-target-web&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">// using top-level module await</span></span>
<span class="line"><span style="color:#F47067;">await</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">init</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">export</span><span style="color:#ADBAC7;"> { crypto }</span></span>
<span class="line"></span></code></pre></div><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#768390;">// FILE: client.ts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { Client, setCrypto } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/client&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { KeyPair } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/crypto-core&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { hexToBytes } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;hada&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { AccountId } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">// importing already initialized crypto</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { crypto } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;./crypto&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">// a config with stringified keys</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> client_config </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;./config&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB;">setCrypto</span><span style="color:#ADBAC7;">(crypto)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">export</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">client</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">Client</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">  torii: {</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#768390;">// these ports are specified in the peer&#39;s own config</span></span>
<span class="line"><span style="color:#ADBAC7;">    apiURL: </span><span style="color:#96D0FF;">\`http://localhost:8080\`</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">    telemetryURL: </span><span style="color:#96D0FF;">\`http://localhost:8081\`</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  },</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#768390;">// Account name and the domain where it&#39;s registered</span></span>
<span class="line"><span style="color:#ADBAC7;">  accountId: client_config.account </span><span style="color:#F47067;">as</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">AccountId</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#768390;">// A key pair, required for the account authentication</span></span>
<span class="line"><span style="color:#ADBAC7;">  keyPair: </span><span style="color:#DCBDFB;">generateKeyPair</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">    publicKeyMultihash: client_config.publicKey,</span></span>
<span class="line"><span style="color:#ADBAC7;">    privateKey: client_config.privateKey,</span></span>
<span class="line"><span style="color:#ADBAC7;">  }),</span></span>
<span class="line"><span style="color:#ADBAC7;">})</span></span>
<span class="line"></span>
<span class="line"><span style="color:#768390;">// an util function</span></span>
<span class="line"><span style="color:#F47067;">function</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">generateKeyPair</span><span style="color:#ADBAC7;">(</span><span style="color:#F69D50;">params</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F69D50;">publicKeyMultihash</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">string</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F69D50;">privateKey</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">digestFunction</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">string</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F69D50;">payload</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">string</span></span>
<span class="line"><span style="color:#ADBAC7;">  }</span></span>
<span class="line"><span style="color:#ADBAC7;">})</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">KeyPair</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">multihashBytes</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">Uint8Array</span><span style="color:#ADBAC7;">.</span><span style="color:#DCBDFB;">from</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#DCBDFB;">hexToBytes</span><span style="color:#ADBAC7;">(params.publicKeyMultihash),</span></span>
<span class="line"><span style="color:#ADBAC7;">  )</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">multihash</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> crypto.</span><span style="color:#DCBDFB;">createMultihashFromBytes</span><span style="color:#ADBAC7;">(multihashBytes)</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">publicKey</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> crypto.</span><span style="color:#DCBDFB;">createPublicKeyFromMultihash</span><span style="color:#ADBAC7;">(multihash)</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">privateKey</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> crypto.</span><span style="color:#DCBDFB;">createPrivateKeyFromJsKey</span><span style="color:#ADBAC7;">(params.privateKey)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">keyPair</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> crypto.</span><span style="color:#DCBDFB;">createKeyPairFromKeys</span><span style="color:#ADBAC7;">(publicKey, privateKey)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">for</span><span style="color:#ADBAC7;"> (</span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">x</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">of</span><span style="color:#ADBAC7;"> [publicKey, privateKey, multihash]) {</span></span>
<span class="line"><span style="color:#ADBAC7;">    x.</span><span style="color:#DCBDFB;">free</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">return</span><span style="color:#ADBAC7;"> keyPair</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span></code></pre></div><p>Now we are ready to use the client. Let&#39;s start from the <code>StatusChecker</code> component:</p><div class="language-vue"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#ADBAC7;">&lt;</span><span style="color:#8DDB8C;">script</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">setup</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">lang</span><span style="color:#ADBAC7;">=</span><span style="color:#96D0FF;">&quot;ts&quot;</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { useIntervalFn, useAsyncState } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@vueuse/core&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { client } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;../client&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> { </span><span style="color:#F69D50;">state</span><span style="color:#ADBAC7;">: </span><span style="color:#6CB6FF;">status</span><span style="color:#ADBAC7;">, </span><span style="color:#F69D50;">execute</span><span style="color:#ADBAC7;">: </span><span style="color:#6CB6FF;">updateStatus</span><span style="color:#ADBAC7;"> } </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">useAsyncState</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">  () </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> client.</span><span style="color:#DCBDFB;">getStatus</span><span style="color:#ADBAC7;">(),</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#6CB6FF;">null</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  {</span></span>
<span class="line"><span style="color:#ADBAC7;">    resetOnExecute: </span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">  },</span></span>
<span class="line"><span style="color:#ADBAC7;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB;">useIntervalFn</span><span style="color:#ADBAC7;">(() </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">updateStatus</span><span style="color:#ADBAC7;">(), </span><span style="color:#6CB6FF;">1000</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">&lt;/</span><span style="color:#8DDB8C;">script</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">&lt;</span><span style="color:#8DDB8C;">template</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">  &lt;</span><span style="color:#8DDB8C;">div</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;</span><span style="color:#8DDB8C;">h3</span><span style="color:#ADBAC7;">&gt;Status&lt;/</span><span style="color:#8DDB8C;">h3</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;</span><span style="color:#8DDB8C;">ul</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">v-if</span><span style="color:#ADBAC7;">=</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">status</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">      &lt;</span><span style="color:#8DDB8C;">li</span><span style="color:#ADBAC7;">&gt;Blocks: {{ status.blocks }}&lt;/</span><span style="color:#8DDB8C;">li</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">      &lt;</span><span style="color:#8DDB8C;">li</span><span style="color:#ADBAC7;">&gt;Uptime (sec): {{ status.uptime.secs }}&lt;/</span><span style="color:#8DDB8C;">li</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;/</span><span style="color:#8DDB8C;">ul</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">  &lt;/</span><span style="color:#8DDB8C;">div</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">&lt;/</span><span style="color:#8DDB8C;">template</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"></span></code></pre></div><p>Now let&#39;s build the <code>CreateDomain</code> component:</p><div class="language-vue"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#ADBAC7;">&lt;</span><span style="color:#8DDB8C;">script</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">setup</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">lang</span><span style="color:#ADBAC7;">=</span><span style="color:#96D0FF;">&quot;ts&quot;</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  DomainId,</span></span>
<span class="line"><span style="color:#ADBAC7;">  EvaluatesToRegistrableBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Executable,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Expression,</span></span>
<span class="line"><span style="color:#ADBAC7;">  IdentifiableBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Instruction,</span></span>
<span class="line"><span style="color:#ADBAC7;">  MapNameValue,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Metadata,</span></span>
<span class="line"><span style="color:#ADBAC7;">  NewDomain,</span></span>
<span class="line"><span style="color:#ADBAC7;">  OptionIpfsPath,</span></span>
<span class="line"><span style="color:#ADBAC7;">  RegisterBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  Value,</span></span>
<span class="line"><span style="color:#ADBAC7;">  VecInstruction,</span></span>
<span class="line"><span style="color:#ADBAC7;">} </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { ref } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;vue&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { client } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;../client&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">domainName</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">ref</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;&#39;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">isPending</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">ref</span><span style="color:#ADBAC7;">(</span><span style="color:#6CB6FF;">false</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">async</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">function</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">register</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">try</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">    isPending.value </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">await</span><span style="color:#ADBAC7;"> client.</span><span style="color:#DCBDFB;">submit</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">      </span><span style="color:#DCBDFB;">Executable</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#96D0FF;">&#39;Instructions&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">VecInstruction</span><span style="color:#ADBAC7;">([</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#DCBDFB;">Instruction</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#96D0FF;">&#39;Register&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#DCBDFB;">RegisterBox</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">              object: </span><span style="color:#DCBDFB;">EvaluatesToRegistrableBox</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">                expression: </span><span style="color:#DCBDFB;">Expression</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">                  </span><span style="color:#96D0FF;">&#39;Raw&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                  </span><span style="color:#DCBDFB;">Value</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#96D0FF;">&#39;Identifiable&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#DCBDFB;">IdentifiableBox</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">                      </span><span style="color:#96D0FF;">&#39;NewDomain&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                      </span><span style="color:#DCBDFB;">NewDomain</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">                        id: </span><span style="color:#DCBDFB;">DomainId</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">                          name: domainName.value,</span></span>
<span class="line"><span style="color:#ADBAC7;">                        }),</span></span>
<span class="line"><span style="color:#ADBAC7;">                        metadata: </span><span style="color:#DCBDFB;">Metadata</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">                          map: </span><span style="color:#DCBDFB;">MapNameValue</span><span style="color:#ADBAC7;">(</span><span style="color:#F47067;">new</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">Map</span><span style="color:#ADBAC7;">()),</span></span>
<span class="line"><span style="color:#ADBAC7;">                        }),</span></span>
<span class="line"><span style="color:#ADBAC7;">                        logo: </span><span style="color:#DCBDFB;">OptionIpfsPath</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;None&#39;</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">                      }),</span></span>
<span class="line"><span style="color:#ADBAC7;">                    ),</span></span>
<span class="line"><span style="color:#ADBAC7;">                  ),</span></span>
<span class="line"><span style="color:#ADBAC7;">                ),</span></span>
<span class="line"><span style="color:#ADBAC7;">              }),</span></span>
<span class="line"><span style="color:#ADBAC7;">            }),</span></span>
<span class="line"><span style="color:#ADBAC7;">          ),</span></span>
<span class="line"><span style="color:#ADBAC7;">        ]),</span></span>
<span class="line"><span style="color:#ADBAC7;">      ),</span></span>
<span class="line"><span style="color:#ADBAC7;">    )</span></span>
<span class="line"><span style="color:#ADBAC7;">  } </span><span style="color:#F47067;">finally</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">    isPending.value </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">false</span></span>
<span class="line"><span style="color:#ADBAC7;">  }</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"><span style="color:#ADBAC7;">&lt;/</span><span style="color:#8DDB8C;">script</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">&lt;</span><span style="color:#8DDB8C;">template</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">  &lt;</span><span style="color:#8DDB8C;">div</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;</span><span style="color:#8DDB8C;">h3</span><span style="color:#ADBAC7;">&gt;Create Domain&lt;/</span><span style="color:#8DDB8C;">h3</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;</span><span style="color:#8DDB8C;">p</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">      &lt;</span><span style="color:#8DDB8C;">label</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">for</span><span style="color:#ADBAC7;">=</span><span style="color:#96D0FF;">&quot;domain&quot;</span><span style="color:#ADBAC7;">&gt;New domain name:&lt;/</span><span style="color:#8DDB8C;">label</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">      &lt;</span><span style="color:#8DDB8C;">input</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">id</span><span style="color:#ADBAC7;">=</span><span style="color:#96D0FF;">&quot;domain&quot;</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">v-model</span><span style="color:#ADBAC7;">=</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">domainName</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;"> /&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;/</span><span style="color:#8DDB8C;">p</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;</span><span style="color:#8DDB8C;">p</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">      &lt;</span><span style="color:#8DDB8C;">button</span><span style="color:#ADBAC7;"> @</span><span style="color:#6CB6FF;">click</span><span style="color:#ADBAC7;">=</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">register</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">        Register domain{{ isPending </span><span style="color:#F47067;">?</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;...&#39;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;&#39;</span><span style="color:#ADBAC7;"> }}</span></span>
<span class="line"><span style="color:#ADBAC7;">      &lt;/</span><span style="color:#8DDB8C;">button</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;/</span><span style="color:#8DDB8C;">p</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">  &lt;/</span><span style="color:#8DDB8C;">div</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">&lt;/</span><span style="color:#8DDB8C;">template</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"></span></code></pre></div><p>And finally, let&#39;s build the <code>Listener</code> component that will use Events API to set up a live connection with a peer:</p><div class="language-vue"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#ADBAC7;">&lt;</span><span style="color:#8DDB8C;">script</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">setup</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">lang</span><span style="color:#ADBAC7;">=</span><span style="color:#96D0FF;">&quot;ts&quot;</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { SetupEventsReturn } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/client&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  FilterBox,</span></span>
<span class="line"><span style="color:#ADBAC7;">  OptionHash,</span></span>
<span class="line"><span style="color:#ADBAC7;">  OptionPipelineEntityKind,</span></span>
<span class="line"><span style="color:#ADBAC7;">  OptionPipelineStatusKind,</span></span>
<span class="line"><span style="color:#ADBAC7;">  PipelineEntityKind,</span></span>
<span class="line"><span style="color:#ADBAC7;">  PipelineEventFilter,</span></span>
<span class="line"><span style="color:#ADBAC7;">  PipelineStatusKind,</span></span>
<span class="line"><span style="color:#ADBAC7;">} </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;@iroha2/data-model&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  computed,</span></span>
<span class="line"><span style="color:#ADBAC7;">  onBeforeUnmount,</span></span>
<span class="line"><span style="color:#ADBAC7;">  shallowReactive,</span></span>
<span class="line"><span style="color:#ADBAC7;">  shallowRef,</span></span>
<span class="line"><span style="color:#ADBAC7;">} </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;vue&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { bytesToHex } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;hada&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { client } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;../client&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">interface</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">EventData</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F69D50;">hash</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">string</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F69D50;">status</span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">string</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">events</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">shallowReactive</span><span style="color:#ADBAC7;">&lt;</span><span style="color:#F69D50;">EventData</span><span style="color:#ADBAC7;">[]&gt;([])</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">currentListener</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">shallowRef</span><span style="color:#ADBAC7;">&lt;</span><span style="color:#6CB6FF;">null</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">|</span><span style="color:#ADBAC7;"> </span><span style="color:#F69D50;">SetupEventsReturn</span><span style="color:#ADBAC7;">&gt;(</span><span style="color:#6CB6FF;">null</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">isListening</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">computed</span><span style="color:#ADBAC7;">(() </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">!!</span><span style="color:#ADBAC7;">currentListener.value)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">async</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">function</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">startListening</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">  currentListener.value </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">await</span><span style="color:#ADBAC7;"> client.</span><span style="color:#DCBDFB;">listenForEvents</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">    filter: </span><span style="color:#DCBDFB;">FilterBox</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">      </span><span style="color:#96D0FF;">&#39;Pipeline&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">      </span><span style="color:#DCBDFB;">PipelineEventFilter</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">        entity_kind: </span><span style="color:#DCBDFB;">OptionPipelineEntityKind</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#96D0FF;">&#39;Some&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#DCBDFB;">PipelineEntityKind</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;Transaction&#39;</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        ),</span></span>
<span class="line"><span style="color:#ADBAC7;">        status_kind: </span><span style="color:#DCBDFB;">OptionPipelineStatusKind</span><span style="color:#ADBAC7;">(</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#96D0FF;">&#39;Some&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#DCBDFB;">PipelineStatusKind</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;Committed&#39;</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">        ),</span></span>
<span class="line"><span style="color:#ADBAC7;">        hash: </span><span style="color:#DCBDFB;">OptionHash</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;None&#39;</span><span style="color:#ADBAC7;">),</span></span>
<span class="line"><span style="color:#ADBAC7;">      }),</span></span>
<span class="line"><span style="color:#ADBAC7;">    ),</span></span>
<span class="line"><span style="color:#ADBAC7;">  })</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">  currentListener.value.ee.</span><span style="color:#DCBDFB;">on</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;event&#39;</span><span style="color:#ADBAC7;">, (</span><span style="color:#F69D50;">event</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">    </span><span style="color:#F47067;">const</span><span style="color:#ADBAC7;"> { </span><span style="color:#6CB6FF;">hash</span><span style="color:#ADBAC7;">, </span><span style="color:#6CB6FF;">status</span><span style="color:#ADBAC7;"> } </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> event.</span><span style="color:#DCBDFB;">as</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;Pipeline&#39;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"><span style="color:#ADBAC7;">    events.</span><span style="color:#DCBDFB;">push</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">      hash: </span><span style="color:#DCBDFB;">bytesToHex</span><span style="color:#ADBAC7;">([</span><span style="color:#F47067;">...</span><span style="color:#ADBAC7;">hash]),</span></span>
<span class="line"><span style="color:#ADBAC7;">      status: status.</span><span style="color:#DCBDFB;">match</span><span style="color:#ADBAC7;">({</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">Validating</span><span style="color:#ADBAC7;">: () </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;validating&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">Committed</span><span style="color:#ADBAC7;">: () </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;committed&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">        </span><span style="color:#DCBDFB;">Rejected</span><span style="color:#ADBAC7;">: (</span><span style="color:#F69D50;">_reason</span><span style="color:#ADBAC7;">) </span><span style="color:#F47067;">=&gt;</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;rejected with some reason&#39;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">      }),</span></span>
<span class="line"><span style="color:#ADBAC7;">    })</span></span>
<span class="line"><span style="color:#ADBAC7;">  })</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">async</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">function</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">stopListening</span><span style="color:#ADBAC7;">() {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#F47067;">await</span><span style="color:#ADBAC7;"> currentListener.value?.</span><span style="color:#DCBDFB;">stop</span><span style="color:#ADBAC7;">()</span></span>
<span class="line"><span style="color:#ADBAC7;">  currentListener.value </span><span style="color:#F47067;">=</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">null</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB;">onBeforeUnmount</span><span style="color:#ADBAC7;">(stopListening)</span></span>
<span class="line"><span style="color:#ADBAC7;">&lt;/</span><span style="color:#8DDB8C;">script</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">&lt;</span><span style="color:#8DDB8C;">template</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">  &lt;</span><span style="color:#8DDB8C;">div</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;</span><span style="color:#8DDB8C;">h3</span><span style="color:#ADBAC7;">&gt;Listening&lt;/</span><span style="color:#8DDB8C;">h3</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;</span><span style="color:#8DDB8C;">p</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">      &lt;</span><span style="color:#8DDB8C;">button</span><span style="color:#ADBAC7;"> @</span><span style="color:#6CB6FF;">click</span><span style="color:#ADBAC7;">=</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">isListening </span><span style="color:#F47067;">?</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">stopListening</span><span style="color:#ADBAC7;">() </span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#DCBDFB;">startListening</span><span style="color:#ADBAC7;">()</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">        {{ isListening </span><span style="color:#F47067;">?</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;Stop&#39;</span><span style="color:#ADBAC7;"> </span><span style="color:#F47067;">:</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;Listen&#39;</span><span style="color:#ADBAC7;"> }}</span></span>
<span class="line"><span style="color:#ADBAC7;">      &lt;/</span><span style="color:#8DDB8C;">button</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;/</span><span style="color:#8DDB8C;">p</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;</span><span style="color:#8DDB8C;">p</span><span style="color:#ADBAC7;">&gt;Events:&lt;/</span><span style="color:#8DDB8C;">p</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;</span><span style="color:#8DDB8C;">ul</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">      &lt;</span><span style="color:#8DDB8C;">li</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">v-for</span><span style="color:#ADBAC7;">=</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">{ hash, status } </span><span style="color:#F47067;">in</span><span style="color:#ADBAC7;"> events</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;"> :</span><span style="color:#6CB6FF;">key</span><span style="color:#ADBAC7;">=</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">hash</span><span style="color:#96D0FF;">&quot;</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">        Transaction &lt;</span><span style="color:#8DDB8C;">code</span><span style="color:#ADBAC7;">&gt;{{ hash }}&lt;/</span><span style="color:#8DDB8C;">code</span><span style="color:#ADBAC7;">&gt; status:</span></span>
<span class="line"><span style="color:#ADBAC7;">        {{ status }}</span></span>
<span class="line"><span style="color:#ADBAC7;">      &lt;/</span><span style="color:#8DDB8C;">li</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">    &lt;/</span><span style="color:#8DDB8C;">ul</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">  &lt;/</span><span style="color:#8DDB8C;">div</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">&lt;/</span><span style="color:#8DDB8C;">template</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"></span></code></pre></div><p>That&#39;s it! Finally, we just need to wrap it up with the <code>App.vue</code> component and the <code>app</code> entrypoint:</p><div class="language-vue"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#ADBAC7;">&lt;</span><span style="color:#8DDB8C;">script</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">setup</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">lang</span><span style="color:#ADBAC7;">=</span><span style="color:#96D0FF;">&quot;ts&quot;</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> CreateDomain </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;./components/CreateDomain.vue&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> Listener </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;./components/Listener.vue&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> StatusChecker </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;./components/StatusChecker.vue&#39;</span></span>
<span class="line"><span style="color:#ADBAC7;">&lt;/</span><span style="color:#8DDB8C;">script</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">&lt;</span><span style="color:#8DDB8C;">template</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">  &lt;</span><span style="color:#8DDB8C;">StatusChecker</span><span style="color:#ADBAC7;"> /&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">  &lt;</span><span style="color:#8DDB8C;">hr</span><span style="color:#ADBAC7;"> /&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">  &lt;</span><span style="color:#8DDB8C;">CreateDomain</span><span style="color:#ADBAC7;"> /&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">  &lt;</span><span style="color:#8DDB8C;">hr</span><span style="color:#ADBAC7;"> /&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">  &lt;</span><span style="color:#8DDB8C;">Listener</span><span style="color:#ADBAC7;"> /&gt;</span></span>
<span class="line"><span style="color:#ADBAC7;">&lt;/</span><span style="color:#8DDB8C;">template</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ADBAC7;">&lt;</span><span style="color:#8DDB8C;">style</span><span style="color:#ADBAC7;"> </span><span style="color:#6CB6FF;">lang</span><span style="color:#ADBAC7;">=</span><span style="color:#96D0FF;">&quot;scss&quot;</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"><span style="color:#6CB6FF;">#app</span><span style="color:#ADBAC7;"> {</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#6CB6FF;">padding</span><span style="color:#ADBAC7;">: </span><span style="color:#6CB6FF;">16</span><span style="color:#F47067;">px</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#6CB6FF;">font-family</span><span style="color:#ADBAC7;">: </span><span style="color:#6CB6FF;">sans-serif</span><span style="color:#ADBAC7;">;</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"><span style="color:#ADBAC7;">&lt;/</span><span style="color:#8DDB8C;">style</span><span style="color:#ADBAC7;">&gt;</span></span>
<span class="line"></span></code></pre></div><div class="language-ts"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#768390;">// main.ts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> { createApp } </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;vue&#39;</span></span>
<span class="line"><span style="color:#F47067;">import</span><span style="color:#ADBAC7;"> App </span><span style="color:#F47067;">from</span><span style="color:#ADBAC7;"> </span><span style="color:#96D0FF;">&#39;./App.vue&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#DCBDFB;">createApp</span><span style="color:#ADBAC7;">(App).</span><span style="color:#DCBDFB;">mount</span><span style="color:#ADBAC7;">(</span><span style="color:#96D0FF;">&#39;#app&#39;</span><span style="color:#ADBAC7;">)</span></span>
<span class="line"></span></code></pre></div><p>Here is a small demo with the usage of this component:</p><div class="border border-solid border-gray-300 rounded-md shadow-md"><p><img src="`+p+'" alt="Demo of the sample Vue application"></p></div>',81),t=[e];function c(r,A,y,i,D,B){return n(),a("div",null,t)}var d=s(o,[["render",c]]);export{F as __pageData,d as default};
