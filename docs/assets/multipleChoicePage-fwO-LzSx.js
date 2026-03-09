import{P as a}from"./pageTypes-s5bfgjb6.js";import{b as h}from"./index-jMcgm5iu.js";import{s as b,r as f}from"./pageUi-D8KbPjWU.js";const $={type:a.MULTIPLE_CHOICE,initState:()=>({selected:[],submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:c})=>{const i=Array.isArray(e?.choices)?e.choices:[],o=!!e?.multiSelect,r=c?.selected??[],t=o?"checkbox":"radio",l=e?.id?`mc-${e.id}`:"mc",s=i.map((d,m)=>{const u=r.includes(String(m));return`
          <label class="choice-item">
            <input type="${t}" name="${l}" value="${m}" ${u?"checked":""}>
            <span>${d}</span>
          </label>
        `}).join(""),n=f(c);return`
      <div class="page-multiple-choice">
        ${h(e)}
        <div class="choice-list">${s||"[choices]"}</div>
        ${n}
      </div>
    `},bind:({root:e,pageState:c,page:i})=>{const o=!!i?.multiSelect,r=e.querySelectorAll(".choice-item input");r.forEach(t=>{t.addEventListener("change",()=>{if(o){const l=Array.from(r).filter(s=>s.checked).map(s=>s.value);c.selected=l}else c.selected=t.checked?[t.value]:[]})})},submit:({pageState:e,page:c})=>{const i=!!c?.multiSelect,o=e.selected??[];let r=!1;if(i){const t=Array.isArray(c?.correctIndices)?c.correctIndices.map(String):[],l=[...o].sort(),s=[...t].sort();r=l.length===s.length&&l.every((n,d)=>n===s[d])}else{const t=c?.correctIndex;r=o.length===1&&String(t)===o[0]}return b(e,r),{rerender:!0}},reset:({pageState:e})=>(e.selected=[],e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})};export{$ as multipleChoicePage};
