import{_ as e,E as n,c as d,m as i,J as t,V as s,o as c}from"./chunks/framework.B6c1f-8R.js";const b=JSON.parse('{"title":"Data Model","description":"","frontmatter":{},"headers":[],"relativePath":"blockchain/data-model.md","filePath":"blockchain/data-model.md","lastUpdated":1727363525000}'),o={name:"blockchain/data-model.md"},r=s("",4),l={class:"domains-example-scope"},p=s("",2);function A(v,h,m,u,g,_){const a=n("MermaidRenderWrap");return c(),d("div",null,[r,i("div",l,[t(a,{id:"mermaid_64b197bdaace931806f4329f68663c9a8c80858f31e40d2ebba2122ea46778c3d097a1942b854c14a7221d95be1bee95e77925bdcd094a656409f42a381c3bf7",text:"classDiagram%0A%0Aclass%20domain_wonderland%20%7B%0A%20%20id%20%3D%20%22wonderland%22%0A%7D%0Aclass%20account_alice%3A%3A%3Aaliceblue%20%7B%0A%20%20id%20%3D%20%22alice%40wonderland%22%0A%7D%0Aclass%20account_mad_hatter%3A%3A%3Aaliceblue%20%7B%0A%20%20id%20%3D%20%22mad_hatter%40wonderland%22%0A%7D%0A%0Aclass%20asset_rose%3A%3A%3Apink%20%7B%0A%20%20id%20%3D%20%22rose%23wonderland%22%0A%7D%0A%0Adomain_wonderland%20*--%20account_alice%20%3A%20registered%20in%0Adomain_wonderland%20*--%20asset_rose%20%3A%20registered%20in%0Aaccount_alice%20*--%20asset_rose%20%3A%20registered%20by%0Adomain_wonderland%20*--%20account_mad_hatter%20%3A%20registered%20in%0A%0Aclass%20domain_looking_glass%20%7B%0A%20%20id%20%3D%20%22looking_glass%22%0A%7D%0A%0Aclass%20account_rabbit%3A%3A%3Aaliceblue%20%7B%0A%20%20id%20%3D%20%22white_rabbit%40looking_glass%22%0A%7D%0A%0Adomain_looking_glass%20*--%20account_rabbit%20%3A%20registered%20in"})]),p,t(a,{id:"mermaid_2f20c1df6224dadf81d23a1a43dbb7e72a27090b7ef9cc03c1b0fdd9b6d843ff1140d32332b2f72dcf65fe3d4803afc3d28bbcc35e6ff26c72c8e605c8988cc0",text:"classDiagram%0A%0Aclass%20Domain%0Aclass%20Account%0Aclass%20AssetDefinition%0Aclass%20Asset%0A%0ADomain%20*--%20%22many%22%20Account%20%3A%20contains%0ADomain%20*--%20%22many%22%20AssetDefinition%20%3A%20contains%0AAccount%20*--%20%22many%22%20Asset%20%3A%20contains%0AAsset%20--%20AssetDefinition%0A%0ADomain%20%3A%20id%0ADomain%20%3A%20accounts%0ADomain%20%3A%20asset_definitions%0ADomain%20%3A%20logo%0ADomain%20%3A%20metadata%0A%0AAccount%20%3A%20id%0AAccount%20%3A%20assets%0AAccount%20%3A%20signatories%0AAccount%20%3A%20signature_check_condition%0AAccount%20%3A%20metadata%0AAccount%20%3A%20roles%0A%0A%0AAssetDefinition%20%3A%20id%0AAssetDefinition%20%3A%20value_type%0AAssetDefinition%20%3A%20mintable%0AAssetDefinition%20%3A%20metadata%0A%0AAsset%20%3A%20id%0AAsset%20%3A%20value"})])}const D=e(o,[["render",A],["__scopeId","data-v-36c26279"]]);export{b as __pageData,D as default};