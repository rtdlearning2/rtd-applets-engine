import{P as c}from"./pageTypes-s5bfgjb6.js";import{b as a}from"./index-CIyqXupa.js";import{s as l,r as o}from"./pageUi-D8KbPjWU.js";const p={type:c.NUMERIC_INPUT,initState:()=>({value:"",submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:r})=>{const t=e?.unit?`<span class="numeric-unit">${e.unit}</span>`:"",n=r?.value??"",u=o(r);return`
      <div class="page-numeric-input">
        ${a(e)}
        <div class="numeric-input-row">
          <input class="numeric-input" type="text" placeholder="Enter value" value="${n}">
          ${t}
        </div>
        ${u}
      </div>
    `},bind:({root:e,pageState:r})=>{const t=e.querySelector(".numeric-input");t&&t.addEventListener("input",()=>{r.value=t.value})},submit:({pageState:e,page:r})=>{const t=e.value,n=Number(t),u=Number(r?.correctValue),i=Number(r?.tolerance??0),s=Number.isFinite(n)&&Number.isFinite(u)&&Math.abs(n-u)<=i;return l(e,s),{rerender:!0}},reset:({pageState:e})=>(e.value="",e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})};export{p as numericInputPage};
