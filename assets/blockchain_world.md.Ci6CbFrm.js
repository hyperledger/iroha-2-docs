import{_ as e,c as o,o as r,V as t}from"./chunks/framework.B6c1f-8R.js";const f=JSON.parse('{"title":"World","description":"","frontmatter":{},"headers":[],"relativePath":"blockchain/world.md","filePath":"blockchain/world.md","lastUpdated":1727363525000}'),i={name:"blockchain/world.md"},a=t('<h1 id="world" tabindex="-1">World <a class="header-anchor" href="#world" aria-label="Permalink to &quot;World&quot;">​</a></h1><p><code>World</code> is the global entity that contains other entities. The <code>World</code> consists of:</p><ul><li>Iroha <a href="/iroha-2-docs/guide/configure/client-configuration.html">configuration parameters</a></li><li>the list of <a href="/iroha-2-docs/guide/configure/peer-configuration.html#trusted-peers">trusted peers</a></li><li>registered domains</li><li>registered <a href="/iroha-2-docs/blockchain/triggers.html">triggers</a></li><li>registered <a href="/iroha-2-docs/blockchain/permissions.html#permission-groups-roles">roles</a></li><li>registered <a href="/iroha-2-docs/blockchain/permissions.html#permission-tokens">permission token definitions</a></li><li>permission tokens for all accounts</li><li><a href="/iroha-2-docs/blockchain/permissions.html#runtime-validators">the chain of runtime validators</a></li></ul><p>When domains, peers, or roles are registered or unregistered, the <code>World</code> is the target of the (un)register <a href="/iroha-2-docs/blockchain/instructions.html">instruction</a>.</p><h2 id="world-state-view-wsv" tabindex="-1">World State View (WSV) <a class="header-anchor" href="#world-state-view-wsv" aria-label="Permalink to &quot;World State View (WSV)&quot;">​</a></h2><p>World State View is the in-memory representation of the current blockchain state. This includes all currently loaded blocks, with all of their contents, as well as peers elected for the current epoch.</p>',6),s=[a];function l(n,c,d,h,p,m){return r(),o("div",null,s)}const _=e(i,[["render",l]]);export{f as __pageData,_ as default};