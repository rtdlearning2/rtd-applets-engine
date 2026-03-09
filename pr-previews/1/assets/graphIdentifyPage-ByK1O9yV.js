import{P as l}from"./pageTypes-s5bfgjb6.js";import{b as o,c as a}from"../index.js";import{s as u,r as f}from"./pageUi-D8KbPjWU.js";import"./transformEngine-DHgD_C_F.js";const y={type:l.GRAPH_IDENTIFY,initState:()=>({selected:[],submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:r})=>{const s=Array.isArray(e?.targets)?e.targets:[],t=r?.selected??[],c=s.map((n,d)=>`<button class="target-chip ${t.includes(String(d))?"selected":""}" data-index="${d}">${n}</button>`).join(""),i=f(r);return`
      <div class="page-graph-identify">
        ${o(e)}
        <div class="graph-placeholder">[graph for identification]</div>
        <div class="target-list">${c||a(["Targets pending"])}</div>
        ${i}
      </div>
    `},bind:({root:e,pageState:r})=>{e.querySelectorAll(".target-chip").forEach(s=>{s.addEventListener("click",()=>{const t=s.dataset.index;t!==void 0&&(r.selected.includes(t)?(r.selected=r.selected.filter(c=>c!==t),s.classList.remove("selected")):(r.selected=[...r.selected,t],s.classList.add("selected")))})})},submit:({pageState:e,page:r})=>{const s=Array.isArray(r?.correctTargets)?r.correctTargets.map(String):[],t=(e.selected??[]).map(String).sort(),c=[...s].sort(),i=t.length===c.length&&t.every((n,d)=>n===c[d]);return u(e,i),{rerender:!0}},reset:({pageState:e})=>(e.selected=[],e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})};export{y as graphIdentifyPage};
