import{_ as e,c as s,o as a,V as i}from"./chunks/framework.B6c1f-8R.js";const g=JSON.parse('{"title":"Peer Configuration","description":"","frontmatter":{},"headers":[],"relativePath":"guide/configure/peer-configuration.md","filePath":"guide/configure/peer-configuration.md","lastUpdated":1727363525000}'),n={name:"guide/configure/peer-configuration.md"},t=i(`<h1 id="peer-configuration" tabindex="-1">Peer Configuration <a class="header-anchor" href="#peer-configuration" aria-label="Permalink to &quot;Peer Configuration&quot;">​</a></h1><p>The peer configuration file (<code>configs/peer/config.json</code>) determines how your blockchain operates.</p><p>Here&#39;s an example of how peer configuration file looks like:</p><details class="details custom-block"><summary>Peer configuration template</summary><div class="language-toml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">toml</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## For the full reference, go to (TODO put link)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## You can use another TOML file to extend from.</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## For a single file extension:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># extends = &quot;./base.toml&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## Or, for a chain of extensions:</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># extends = [&quot;base-1.toml&quot;, &quot;base-2.toml&quot;]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># chain_id =</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># public_key =</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># private_key = {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#   algorithm = ,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#   payload =</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">genesis</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># file =</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># public_key =</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># private_key =</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">network</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># address =</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># block_gossip_period = &quot;10s&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># block_gossip_max_size = 4</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># transaction_gossip_period = &quot;1s&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># transaction_gossip_max_size = 500</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># idle_timeout = &quot;60s&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">torii</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># address =</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># max_content_len = &quot;16mb&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># query_idle_time = &quot;30s&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">kura</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># init_mode = &quot;strict&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># store_dir = &quot;./storage&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## Add more of this section for each trusted peer</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># [[sumeragi.trusted_peers]]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># address =</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># public_key =</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">logger</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># level = &quot;INFO&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># format = &quot;full&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## Transactions Queue</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">queue</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># capacity = 65536</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># capacity_per_user = 65536</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># transaction_time_to_live = &quot;1day&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># future_threshold = &quot;1s&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">snapshot</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># mode = &quot;read_write&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># create_every = &quot;1min&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># store_dir = &quot;./storage/snapshot&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">telemetry</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># name =</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># url =</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># min_retry_period = &quot;1s&quot;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># max_retry_delay_exponent = 4</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">dev_telemetry</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## A path to a file with JSON logs</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># out_file = &quot;./dev_telemetry.json&quot;</span></span></code></pre></div></details><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Note that for convenient container deployment, configuration options specified via environment variables always override the corresponding values in the configuration file. This way, you can have a basic configuration file and also configure some options in a <code>docker-compose.yml</code> or in your shell&#39;s environment file (<code>.bashrc</code>, <code>.zshrc</code>, etc.).</p></div><p>Some of the configuration options are required, while others are used for fine-tuning. When you create a new peer, you are required to provide the following:</p><ul><li><p><a href="#public-and-private-keys">The peer&#39;s Public and private keys</a> (<code>PUBLIC_KEY</code> and <code>PRIVATE_KEY</code>)</p></li><li><p><a href="#iroha-public-addresses">Iroha public addresses</a> (<code>P2P_ADDR</code>, <code>API_URL</code>, <code>TELEMETRY_URL</code>)</p></li><li><p><a href="#trusted-peers">Trusted peers</a> (<code>TRUSTED_PEERS</code>)</p></li><li><p><a href="#genesis">Public and private keys for the genesis account</a> (<code>ACCOUNT_PUBLIC_KEY</code> and <code>ACCOUNT_PRIVATE_KEY</code>)</p></li></ul><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Configuration options have different underlying types and default values, which are denoted in code as types wrapped in a single <code>Option&lt;..&gt;</code> or in a double <code>Option&lt;Option&lt;..&gt;&gt;</code>. Refer to <a href="./configuration-types.html">configuration types</a> for details.</p></div><h2 id="generation" tabindex="-1">Generation <a class="header-anchor" href="#generation" aria-label="Permalink to &quot;Generation&quot;">​</a></h2><p>You can use <code>kagami</code> to generate the default peer configuration:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> kagami config peer</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> peer-config.json</span></span></code></pre></div><h2 id="public-and-private-keys" tabindex="-1">Public and private keys <a class="header-anchor" href="#public-and-private-keys" aria-label="Permalink to &quot;Public and private keys&quot;">​</a></h2><p>The <code>configs/peer/config.json</code> peer configuration file should contain a pair of the user&#39;s public <code>PUBLIC_KEY</code> and private <code>PRIVATE_KEY</code> cryptographic keys for their account&#39;s <code>ACCOUNT_ID</code>.</p><p>For details on cryptographic keys, see <a href="./../security/public-key-cryptography.html">Public Key Cryptography</a>.</p><h2 id="trusted-peers" tabindex="-1">Trusted Peers <a class="header-anchor" href="#trusted-peers" aria-label="Permalink to &quot;Trusted Peers&quot;">​</a></h2><p>Iroha is a blockchain ledger. In order for it to work optimally and be Byzantine-fault tolerant with the maximum number of faults allowed, it needs to be started with a set number of peers: <code>4</code>, <code>7</code>, <code>10</code>, ... <code>3f+1</code>, where <code>f</code> is the allowed number of faults.</p><p>So usually, when you want to start an Iroha deployment, you should already know a number of peers that you can trust and join their blockchain. The way it works in the examples is that you just specify in four <code>config.json</code> files four peers with their public keys and API addresses.</p><p>Since Iroha has no automatic peer discovery, the only other way to make peers known to each other is to use the <code>iroha</code> binary to <a href="./peer-management.html#registering-peers">register new peers</a>). This is not too difficult with the provided client libraries. With Python&#39;s <a href="https://www.crummy.com/software/BeautifulSoup/" target="_blank" rel="noreferrer">Beautiful Soup</a>, the curated list of peers can be updated, registered, and un-registered on its own.</p><p>The list of trusted peers is a part of <code>SUMERAGI</code> configuration. Here&#39;s an example of <code>SUMERAGI_TRUSTED_PEERS</code> environment variable to configure trusted peers:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span>&#39;[{&quot;address&quot;:&quot;iroha0:1337&quot;, &quot;public_key&quot;: &quot;ed01201c61faf8fe94e253b93114240394f79a607b7fa55f9e5a41ebec74b88055768b&quot;}, {&quot;address&quot;:&quot;iroha1:1338&quot;, &quot;public_key&quot;: &quot;ed0120cc25624d62896d3a0bfd8940f928dc2abf27cc57cefeb442aa96d9081aae58a1&quot;}, {&quot;address&quot;: &quot;iroha2:1339&quot;, &quot;public_key&quot;: &quot;ed0120faca9e8aa83225cb4d16d67f27dd4f93fc30ffa11adc1f5c88fd5495ecc91020&quot;}, {&quot;address&quot;: &quot;iroha3:1340&quot;, &quot;public_key&quot;: &quot;ed01208e351a70b6a603ed285d666b8d689b680865913ba03ce29fb7d13a166c4e7f1f&quot;}]&#39;</span></span></code></pre></div><h2 id="iroha-public-addresses" tabindex="-1">Iroha Public Addresses <a class="header-anchor" href="#iroha-public-addresses" aria-label="Permalink to &quot;Iroha Public Addresses&quot;">​</a></h2><p><code>TORII</code> is the module in charge of handling incoming and outgoing connections.</p><h3 id="api-url" tabindex="-1"><code>API_URL</code> <a class="header-anchor" href="#api-url" aria-label="Permalink to &quot;\`API_URL\`&quot;">​</a></h3><p>The <code>API_URL</code> is the location to which the client(s) make their requests. You can also use it to change some peer-specific configuration options.</p><p>Most of the time, the only reason to change the <code>API_URL</code> is to change the port, in case <code>8080</code> is either closed, or if you want to randomise ports to avoid certain kinds of attacks.</p><h3 id="p2p-addr" tabindex="-1"><code>P2P_ADDR</code> <a class="header-anchor" href="#p2p-addr" aria-label="Permalink to &quot;\`P2P_ADDR\`&quot;">​</a></h3><p>The <code>P2P_ADDR</code> is the internal address used for communication between peers. This address should be included in the <code>TRUSTED_PEERS</code> section of the configuration file.</p><h3 id="telemetry-url" tabindex="-1"><code>TELEMETRY_URL</code> <a class="header-anchor" href="#telemetry-url" aria-label="Permalink to &quot;\`TELEMETRY_URL\`&quot;">​</a></h3><p>The <code>TELEMETRY_URL</code> is used to specify the prometheus endpoint address. It&#39;s set by adding <code>&quot;TELEMETRY_URL&quot;: &quot;127.0.0.1:8180&quot;</code> to the <code>TORII</code> section of the configuration file.</p><p>It&#39;s not meant to be human-readable. However, a <code>GET</code> request to the <code>127.0.0.1:8180/status</code> will give you a JSON-encoded representation of the top-level metrics, while a <code>GET</code> request to <code>127.0.0.1:8180/metrics</code> will give you a (somewhat verbose) list of all available metrics gathered in Iroha. You might want to change this if you&#39;re having trouble gathering metrics using <code>prometheus</code>.</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>Learn how to <a href="/iroha-2-docs/guide/advanced/metrics.html">monitor Iroha performance</a> using prometheus.</p></div><h2 id="genesis" tabindex="-1">Genesis <a class="header-anchor" href="#genesis" aria-label="Permalink to &quot;Genesis&quot;">​</a></h2><p>When you configure a peer, you have to provide private and public keys for the genesis account.</p><p>You can do this via the configuration file (<code>ACCOUNT_PUBLIC_KEY</code>, <code>ACCOUNT_PRIVATE_KEY</code>) or environment variables (<code>IROHA_GENESIS_ACCOUNT_PUBLIC_KEY</code>, <code>IROHA_GENESIS_ACCOUNT_PRIVATE_KEY</code>).</p><p>To learn more about genesis block, genesis account, and cryptographic keys, see the following:</p><ul><li><a href="./genesis.html">Genesis Block</a></li><li><a href="./../security/public-key-cryptography.html">Public Key Cryptography</a></li></ul><p>Aside from the public and private keys for the genesis account, which are required configuration options, you can also fine-tune other genesis block configurations, such as:</p><ul><li><code>WAIT_FOR_PEERS_RETRY_COUNT_LIMIT</code>: the number of attempts to connect to peers before genesis block is submitted</li><li><code>WAIT_FOR_PEERS_RETRY_PERIOD_MS</code>: how long to wait before retrying a connection to peers</li><li><code>GENESIS_SUBMISSION_DELAY_MS</code>: the delay before the genesis block submission after the minimum number of peers were discovered.</li></ul><h2 id="logger" tabindex="-1">Logger <a class="header-anchor" href="#logger" aria-label="Permalink to &quot;Logger&quot;">​</a></h2><p>Let&#39;s cover the most useful <code>LOGGER</code> configurations, <code>MAX_LOG_LEVEL</code> and <code>LOG_FILE_PATH</code>.</p><h3 id="max-log-level" tabindex="-1"><code>MAX_LOG_LEVEL</code> <a class="header-anchor" href="#max-log-level" aria-label="Permalink to &quot;\`MAX_LOG_LEVEL\`&quot;">​</a></h3><p>The <code>MAX_LOG_LEVEL</code> is used to determine which messages are logged.</p><p>With <code>&quot;MAX_LOG_LEVEL&quot;: &quot;WARN&quot;</code> you won&#39;t get any messages unless they are either a warning or an error. Beside <code>WARN</code>, other available options are:</p><ul><li><code>TRACE</code> (log every time you enter a function)</li><li><code>DEBUG</code> (use when you know something went wrong)</li><li><code>INFO</code> (the default)</li><li><code>WARN</code> (log everything that could be an error)</li><li><code>ERROR</code> (to silence any logging except for error messages)</li></ul><h3 id="log-file-path" tabindex="-1"><code>LOG_FILE_PATH</code> <a class="header-anchor" href="#log-file-path" aria-label="Permalink to &quot;\`LOG_FILE_PATH\`&quot;">​</a></h3><p>Another useful option is <code>&quot;LOG_FILE_PATH&quot;: bunyan.json</code>. It creates (if it didn&#39;t already exist) a file called <code>bunyan.json</code> that contains the message log in a structured format.</p><p>This is extremely useful for two reasons. Firstly, you can use the <code>bunyan</code> log viewer to filter information more precisely than Iroha would allow you to do. Do you only want messages from a specific module or package? You can do that with <code>bunyan</code>. Secondly, while copying logs is not too big of a problem if your instance is just a small setup, for bigger setups the log will be larger. Having it saved to a file makes much more sense in that case.</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>You can also set <code>LOG_FILE_PATH</code> to <code>/dev/stdout</code> if you want to use bunyan&#39;s logging facilities directly without saving the output.</p></div><h2 id="kura" tabindex="-1">Kura <a class="header-anchor" href="#kura" aria-label="Permalink to &quot;Kura&quot;">​</a></h2><p><em>Kura</em> is the persistent storage engine of Iroha (Japanese for <em>warehouse</em>). The <code>BLOCK_STORE_PATH</code> specifies where the blocks are stored. You can change it to a custom location if for some reason the default location (<code>./storage</code>) is not available or desirable.</p>`,50),o=[t];function l(r,p,c,h,d,u){return a(),s("div",null,o)}const f=e(n,[["render",l]]);export{g as __pageData,f as default};