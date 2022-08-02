import{_ as s,o as n,c as a,d as l}from"./app.22d6dd61.js";const D=JSON.parse('{"title":"Genesis Block","description":"","frontmatter":{},"headers":[],"relativePath":"guide/configure/genesis.md","lastUpdated":1659428266000}'),o={name:"guide/configure/genesis.md"},p=l(`<h1 id="genesis-block" tabindex="-1">Genesis Block <a class="header-anchor" href="#genesis-block" aria-hidden="true">#</a></h1><p>The genesis block is the first block in your blockchain. It&#39;s never empty, even if <code>configs/peer/genesis.json</code> is. We recommend adding at least one more account to the genesis block.</p><p>In our case, it was <em>alice</em>@wonderland, with the public key <code>ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0</code>. Think of it as the password used to &quot;log in&quot; as <em>alice</em>.</p><details class="details custom-block"><summary>Genesis Block Example: alice@wonderland</summary><div class="language-json"><span class="copy"></span><pre class="shiki" style="background-color:#22272e;"><code><span class="line"><span style="color:#ADBAC7;">{</span></span>
<span class="line"><span style="color:#ADBAC7;">  </span><span style="color:#6CB6FF;">&quot;transactions&quot;</span><span style="color:#ADBAC7;">: [</span></span>
<span class="line"><span style="color:#ADBAC7;">    {</span></span>
<span class="line"><span style="color:#ADBAC7;">      </span><span style="color:#6CB6FF;">&quot;isi&quot;</span><span style="color:#ADBAC7;">: [</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#6CB6FF;">&quot;Register&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">&quot;object&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">              </span><span style="color:#6CB6FF;">&quot;Raw&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#6CB6FF;">&quot;Identifiable&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                  </span><span style="color:#6CB6FF;">&quot;Domain&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">&quot;name&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;wonderland&quot;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">&quot;accounts&quot;</span><span style="color:#ADBAC7;">: {},</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">&quot;asset_definitions&quot;</span><span style="color:#ADBAC7;">: {},</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">&quot;metadata&quot;</span><span style="color:#ADBAC7;">: {}</span></span>
<span class="line"><span style="color:#ADBAC7;">                  }</span></span>
<span class="line"><span style="color:#ADBAC7;">                }</span></span>
<span class="line"><span style="color:#ADBAC7;">              }</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">          }</span></span>
<span class="line"><span style="color:#ADBAC7;">        },</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#6CB6FF;">&quot;Register&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">&quot;object&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">              </span><span style="color:#6CB6FF;">&quot;Raw&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#6CB6FF;">&quot;Identifiable&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                  </span><span style="color:#6CB6FF;">&quot;NewAccount&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">&quot;id&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                      </span><span style="color:#6CB6FF;">&quot;name&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;alice&quot;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                      </span><span style="color:#6CB6FF;">&quot;domain_name&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;wonderland&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">                    },</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">&quot;signatories&quot;</span><span style="color:#ADBAC7;">: [</span></span>
<span class="line"><span style="color:#ADBAC7;">                      </span><span style="color:#96D0FF;">&quot;ed01207233bfc89dcbd68c19fde6ce6158225298ec1131b6a130d1aeb454c1ab5183c0&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">                    ],</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">&quot;metadata&quot;</span><span style="color:#ADBAC7;">: {}</span></span>
<span class="line"><span style="color:#ADBAC7;">                  }</span></span>
<span class="line"><span style="color:#ADBAC7;">                }</span></span>
<span class="line"><span style="color:#ADBAC7;">              }</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">          }</span></span>
<span class="line"><span style="color:#ADBAC7;">        },</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#6CB6FF;">&quot;Register&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">&quot;object&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">              </span><span style="color:#6CB6FF;">&quot;Raw&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#6CB6FF;">&quot;Identifiable&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                  </span><span style="color:#6CB6FF;">&quot;AssetDefinition&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">&quot;id&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                      </span><span style="color:#6CB6FF;">&quot;name&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;rose&quot;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                      </span><span style="color:#6CB6FF;">&quot;domain_name&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;wonderland&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">                    },</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">&quot;value_type&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;Quantity&quot;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">&quot;metadata&quot;</span><span style="color:#ADBAC7;">: {},</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">&quot;mintable&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#6CB6FF;">true</span></span>
<span class="line"><span style="color:#ADBAC7;">                  }</span></span>
<span class="line"><span style="color:#ADBAC7;">                }</span></span>
<span class="line"><span style="color:#ADBAC7;">              }</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">          }</span></span>
<span class="line"><span style="color:#ADBAC7;">        },</span></span>
<span class="line"><span style="color:#ADBAC7;">        {</span></span>
<span class="line"><span style="color:#ADBAC7;">          </span><span style="color:#6CB6FF;">&quot;Mint&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">&quot;object&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">              </span><span style="color:#6CB6FF;">&quot;Raw&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#6CB6FF;">&quot;U32&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#6CB6FF;">13</span></span>
<span class="line"><span style="color:#ADBAC7;">              }</span></span>
<span class="line"><span style="color:#ADBAC7;">            },</span></span>
<span class="line"><span style="color:#ADBAC7;">            </span><span style="color:#6CB6FF;">&quot;destination_id&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">              </span><span style="color:#6CB6FF;">&quot;Raw&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                </span><span style="color:#6CB6FF;">&quot;Id&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                  </span><span style="color:#6CB6FF;">&quot;AssetId&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">&quot;definition_id&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                      </span><span style="color:#6CB6FF;">&quot;name&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;rose&quot;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                      </span><span style="color:#6CB6FF;">&quot;domain_name&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;wonderland&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">                    },</span></span>
<span class="line"><span style="color:#ADBAC7;">                    </span><span style="color:#6CB6FF;">&quot;account_id&quot;</span><span style="color:#ADBAC7;">: {</span></span>
<span class="line"><span style="color:#ADBAC7;">                      </span><span style="color:#6CB6FF;">&quot;name&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;alice&quot;</span><span style="color:#ADBAC7;">,</span></span>
<span class="line"><span style="color:#ADBAC7;">                      </span><span style="color:#6CB6FF;">&quot;domain_name&quot;</span><span style="color:#ADBAC7;">: </span><span style="color:#96D0FF;">&quot;wonderland&quot;</span></span>
<span class="line"><span style="color:#ADBAC7;">                    }</span></span>
<span class="line"><span style="color:#ADBAC7;">                  }</span></span>
<span class="line"><span style="color:#ADBAC7;">                }</span></span>
<span class="line"><span style="color:#ADBAC7;">              }</span></span>
<span class="line"><span style="color:#ADBAC7;">            }</span></span>
<span class="line"><span style="color:#ADBAC7;">          }</span></span>
<span class="line"><span style="color:#ADBAC7;">        }</span></span>
<span class="line"><span style="color:#ADBAC7;">      ]</span></span>
<span class="line"><span style="color:#ADBAC7;">    }</span></span>
<span class="line"><span style="color:#ADBAC7;">  ]</span></span>
<span class="line"><span style="color:#ADBAC7;">}</span></span>
<span class="line"></span></code></pre></div></details><div class="info custom-block"><p class="custom-block-title">Note</p><p>Iroha is <strong>case-sensitive</strong>, meaning that <em>Alice</em>@wonderland is different from <em>alice</em>@wonderland. It should go without saying that <em>alice@wonderland</em> is not the same as <em>alice@looking_glass</em> either, since these accounts belong to different domains, <code>wonderland</code> and <code>looking_glass</code>.</p></div>`,5),e=[p];function t(c,A,r,y,i,B){return n(),a("div",null,e)}var u=s(o,[["render",t]]);export{D as __pageData,u as default};
