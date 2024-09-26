import{_ as s,c as e,o as a,V as i}from"./chunks/framework.B6c1f-8R.js";const g=JSON.parse('{"title":"Metrics","description":"","frontmatter":{},"headers":[],"relativePath":"guide/advanced/metrics.md","filePath":"guide/advanced/metrics.md","lastUpdated":1727363525000}'),n={name:"guide/advanced/metrics.md"},t=i(`<h1 id="metrics" tabindex="-1">Metrics <a class="header-anchor" href="#metrics" aria-label="Permalink to &quot;Metrics&quot;">​</a></h1><p>To conveniently and thoroughly monitor the performance of your instance of the Iroha network, we recommend using <a href="https://prometheus.io/" target="_blank" rel="noreferrer"><code>Prometheus</code></a>. Prometheus is a program that can monitor your Iroha peer over a separate socket and provide different kinds of performance metrics.</p><p>This data can help you find performance bottlenecks and optimise your Iroha configuration.</p><h4 id="metrics-endpoint" tabindex="-1"><code>/metrics</code> Endpoint <a class="header-anchor" href="#metrics-endpoint" aria-label="Permalink to &quot;\`/metrics\` Endpoint&quot;">​</a></h4><p>See <a href="./../../reference/torii-endpoints.html#metrics">Reference &gt; Torii Endpoints: Metrics</a>.</p><h2 id="how-to-use-metrics" tabindex="-1">How to use metrics <a class="header-anchor" href="#how-to-use-metrics" aria-label="Permalink to &quot;How to use metrics&quot;">​</a></h2><p>Work in Progress.</p><p>This topic will be updated as part of the new configuration reference.</p><p>The progress on the configuration reference can be tracked in the following GitHub issue:<br><a href="https://github.com/hyperledger/iroha-2-docs/issues/392" target="_blank" rel="noreferrer">iroha-2-docs &gt; Issue #392: Tracking issue for Configuration Reference as per RFC</a>.</p><p>::: note</p><p>For examples, see <a href="./../configure/sample-configuration.html">Sample Configuration Files</a>.</p><p>:::</p><p>After the above is configured, you can use the IP address set in the <code>&quot;TORII_TELEMETRY_URL&quot;</code> variable to access the metrics data from within a running Iroha instance.</p><p><strong>Example</strong>:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl http://127.0.0.1:8180/metrics</span></span></code></pre></div><p>This returns a result similar to the following:</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># HELP blocks_height Total number of blocks in chain</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># TYPE blocks_height gauge</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">blocks_height</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 135543</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># HELP peers_number Total number peers to send transactions and request proposals</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># TYPE peers_number gauge</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">peers_number</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 7</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># HELP number_of_domains Total number of domains in WSV</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># TYPE number_of_domains gauge</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">number_of_domains</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 14</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># HELP total_number_of_transactions Total number of transactions in blockchain</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># TYPE total_number_of_transactions gauge</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">total_number_of_transactions</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 216499</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># HELP number_of_signatures_in_last_block Number of signatures in last block</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># TYPE number_of_signatures_in_last_block gauge</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">number_of_signatures_in_last_block</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 5</span></span></code></pre></div>`,17),r=[t];function o(p,l,h,c,d,k){return a(),e("div",null,r)}const m=s(n,[["render",o]]);export{g as __pageData,m as default};