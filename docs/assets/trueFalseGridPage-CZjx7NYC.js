import{P as o}from"./pageTypes-s5bfgjb6.js";import{b as u}from"./index-CIyqXupa.js";import{s as i,r as f}from"./pageUi-D8KbPjWU.js";const w={type:o.TRUE_FALSE_GRID,initState:()=>({answers:{},submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const r=(Array.isArray(e?.statements)?e.statements:[]).map((l,n)=>{const d=t?.answers?.[n];return`
          <tr>
            <td>${l}</td>
            <td><button class="tf-btn ${d===!0?"selected":""}" data-index="${n}" data-value="true">True</button></td>
            <td><button class="tf-btn ${d===!1?"selected":""}" data-index="${n}" data-value="false">False</button></td>
          </tr>
        `}).join(""),a=f(t);return`
      <div class="page-true-false">
        ${u(e)}
        <table class="true-false-grid">
          <thead><tr><th>Statement</th><th>True</th><th>False</th></tr></thead>
          <tbody>${r||""}</tbody>
        </table>
        ${a}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll(".tf-btn").forEach(s=>{s.addEventListener("click",()=>{const r=s.dataset.index,a=s.dataset.value==="true";r!==void 0&&(t.answers[r]=a,e.querySelectorAll(`.tf-btn[data-index='${r}']`).forEach(l=>l.classList.remove("selected")),s.classList.add("selected"))})})},submit:({pageState:e,page:t})=>{const s=Array.isArray(t?.statements)?t.statements:[],r=Array.isArray(t?.correctAnswers)?t.correctAnswers:[],a=e.answers??{},n=s.every((d,c)=>a[c]===!0||a[c]===!1)&&r.every((d,c)=>a[c]===d);return i(e,n),{rerender:!0}},reset:({pageState:e})=>(e.answers={},e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})};export{w as trueFalseGridPage};
