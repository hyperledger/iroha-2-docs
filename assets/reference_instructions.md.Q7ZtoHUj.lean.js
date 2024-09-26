import{_ as a,E as r,c as o,m as e,J as s,V as n,o as i}from"./chunks/framework.B6c1f-8R.js";const I=JSON.parse('{"title":"Iroha Special Instructions","description":"","frontmatter":{},"headers":[],"relativePath":"reference/instructions.md","filePath":"reference/instructions.md","lastUpdated":1727363525000}'),c={name:"reference/instructions.md"},A=n("",3),u={class:"details custom-block"},l=e("summary",null,"Diagram: Iroha Special Instructions",-1);function d(B,x,h,m,g,f){const t=r("MermaidRenderWrap");return i(),o("div",null,[A,e("details",u,[l,s(t,{id:"mermaid_ed2856e2f3a15f4a487319a2418ef404bba5a0dac5df0f42a043a82e9151599b85f73422c959b6bc3b0a5bbb39538fba27abaddf4e4077d492e2301eec56d75f",text:"classDiagram%0A%0Adirection%20LR%0A%0Aclass%20Instruction%20%7B%0A%20%20%20%20%3C%3Cenumeration%3E%3E%0A%20%20%20%20Register(RegisterBox)%0A%20%20%20%20Unregister(UnregisterBox)%0A%20%20%20%20Mint(MintBox)%0A%20%20%20%20Burn(BurnBox)%0A%20%20%20%20Transfer(TransferBox)%0A%20%20%20%20If(Box~If~)%0A%20%20%20%20Pair(Box~Pair~)%0A%20%20%20%20Sequence(SequenceBox)%0A%20%20%20%20Fail(FailBox)%0A%20%20%20%20SetKeyValue(SetKeyValueBox)%0A%20%20%20%20RemoveKeyValue(RemoveKeyValueBox)%0A%20%20%20%20Grant(GrantBox)%0A%20%20%20%20Revoke(RevokeBox)%0A%20%20%20%20ExecuteTrigger(ExecuteTriggerBox)%0A%7D%0A%0Aclass%20SetKeyValueBox%20%7B%0A%20%20%20%20object_id%3A%20EvaluatesTo~IdBox~%20%20%20%20%0A%20%20%20%20key%3A%20EvaluatesTo~Name~%20%20%20%20%0A%20%20%20%20value%3A%20EvaluatesTo~Value~%20%20%20%20%0A%7D%0A%0Aclass%20RemoveKeyValueBox%20%7B%0A%20%20%20%20object_id%3A%20EvaluatesTo~IdBox~%20%20%20%20%0A%20%20%20%20key%3A%20EvaluatesTo~Name~%20%20%20%20%0A%7D%0A%0A%0Aclass%20RegisterBox%20%7B%0A%20%20%20%20object%3A%20EvaluatesTo~RegistrableBox~%20%20%20%20%0A%7D%0A%0Aclass%20UnregisterBox%20%7B%0A%20%20%20%20object_id%3A%20EvaluatesTo~IdBox~%20%20%20%20%0A%7D%0A%0A%0Aclass%20MintBox%20%7B%0A%20%20%20%20object%3A%20EvaluatesTo~Value~%20%20%20%20%0A%20%20%20%20destination_id%3A%20EvaluatesTo~IdBox~%20%20%20%20%0A%7D%0A%0Aclass%20BurnBox%20%7B%0A%20%20%20%20object%3A%20EvaluatesTo~Value~%20%20%20%20%0A%20%20%20%20destination_id%3A%20EvaluatesTo~IdBox~%20%20%20%20%0A%7D%0A%0Aclass%20TransferBox%20%7B%0A%20%20%20%20source_id%3A%20EvaluatesTo~IdBox~%20%20%20%20%0A%20%20%20%20object%3A%20EvaluatesTo~Value~%20%20%20%20%0A%20%20%20%20destination_id%3A%20EvaluatesTo~IdBox~%20%20%20%20%0A%7D%0A%0A%0Aclass%20SequenceBox%20%7B%0A%20%20%20%20instructions%3A%20Vec~Instruction~%20%20%20%20%0A%7D%0A%0Aclass%20GrantBox%20%7B%0A%20%20%20%20object%3A%20EvaluatesTo~Value~%20%20%20%20%0A%20%20%20%20destination_id%3A%20EvaluatesTo~IdBox~%20%20%20%20%0A%7D%0A%0Aclass%20RevokeBox%20%7B%0A%20%20%20%20object%3A%20EvaluatesTo~Value~%20%20%20%20%0A%20%20%20%20destination_id%3A%20EvaluatesTo~IdBox~%20%20%20%20%0A%7D%0A%0Aclass%20ExecuteTriggerBox%20%7B%0A%20%20%20%20trigger_id%3A%20TriggerId%0A%7D%0A%0Aclass%20SetKeyValue~SetKeyValueBox~%0Aclass%20RemoveKeyValue~RemoveKeyValueBox~%0Aclass%20Register~RegisterBox~%0Aclass%20Unregister~UnregisterBox~%0Aclass%20Mint~MintBox~%0Aclass%20Burn~BurnBox~%0Aclass%20Transfer~TransferBox~%0Aclass%20Grant~GrantBox~%0Aclass%20Revoke~RevokeBox~%0A%0A%0AInstruction%20--%3E%20SetKeyValue%0AInstruction%20--%3E%20RemoveKeyValue%0AInstruction%20--%3E%20Register%0AInstruction%20--%3E%20Unregister%0AInstruction%20--%3E%20Mint%0AInstruction%20--%3E%20Burn%0AInstruction%20--%3E%20Transfer%0AInstruction%20--%3E%20Grant%0AInstruction%20--%3E%20Revoke%0AInstruction%20--%3E%20ExecuteTrigger%0AInstruction%20--%3E%20Sequence%0A%0ASetKeyValue%20..%20SetKeyValueBox%0ARemoveKeyValue%20..%20RemoveKeyValueBox%0ARegister%20..%20RegisterBox%0AUnregister%20..%20UnregisterBox%0AMint%20..%20MintBox%0ABurn%20..%20BurnBox%0ATransfer%20..%20TransferBox%0AGrant%20..%20GrantBox%0ARevoke%20..%20RevokeBox%0AExecuteTrigger%20..%20ExecuteTriggerBox%0ASequence%20..%20SequenceBox%0A%0Aclass%20If%20%7B%0A%20%20%20%20condition%3A%20EvaluatesTo~bool~%20%20%20%20%0A%20%20%20%20then%3A%20Instruction%20%20%20%20%0A%20%20%20%20otherwise%3A%20Option~Instruction~%20%20%20%20%0A%7D%0A%0Aclass%20Pair%20%7B%0A%20%20%20%20left_instruction%3A%20Instruction%20%20%20%20%0A%20%20%20%20right_instruction%3A%20Instruction%20%20%20%20%0A%7D%0A%0AInstruction%20--%3E%20If%0AInstruction%20--%3E%20Pair"})])])}const E=a(c,[["render",d]]);export{I as __pageData,E as default};