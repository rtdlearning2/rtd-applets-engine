import{P as y}from"./pageTypes-s5bfgjb6.js";import{b as $}from"../index.js";import{s as v,r as w}from"./pageUi-D8KbPjWU.js";import"./transformEngine-DHgD_C_F.js";const P={type:y.TABLE_COMPLETE,initState:()=>({values:{},submitted:!1,isCorrect:null,feedback:""}),render:({page:r,pageState:e})=>{const t=Array.isArray(r?.columns)?r.columns:[],n=Array.isArray(r?.rows)?r.rows:[],a=e?.values??{},s=t.map(c=>`<th>${c}</th>`).join(""),u=n.map((c,l)=>`<tr>${c.map((o,f)=>{if(o==null){const m=`${l},${f}`,b=a[m]??"";return`<td><input data-row="${l}" data-col="${f}" type="text" value="${b}"></td>`}return`<td>${o}</td>`}).join("")}</tr>`).join(""),d=w(e);return`
      <div class="page-table-complete">
        ${$(r)}
        <table class="value-table">
          <thead><tr>${s||""}</tr></thead>
          <tbody>${u||""}</tbody>
        </table>
        ${d}
      </div>
    `},bind:({root:r,pageState:e})=>{r.querySelectorAll("input[data-row]").forEach(t=>{t.addEventListener("input",()=>{const n=t.dataset.row,a=t.dataset.col;if(n===void 0||a===void 0)return;const s=`${n},${a}`;e.values[s]=t.value})})},submit:({pageState:r,page:e})=>{const t=Array.isArray(e?.rows)?e.rows:[],n=Array.isArray(e?.correctRows)?e.correctRows:[],a=r.values??{};let s=!0;return t.forEach((u,d)=>{u.forEach((c,l)=>{if(c==null){const i=`${d},${l}`,o=n?.[d]?.[l];(o==null||String(a[i]??"")!==String(o))&&(s=!1)}})}),v(r,s),{rerender:!0}},reset:({pageState:r})=>(r.values={},r.submitted=!1,r.isCorrect=null,r.feedback="",{rerender:!0})};export{P as tableCompletePage};
