(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const Ke="0",Z={xmin:-10,xmax:10,ymin:-10,ymax:10},le={title:"",subtitle:"",instructions:"",legend:[]},ye={mode:"placePoints",snapStep:1,hitRadiusPx:12};function Qe(e={}){const t=`${e?.schemaVersion??Ke}`;return t==="1"?Je(e):{...e,schemaVersion:t}}function Je(e){const t=Ze(e),n=et(e),o=tt(e),r=st(e),s=ot(e),c=rt(e,n),a=s.type??e.activityType??"transformations",i=it(e,r),l=e.transform??s.transform;return{...e,schemaVersion:"1",view:t,ui:n,interaction:o,series:r,activity:s,grid:t,title:n.title,subtitle:n.subtitle,instructions:n.instructions,legend:n.legend,original:i,transform:l,activityType:a,...c?{pages:c}:{}}}function Ze(e){const t=e.view??e.grid??Z;return{xmin:X(t.xmin,Z.xmin),xmax:X(t.xmax,Z.xmax),ymin:X(t.ymin,Z.ymin),ymax:X(t.ymax,Z.ymax)}}function et(e){const t=ve(e.ui)?e.ui:{};return{title:t.title??e.title??le.title,subtitle:t.subtitle??e.subtitle??le.subtitle,instructions:t.instructions??e.instructions??le.instructions,legend:t.legend??e.legend??le.legend}}function tt(e){const t=ve(e.interaction)?e.interaction:{};return{mode:t.mode??ye.mode,snapStep:X(t.snapStep,ye.snapStep),hitRadiusPx:X(t.hitRadiusPx,ye.hitRadiusPx)}}function rt(e,t){if(Array.isArray(e.pages))return e.pages;if(!nt(e))return null;const n=t?.instructions??e.instructions??"";return[{id:"p1",type:"graph-plot",title:t?.title??e.title??"Graph Task",prompt:n}]}function nt(e){const t=e.usePages??e.pageMode,n=e.ui?.usePages??e.ui?.pageMode,o=t??n;return o===!0?!0:typeof o=="string"?o==="template"||o==="pages":!1}function st(e){return Array.isArray(e.series)?e.series:e.original?.points?[{id:"original",role:"original",points:e.original.points}]:[]}function ot(e){const t=ve(e.activity)?e.activity:{},n=t.type??e.activityType??"transformations";return{...t,type:n}}function it(e,t){if(e.original?.points)return e.original;const n=at(t),o=ct(n);return Array.isArray(o)?{points:o}:{points:[]}}function at(e){if(!Array.isArray(e))return null;const t=["original","reference","base"];for(const n of t){const o=e.find(r=>r?.role===n||r?.id===n);if(o)return o}return e[0]??null}function ct(e){return e?Array.isArray(e.points)?e.points:Array.isArray(e.geometry?.points)?e.geometry.points:Array.isArray(e.data?.points)?e.data.points:null:null}function X(e,t){const n=Number(e);return Number.isFinite(n)?n:t}function ve(e){return e!==null&&typeof e=="object"&&!Array.isArray(e)}const M={GRAPH_PLOT:"graph-plot",DRAG_DROP_FILL:"drag-drop-fill",MULTIPLE_CHOICE:"multiple-choice",SORT_ORDER:"sort-order",MATCH_PAIRS:"match-pairs",NUMERIC_INPUT:"numeric-input",TABLE_COMPLETE:"table-complete",TRUE_FALSE_GRID:"true-false-grid",PROOF_STEPS:"proof-steps",GRAPH_IDENTIFY:"graph-identify",TRANSFORMATION_BUILDER:"transformation-builder"},lt=(e,t)=>e?.id??`page-${t+1}`,Oe=({page:e,index:t,total:n,bodyHtml:o,footerHtml:r})=>{const s=lt(e,t),c=e?.title??`Page ${t+1}`,a=e?.subtitle??"",i=n>0?`Page ${t+1} of ${n}`:"",l=e?.showProgress!==!1,p=e?.showTitle!==!1;return`
    <section class="page-shell" data-page-id="${s}">
      <header class="page-header">
        ${l?`<div class="page-progress">${i}</div>`:""}
        ${p?`<h2 class="page-title">${c}</h2>`:""}
        ${p&&a?`<div class="page-subtitle">${a}</div>`:""}
      </header>
      <div class="page-body">
        ${o}
      </div>
      ${r?`<footer class="page-footer">${r}</footer>`:""}
    </section>
  `},_=e=>e?.prompt?`<div class="page-prompt">${e.prompt}</div>`:"",dt=e=>!e||e.length===0?"":`<ul class="page-placeholder-list">${e.map(n=>`<li>${n}</li>`).join("")}</ul>`;function ut(e,t){const n=e.expectedPoints??[],o=e.studentPoints??[],r=Number(e.activityState?.tolerance??t?.activity?.config?.tolerance??0),s=!!(t?.studentTask?.requireExactCount??t?.activity?.config?.requireExactCount??!0),c=t?.studentTask?.order??t?.activity?.config?.order??null;let a=n.slice(),i=o.slice();if(c==="left_to_right"?(a.sort((p,f)=>p[0]-f[0]),i.sort((p,f)=>p[0]-f[0])):c==="right_to_left"&&(a.sort((p,f)=>f[0]-p[0]),i.sort((p,f)=>f[0]-p[0])),s&&i.length!==a.length)return{isCorrect:!1,details:{message:`You must plot exactly ${a.length} points.`}};function l(p,f){return Math.abs(p[0]-f[0])<=r&&Math.abs(p[1]-f[1])<=r}if(!s){const p=i.slice();for(const f of a){const y=p.findIndex(h=>l(f,h));if(y===-1)return{isCorrect:!1,details:{message:"That graph is not correct. Try again."}};p.splice(y,1)}return{isCorrect:!0,details:{message:"Correct! The transformation is accurate."}}}for(let p=0;p<a.length;p++){const f=a[p],y=i[p];if(!l(f,y))return{isCorrect:!1,details:{message:"That graph is not correct. Try again."}}}return{isCorrect:!0,details:{message:"Correct! The transformation is accurate."}}}function pt(e,t){const n=e.activityState??{},o=n.evaluate,r=Number(n.tolerance??t?.activity?.config?.tolerance??.5),s=e.studentPoints??[];if(!o)return{isCorrect:!1,details:{message:"No function evaluator available for validation."}};if(!s||s.length===0)return{isCorrect:!1,details:{message:"Plot at least one point on the curve to submit."}};for(const c of s){const a=Number(c[0]),i=Number(c[1]);if(!Number.isFinite(a)||!Number.isFinite(i))return{isCorrect:!1,details:{message:"Invalid student points."}};let l;try{l=Number(o(a))}catch{return{isCorrect:!1,details:{message:"Failed to evaluate function at student x."}}}if(!Number.isFinite(l)||Math.abs(l-i)>r)return{isCorrect:!1,details:{message:"One or more points are not on the curve (within tolerance)."}}}return{isCorrect:!0,details:{message:"Correct — points lie on the function (within tolerance)."}}}function ft(e,t){const n=e.activityState??{},o=n.expectedPoints??[],r=e.studentPoints??[],s=Number(n.tolerance??t?.activity?.config?.tolerance??.5);if(!o||o.length===0)return{isCorrect:!1,details:{message:"No expected intersections computed."}};if(!r||r.length<o.length)return{isCorrect:!1,details:{message:`Plot the ${o.length} intersection point(s).`}};for(const c of o)if(!r.find(i=>Math.hypot(i[0]-c[0],i[1]-c[1])<=s))return{isCorrect:!1,details:{message:"One or more intersection points are missing or off by more than tolerance."}};return{isCorrect:!0,details:{message:"Correct — intersections found."}}}function mt(e,t){const n=e.activityState??{},o=n.expectedPoints??[],r=e.studentPoints??[],s=Number(n.tolerance??t?.activity?.config?.tolerance??.5);if(!o||o.length===0)return{isCorrect:!1,details:{message:"No extrema computed for this function."}};if(!r||r.length<o.length)return{isCorrect:!1,details:{message:`Plot the ${o.length} extrema points.`}};for(const c of o)if(!r.find(i=>Math.hypot(i[0]-c[0],i[1]-c[1])<=s))return{isCorrect:!1,details:{message:"One or more extrema are missing or outside tolerance."}};return{isCorrect:!0,details:{message:"Correct — extrema located."}}}function yt(e,t){const n=e.activityState??{},o=n.evaluate,r=Number(n.tolerance??t?.activity?.config?.tolerance??.5),s=e.studentPoints??[];if(!o)return{isCorrect:!1,details:{message:"No function evaluator available."}};if(!s||s.length===0)return{isCorrect:!1,details:{message:"Plot at least one point."}};for(const c of s){const a=Number(c[0]),i=Number(c[1]);if(!Number.isFinite(a)||!Number.isFinite(i))return{isCorrect:!1,details:{message:"Invalid student point."}};let l;try{l=Number(o(a))}catch{return{isCorrect:!1,details:{message:"Evaluation error."}}}if(!Number.isFinite(l)||Math.abs(l-i)>r)return{isCorrect:!1,details:{message:"Point not on curve within tolerance."}}}return{isCorrect:!0,details:{message:"Correct — points match the rational expression (within tolerance)."}}}const de={};function ee(e,t){typeof e!="string"||typeof t!="function"||(de[e]=t)}function ht(e){return e&&de[e]?de[e]:de.transformations}function vt(e,t,n){const o=ht(e);return o?o(t,n):{isCorrect:!1,details:{message:"No validator registered."}}}ee("transformations",ut);ee("functionPlot",pt);ee("intersection",ft);ee("extrema",mt);ee("rationalPlot",yt);function bt(e,t,n,o={}){const{xmin:r,xmax:s,ymin:c,ymax:a}=t,{width:i,height:l}=n,p=i/(s-r),f=l/(a-c),y=x=>(x-r)*p,h=x=>l-(x-c)*f,b=h(0),g=y(0);let k="";for(let x=Math.ceil(r);x<=Math.floor(s);x++){const S=y(x);k+=`<line x1="${S}" y1="0" x2="${S}" y2="${l}" stroke="${x===0?"#000":"#f2f2f2"}"/>`,x!==0&&(k+=`<text x="${S}" y="${b+15}" font-size="12" font-family="sans-serif" text-anchor="middle" fill="#666">${x}</text>`)}for(let x=Math.ceil(c);x<=Math.floor(a);x++){const S=h(x);k+=`<line x1="0" y1="${S}" x2="${i}" y2="${S}" stroke="${x===0?"#000":"#f2f2f2"}"/>`,x!==0&&(k+=`<text x="${g-5}" y="${S+4}" font-size="12" font-family="sans-serif" text-anchor="end" fill="#666">${x}</text>`)}return e+k}function gt(e,t,n,o){const{xmin:r,xmax:s,ymin:c,ymax:a}=n,{width:i,height:l}=o,p=i/(s-r),f=l/(a-c),y=g=>(g-r)*p,h=g=>l-(g-c)*f;let b="";for(const g of t){const k=g.style||{},x=g.label;if(g.type==="points"){const S=k.r??5,I=k.fill??"black";for(const P of g.points)b+=`<circle cx="${y(P.x)}" cy="${h(P.y)}" r="${S}" fill="${I}" />`;if(x&&g.points.length>0){const P=g.points[g.points.length-1];b+=`<text x="${y(P.x)+8}" y="${h(P.y)}" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="${I}">${x}</text>`}}else if(g.type==="polyline"){const S=k.stroke??"black",I=k.strokeWidth??2,P=k.fill??"none",B=k.opacity??1,C=k.dashed?"5,5":"none";if(g.points.length>0){const D=Array.isArray(g.segmentMask)?g.segmentMask:null;if(D){let w="",T=!1;for(let L=0;L<g.points.length-1;L++){const O=g.points[L],$=g.points[L+1];!!(D[L]&&D[L+1])?T?w+=`L ${y($.x)} ${h($.y)} `:(w+=`M ${y(O.x)} ${h(O.y)} `,w+=`L ${y($.x)} ${h($.y)} `,T=!0):T=!1}w&&(b+=`<path d="${w.trim()}" fill="${P}" stroke="${S}" stroke-width="${I}" opacity="${B}" stroke-dasharray="${C}" />`)}else{const w=g.points.map((T,L)=>(L===0?"M":"L")+y(T.x)+" "+h(T.y)).join(" ");b+=`<path d="${w}" fill="${P}" stroke="${S}" stroke-width="${I}" opacity="${B}" stroke-dasharray="${C}" />`}if(x){const w=g.points[g.points.length-1];b+=`<text x="${y(w.x)+8}" y="${h(w.y)}" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="${S}">${x}</text>`}}}}return e+b}function E(e){const t=document.getElementById("app"),n=e?._legacyRenderTarget??t,o=e?._legacyWrap!==void 0?e._legacyWrap:!0;if(!n)return;const r=e.config,s=r.original.points,c=e.expectedPoints,a=e.studentPoints??[],i=e.orderedStudentPoints??[],l=e.uiMode==="slide",p=r?.ui?.layout??{},f=Number(p.graphSize),y=Number.isFinite(f)&&f>0?f:l?520:600,h=Number.isFinite(f)&&f>0?f:l?520:600,b="<p>Notice how the y-coordinate of all points on the transformed graph g(x) are the <i>negative</i> of the y-coordinate on the f(x).</p><p>This is a <b>vertical reflection</b> about the x-axis.</p>",g=e.lastSubmitCorrect?"feedback-success":e.submitted&&e.lastSubmitCorrect===!1?"feedback-error":"";r.activity?.progressLabel;const k=!!e.slideExplanationOpen?.[e.currentStep];Array.isArray(e.persistedReferenceGraph)?e.persistedReferenceGraph:Array.isArray(e.persistedGraphPoints)&&e.persistedGraphPoints;const S=((u,d)=>u===1?null:Array.isArray(d.persistedReferenceGraph)&&d.persistedReferenceGraph.length>0?d.persistedReferenceGraph:Array.isArray(d.persistedGraphPoints)?d.persistedGraphPoints:null)(e.currentStep,e),I=e.currentStep>=2&&S&&S.length>0,P="−",B={x:"x",y:`${P}y`},C=e.part2Answer??{x:null,y:null},D=!!(C.x&&C.y),w=!!e.part2Correct,T=!!e.part2Submitted,L=T?{x:C.x===B.x,y:C.y===B.y}:{x:!1,y:!1},O=T&&!w?{x:C.x!==B.x,y:C.y!==B.y}:{x:!1,y:!1},$=u=>{if(!u)return"";if(u.startsWith(P)){const d=u.slice(P.length);return`<span class="math-minus">${P}</span><span class="math-var">${d}</span>`}return`<span class="math-var">${u}</span>`},R=u=>{if(u==null)return"";const d=String(u);return d.startsWith("-")?`<span class="math-minus">${P}</span><span class="math-num">${d.slice(1)}</span>`:d.startsWith(P)?`<span class="math-minus">${P}</span><span class="math-num">${d.slice(P.length)}</span>`:`<span class="math-num">${d}</span>`},K=u=>{const[d,m]=u;return`<span class="rule-math">(</span>${R(d)}<span class="rule-math">,</span> ${R(m)}<span class="rule-math">)</span>`},te=[{value:"x",html:$("x"),group:"x"},{value:`${P}x`,html:$(`${P}x`),group:"x"},{value:"y",html:$("y"),group:"y"},{value:`${P}y`,html:$(`${P}y`),group:"y"}],Q=(u=>{const d=[];for(let v=0;v<u.length-1;v++){const[N,F]=u[v],[q,ce]=u[v+1];if(F===0&&d.push([N,0]),ce===0&&d.push([q,0]),F<0&&ce>0||F>0&&ce<0){const Ue=(0-F)/(ce-F),Ye=N+Ue*(q-N),Xe=Math.round(Ye*1e3)/1e3;d.push([Xe,0])}}const m=new Set;return d.filter(v=>{const N=`${v[0]},${v[1]}`;return m.has(N)?!1:(m.add(N),!0)})})(s),V=Q.map(u=>`${u[0]},${u[1]}`),A=e.part3Answer??{p1:null,p2:null,coordType:null,value:null},qe=!!(A.p1&&A.p2&&A.coordType&&A.value),re=!!e.part3Correct,J=!!e.part3Submitted,He=J&&re,ne=e.showSolution&&e.lastSubmitCorrect===!1,fe=e.lastSubmitCorrect===!0,je=ne||fe,se=new Set(V),oe=A.p1&&A.p2&&A.p1===A.p2,ie=J&&!re?{p1:!A.p1||!se.has(A.p1)||oe,p2:!A.p2||!se.has(A.p2)||oe,coordType:A.coordType!=="y-coordinate",value:A.value!=="0"}:{p1:!1,p2:!1,coordType:!1,value:!1},ae=J?{p1:!!(A.p1&&se.has(A.p1)&&!oe),p2:!!(A.p2&&se.has(A.p2)&&!oe),coordType:A.coordType==="y-coordinate",value:A.value==="0"}:{p1:!1,p2:!1,coordType:!1,value:!1},z=new Map,me=u=>{const d=`${u[0]},${u[1]}`;z.has(d)||z.set(d,K(u))};Q.forEach(me),s.forEach(me),c.forEach(u=>me([u[0],u[1]]));const De=["0,-1","1,0","0,1","4,0"].filter(u=>z.has(u)).map(u=>({type:"point",value:u,html:z.get(u)})),Ge=[{type:"coordType",value:"x-coordinate",html:"x-coordinate"},{type:"coordType",value:"y-coordinate",html:"y-coordinate"}],We=[{type:"value",value:"0",html:R("0")},{type:"value",value:`${P}1`,html:R(`${P}1`)}],be=`
    <div class="explanation-box success-reveal status-success ${l?"slide-compact":""}">
      <div class="status-title">Correct — nice work!</div>
      <div class="explanation-inline">
        <span class="status-text">Notice how each y-coordinate is replaced by its opposite value.</span>
        ${l?`
          <button class="slide-explanation-toggle inline" data-step="${e.currentStep}">
            ${k?"Hide explanation":"Show explanation"}
          </button>
        `:""}
      </div>
      ${l?`
        <div class="slide-explanation-text ${k?"open":""}">
          A reflection in the x-axis keeps x-values the same and multiplies y-values by ${P}1. Points on the x-axis have y = 0, so they do not move under the reflection. Therefore, the shared points are the x-intercepts, and they have the same y-coordinate, which is 0.
        </div>
      `:`A reflection in the x-axis keeps x-values the same and multiplies y-values by ${P}1. Points on the x-axis have y = 0, so they do not move under the reflection. Therefore, the shared points are the x-intercepts, and they have the same y-coordinate, which is 0.`}
      <button id="nextPartBtn" class="next-part-btn">Finish Exploration →</button>
    </div>
  `,U=([u,d])=>({x:u,y:d}),W=[];let Y=`<svg id="graphSvg" width="${y}" height="${h}" viewBox="0 0 ${y} ${h}" xmlns="http://www.w3.org/2000/svg">`;if(Y=bt(Y,e.view,{width:y,height:h}),s.length>0){const u=s.map(U);W.push({type:"polyline",points:u,style:{stroke:"#2563eb",strokeWidth:2}}),W.push({type:"points",points:u,style:{fill:"#2563eb",r:6}})}if(!I&&a.length>1){const u=[...a].sort((d,m)=>d[0]-m[0]);W.push({type:"polyline",points:u.map(U),style:{stroke:e.submitted?e.lastSubmitCorrect?"#16a34a":"#dc2626":"#6d28d9",strokeWidth:e.submitted&&e.lastSubmitCorrect?4:3,opacity:1}})}if(!I&&a.length>0){const u=e.config.interaction?.mode||"placePoints",N=e.submitted?e.lastSubmitCorrect?"#16a34a":"#dc2626":"#6d28d9",F=e.submitted&&e.lastSubmitCorrect?4:3;u==="placePoints"?W.push({type:"points",points:a.map(U),style:{fill:N,r:6}}):a.length>1&&W.push({type:"polyline",points:a.map(U),style:{stroke:N,strokeWidth:F,opacity:.25}})}if(!I&&i.length>1){const u=new Set(i.map(v=>`${v[0]},${v[1]}`)),d=e.expectedPoints.map(U),m=e.expectedPoints.map(v=>u.has(`${v[0]},${v[1]}`));W.push({type:"polyline",points:d,segmentMask:m,style:{stroke:e.submitted?e.lastSubmitCorrect?"#16a34a":"#dc2626":"#6d28d9",strokeWidth:e.submitted&&e.lastSubmitCorrect?4:3,opacity:1}})}if(e.expectedPoints&&e.expectedPoints.length>0&&(e.submitted||I)){const u=I?S:c;if((e.showSolution||I)&&u.length>0){const d=u.map(U);W.push({type:"polyline",points:d,style:{stroke:"#16a34a",strokeWidth:5}}),W.push({type:"points",points:d,style:{fill:"#16a34a",r:6}})}}Y=gt(Y,W,e.view,{width:y,height:h}),Y+="</svg>";const Ve=e.currentStep===2&&T&&(w||e.part2ShowSolution)?" step-2-resolved":"",ge=`
    <div class="main-container step-${e.currentStep}${Ve}">
      <div class="activity-layout">
        <div class="activity-copy left-panel">
        <div class="page-heading">
          ${e.currentStep===3?"":'<div class="heading-label">Exploration 2</div>'}
          <div class="heading-title">Reflection in the <span class="nowrap">x-axis</span></div>
        </div>

        <section style="margin-bottom:18px;padding-top:8px;">
          ${e.currentStep===1?`
            ${je?"":`
              <div class="question-label">Question 1 (of 3)</div>
              <div class="task-instructions">Sketch the mirror image graph, <strong>y = g(x)</strong>, by clicking where the 5 connection points should be, and using the above controls.</div>
            `}
            ${e.feedback&&e.lastSubmitCorrect===!1&&!ne?`
              <div id="feedback" class="graph-feedback ${g}">
                ${e.feedback}
              </div>
            `:""}
              ${e.lastSubmitCorrect||e.showSolution?`
                <div id="explanation" class="explanation-box ${e.lastSubmitCorrect||e.showSolution?"success-reveal":""} ${l?"slide-compact":""} ${ne||fe?"show-solution":""}">
                  ${e.lastSubmitCorrect?`
                    <div class="status-title">${e.feedback}</div>
                  `:""}
                  ${l?ne||fe?`
                    <div class="slide-explanation-text open">
                      ${b}
                    </div>
                  `:`
                    <div class="slide-explanation-text ${k?"open":""}">
                      ${b}
                    </div>
                    <button class="slide-explanation-toggle" data-step="${e.currentStep}">
                      ${k?"Hide explanation":"Show explanation"}
                    </button>
                  `:b}
                  ${e.lastSubmitCorrect||e.showSolution?`
                    <button id="nextPartBtn" class="next-part-btn">Continue to Part 2 →</button>
                  `:""}
                </div>
              `:""}
          `:e.currentStep===2?`
            <div class="question-body">
              <div class="question-label">Question 2</div>
              <div class="task-instructions">Drag & Drop the boxes below to state the <b>mapping rule</b> from f(x) to g(x).</div>

              <div class="rule-card">
              <div class="mapping-line">
                <span class="rule-prefix">All points</span>
                <div class="math-expression">
                  <span class="rule-math">(</span>${$("x")}<span class="rule-math">,</span> ${$("y")}<span class="rule-math">)</span>
                  <span class="rule-arrow">&rarr;</span>
                  <span class="rule-math">(</span>

                  <div class="drop-stack">
                    <div class="drop-label">NEW X</div>
                    <div class="drop-zone ${C.x?"filled":""} ${L.x?"correct":""} ${O.x?"invalid shake":""}" data-slot="x" tabindex="0" role="button" aria-label="new x drop zone">
                      ${C.x?`
                        <span class="drop-value">${$(C.x)}</span>
                        <button class="drop-clear" data-slot="x" aria-label="Clear new x">&times;</button>
                      `:'<span class="drop-placeholder">drop</span>'}
                    </div>
                  </div>

                  <span class="rule-sep">,</span>

                  <div class="drop-stack">
                    <div class="drop-label">NEW Y</div>
                    <div class="drop-zone ${C.y?"filled":""} ${L.y?"correct":""} ${O.y?"invalid shake":""}" data-slot="y" tabindex="0" role="button" aria-label="new y drop zone">
                      ${C.y?`
                        <span class="drop-value">${$(C.y)}</span>
                        <button class="drop-clear" data-slot="y" aria-label="Clear new y">&times;</button>
                      `:'<span class="drop-placeholder">drop</span>'}
                    </div>
                  </div>

                  <span class="rule-math">)</span>
                </div>
              </div>

              ${T&&!w?`
                <div class="rule-hint">Check how the y-values change.</div>
              `:""}
              </div>

              ${T&&(w||e.part2ShowSolution)?"":`
              <div class="token-bank">
              <div class="token-group">
                <div class="token-label">X-values</div>
                <div class="token-row">
                  ${te.filter(u=>u.group==="x").map(u=>`
                    <div class="drag-token ${e.part2SelectedToken===u.value?"selected":""}" data-value="${u.value}" tabindex="0" role="button" aria-pressed="${e.part2SelectedToken===u.value}" draggable="true">${u.html}</div>
                  `).join("")}
                </div>
              </div>

              <div class="token-group">
                <div class="token-label">Y-values</div>
                <div class="token-row">
                  ${te.filter(u=>u.group==="y").map(u=>`
                    <div class="drag-token ${e.part2SelectedToken===u.value?"selected":""}" data-value="${u.value}" tabindex="0" role="button" aria-pressed="${e.part2SelectedToken===u.value}" draggable="true">${u.html}</div>
                  `).join("")}
                </div>
              </div>
            </div>
              `}
            </div>

            <div class="feedback-area">
              ${T?`
                ${w?`
                  ${e.part2ShowSolution?`
                    <div class="explanation-box success-reveal solution-explanation ${l?"slide-compact":""}">
                      The mapping rule is <span class="rule-math">(</span>${$("x")}<span class="rule-math">,</span> ${$("y")}<span class="rule-math">) &rarr; (</span>${$("x")}<span class="rule-math">,</span> ${$(`${P}y`)}<span class="rule-math">)</span>.
                      <button id="nextPartBtn" class="next-part-btn">Continue to Part 3 →</button>
                    </div>
                  `:`
                    <div class="status-card success-reveal status-success ${l?"slide-compact":""}">
                      <div class="status-title">Correct — nice work!</div>
                      <div class="status-text">Notice how each y-coordinate is replaced by its opposite value.</div>
                      <button id="nextPartBtn" class="next-part-btn">Continue to Part 3 →</button>
                    </div>
                  `}
                `:`
                  <div class="status-card success-reveal status-error ${l?"slide-compact":""}">
                    <div class="status-title">Not Correct — try again or click "See Solution".</div>
                  </div>
                `}
              `:""}
            </div>
          `:e.currentStep===3?`
            <div class="q3-panel">
              <div class="question-body">
                <div class="question-label">Question 3</div>
                <div class="task-instructions"><strong>Drag &amp; drop</strong> to complete each statement.</div>

                <div class="rule-card">
              <div class="mapping-line">
                <span class="rule-prefix">The points on both graphs are</span>
                <div class="math-expression">
                  <div class="drop-zone point-slot ${A.p1?"filled":""} ${ae.p1?"correct":""} ${ie.p1?"invalid shake":""}" data-slot="p1" data-accept="point" tabindex="0" role="button" aria-label="first point drop zone">
                    ${A.p1?`
                      <span class="drop-value">${z.get(A.p1)??""}</span>
                      <button class="drop-clear" data-slot="p1" aria-label="Clear first point">&times;</button>
                    `:'<span class="drop-placeholder">drop</span>'}
                  </div>
                  <span class="rule-sep">and</span>
                  <div class="drop-zone point-slot ${A.p2?"filled":""} ${ae.p2?"correct":""} ${ie.p2?"invalid shake":""}" data-slot="p2" data-accept="point" tabindex="0" role="button" aria-label="second point drop zone">
                    ${A.p2?`
                      <span class="drop-value">${z.get(A.p2)??""}</span>
                      <button class="drop-clear" data-slot="p2" aria-label="Clear second point">&times;</button>
                    `:'<span class="drop-placeholder">drop</span>'}
                  </div>
                  <span class="rule-math">.</span>
                </div>
              </div>

              <div class="mapping-line">
                <span class="rule-prefix">They have the same</span>
                <div class="math-expression">
                  <div class="drop-zone coord-slot ${A.coordType?"filled":""} ${ae.coordType?"correct":""} ${ie.coordType?"invalid shake":""}" data-slot="coordType" data-accept="coordType" tabindex="0" role="button" aria-label="coordinate type drop zone">
                    ${A.coordType?`
                      <span class="drop-value">${A.coordType}</span>
                      <button class="drop-clear" data-slot="coordType" aria-label="Clear coordinate type">&times;</button>
                    `:'<span class="drop-placeholder">drop</span>'}
                  </div>
                  <span class="rule-sep">,</span>
                  <span class="rule-prefix">which is</span>
                  <div class="drop-zone value-slot ${A.value?"filled":""} ${ae.value?"correct":""} ${ie.value?"invalid shake":""}" data-slot="value" data-accept="value" tabindex="0" role="button" aria-label="value drop zone">
                    ${A.value?`
                      <span class="drop-value">${R(A.value)}</span>
                      <button class="drop-clear" data-slot="value" aria-label="Clear value">&times;</button>
                    `:'<span class="drop-placeholder">drop</span>'}
                  </div>
                  <span class="rule-math">.</span>
                </div>
              </div>
                </div>

                <div class="banks-scroll">
                  <div class="token-bank">
                    <div class="token-group">
                      <div class="token-label">Points:</div>
                      <div class="token-row points-grid">
                        ${De.map(u=>`
                          <div class="drag-token ${e.part3SelectedToken?.value===u.value?"selected":""}" data-type="${u.type}" data-value="${u.value}" tabindex="0" role="button" aria-pressed="${e.part3SelectedToken?.value===u.value}" draggable="true">${u.html}</div>
                        `).join("")}
                      </div>
                    </div>

                    <div class="token-group">
                      <div class="token-label">Type:</div>
                      <div class="token-row">
                        ${Ge.map(u=>`
                          <div class="drag-token ${e.part3SelectedToken?.value===u.value?"selected":""}" data-type="${u.type}" data-value="${u.value}" tabindex="0" role="button" aria-pressed="${e.part3SelectedToken?.value===u.value}" draggable="true">${u.html}</div>
                        `).join("")}
                      </div>
                    </div>

                    <div class="token-group">
                      <div class="token-label">Value:</div>
                      <div class="token-row">
                        ${We.map(u=>`
                          <div class="drag-token ${e.part3SelectedToken?.value===u.value?"selected":""}" data-type="${u.type}" data-value="${u.value}" tabindex="0" role="button" aria-pressed="${e.part3SelectedToken?.value===u.value}" draggable="true">${u.html}</div>
                        `).join("")}
                      </div>
                    </div>
                  </div>
                </div>

            <div class="feedback-area">
              ${J?`
              ${re?`
                ${l?"":be}
              `:`
                <div class="status-card success-reveal status-error">
                  <div class="status-title">Not Correct — try again or click "See Solution".</div>
                </div>
              `}
              `:""}
            </div>
          `:`
            <div class="question-label">All done</div>
            <div class="task-instructions">You have completed this exploration.</div>
          `}
        </section>
        </div>

        <div class="graph-column">

        <div class="graph-toolbar">
          <div class="controls">
            <button id="undoBtn">Undo</button>
            <button id="resetBtn">Reset</button>
            <button id="submitBtn" class="submit-btn" ${e.currentStep===2&&!D||e.currentStep===3&&!qe?"disabled":""}>Submit</button>
            ${e.currentStep===1&&!e.showSolution&&e.lastSubmitCorrect===!1||e.currentStep===2&&T&&!w||e.currentStep===3&&J&&!re?'<button id="solutionBtn">See Solution</button><button id="tryAgainBtn" style="margin-left:6px;">Try Again</button>':""}
          </div>
        </div>

        <div class="graph-frame">
          ${Y}
          <div class="graph-label">y = f(x)</div>
          ${e.showSolution||e.lastSubmitCorrect||I?'<div class="solution-label">y = g(x)</div>':""}
        </div>

        ${l&&e.currentStep===3&&He?`
          <div class="graph-completion slide-q3-completion">
            ${be}
          </div>
        `:""}

        </div>
      </div>
    </div>
  `,ze=o?`
      <div class="slide-scale-root">
        <div class="slide-scale-inner">
          <div class="slide-viewport">
            <div class="slide-safe-area">
              ${ge}
            </div>
          </div>
        </div>
      </div>
    `:ge;if(n.innerHTML=ze,window.dispatchEvent(new Event("applet:rendered")),document.getElementById("undoBtn")?.addEventListener("click",()=>{if(e.currentStep===2)e.part2Answer?.y?e.part2Answer={...e.part2Answer,y:null}:e.part2Answer?.x&&(e.part2Answer={...e.part2Answer,x:null}),e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",E(e);else if(e.currentStep===3){const u=e.part3History.pop();u&&(e.part3Answer=u),e.part3SelectedToken=null,e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",E(e)}else e.undo(),E(e)}),document.getElementById("resetBtn")?.addEventListener("click",()=>{e.currentStep===2?(e.part2Answer={x:null,y:null},e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",E(e)):e.currentStep===3?(e.part3Answer={p1:null,p2:null,coordType:null,value:null},e.part3SelectedToken=null,e.part3History=[],e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",E(e)):(e.reset(),E(e))}),document.getElementById("tryAgainBtn")?.addEventListener("click",()=>{e.currentStep===2?(e.part2Answer={x:null,y:null},e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",E(e)):e.currentStep===3?(e.part3Answer={p1:null,p2:null,coordType:null,value:null},e.part3SelectedToken=null,e.part3History=[],e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",E(e)):(e.reset(),E(e))}),document.getElementById("submitBtn")?.addEventListener("click",()=>{if(e.currentStep===2){if(!e.part2Answer?.x||!e.part2Answer?.y)return;const m=e.part2Answer?.x==="x"&&e.part2Answer?.y==="−y";e.part2Submitted=!0,e.part2Correct=m,e.part2ShowSolution=!1,e.part2Feedback=m?"Correct — nice work!":'Not Correct — try again or click "See Solution".',E(e),e.currentStep!==2&&setTimeout(()=>{const v=document.querySelector(m?"#nextPartBtn":".status-card");v&&v.scrollIntoView({behavior:"smooth",block:"center"})},0);return}if(e.currentStep===3){if(!e.part3Answer?.p1||!e.part3Answer?.p2||!e.part3Answer?.coordType||!e.part3Answer?.value)return;const m=new Set(V),v=m.has(e.part3Answer.p1)&&m.has(e.part3Answer.p2)&&e.part3Answer.p1!==e.part3Answer.p2&&e.part3Answer.coordType==="y-coordinate"&&e.part3Answer.value==="0";e.part3Submitted=!0,e.part3Correct=v,e.part3ShowSolution=!1,e.part3Feedback=v?"Correct — nice work!":'Not Correct — try again or click "See Solution".',E(e),setTimeout(()=>{const N=document.querySelector(v?"#nextPartBtn":".status-card");N&&N.scrollIntoView({behavior:"smooth",block:"center"})},0);return}const u=e.config?.activityType??"transformations",d=vt(u,e,e.config);if(e.submitted=!0,e.lastSubmitCorrect=!!d?.isCorrect,e.lastSubmitCorrect){e.feedback="CORRECT - Your graph is bang on!";const m=c.map(v=>[v[0],v[1]]);e.persistedGraphPoints=m,e.persistedReferenceGraph=m.map(v=>[v[0],v[1]])}else e.feedback='<strong>Not Correct</strong> - Click "Try Again" or "See Solution".';e.lastSubmitCorrect||(e.showSolution=r.feedback.showExpectedPointsOnFail),E(e),e.lastSubmitCorrect?setTimeout(()=>{const m=document.getElementById("nextPartBtn");m&&m.scrollIntoView({behavior:"smooth",block:"center"})},0):e.currentStep!==1&&setTimeout(()=>{const m=document.getElementById("feedback");m&&m.scrollIntoView({behavior:"smooth",block:"center"})},0)}),document.getElementById("solutionBtn")?.addEventListener("click",()=>{if(e.currentStep===2){e.part2Answer={x:"x",y:"−y"},e.part2Submitted=!0,e.part2Correct=!0,e.part2ShowSolution=!0,e.part2Feedback="Correct — nice work!",E(e);return}if(e.currentStep===3){e.part3Answer={p1:V[0]??null,p2:V[1]??null,coordType:"y-coordinate",value:"0"},e.part3History=[],e.part3Submitted=!0,e.part3Correct=!0,e.part3ShowSolution=!0,e.part3Feedback="Correct — nice work!",E(e);return}e.enableSolution(),E(e),e.currentStep!==1&&setTimeout(()=>{const u=document.getElementById("nextPartBtn");u&&u.scrollIntoView({behavior:"smooth",block:"center"})},0)}),document.getElementById("nextPartBtn")?.addEventListener("click",()=>{if(e.currentStep===1){if(!e.persistedReferenceGraph){const u=c.map(d=>[d[0],d[1]]);e.persistedGraphPoints=u,e.persistedReferenceGraph=u.map(d=>[d[0],d[1]])}e.currentStep=2,e.studentPoints=[],e.orderedStudentPoints=[],e.submitted=!1,e.lastSubmitCorrect=null,e.feedback="",e.showSolution=!1,e.part2Answer={x:null,y:null},e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",e.slideExplanationOpen={...e.slideExplanationOpen,2:!1},E(e);return}if(e.currentStep===2){e.currentStep=3,e.part3Answer={p1:null,p2:null,coordType:null,value:null},e.part3SelectedToken=null,e.part3History=[],e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",e.slideExplanationOpen={...e.slideExplanationOpen,3:!1},E(e);return}e.currentStep===3&&(e.currentStep=4,e.slideExplanationOpen={...e.slideExplanationOpen,4:!1},E(e))}),document.querySelectorAll(".slide-explanation-toggle").forEach(u=>{u.addEventListener("click",()=>{const d=Number(u.dataset.step);e.slideExplanationOpen={...e.slideExplanationOpen,[d]:!e.slideExplanationOpen?.[d]},E(e)})}),e.currentStep===2){const u=(d,m)=>{e.part2Answer={...e.part2Answer,[d]:m},e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",E(e)};document.querySelectorAll(".drag-token").forEach(d=>{d.addEventListener("dragstart",m=>{d.classList.add("dragging"),m.dataTransfer?.setData("text/plain",d.dataset.value||"")}),d.addEventListener("dragend",()=>{d.classList.remove("dragging")}),d.addEventListener("click",()=>{e.part2SelectedToken=d.dataset.value||null,E(e)}),d.addEventListener("keydown",m=>{(m.key==="Enter"||m.key===" ")&&(m.preventDefault(),e.part2SelectedToken=d.dataset.value||null,E(e))})}),document.querySelectorAll(".drop-zone").forEach(d=>{d.addEventListener("dragover",m=>{m.preventDefault(),d.classList.add("drag-over")}),d.addEventListener("dragleave",()=>{d.classList.remove("drag-over")}),d.addEventListener("drop",m=>{m.preventDefault(),d.classList.remove("drag-over");const v=m.dataTransfer?.getData("text/plain");v&&(u(d.dataset.slot,v),setTimeout(()=>{const N=document.querySelector(`.drop-zone[data-slot="${d.dataset.slot}"]`);N&&(N.classList.add("drop-success"),setTimeout(()=>N.classList.remove("drop-success"),180))},0))}),d.addEventListener("click",()=>{e.part2SelectedToken&&(u(d.dataset.slot,e.part2SelectedToken),setTimeout(()=>{const m=document.querySelector(`.drop-zone[data-slot="${d.dataset.slot}"]`);m&&(m.classList.add("drop-success"),setTimeout(()=>m.classList.remove("drop-success"),180))},0))}),d.addEventListener("keydown",m=>{(m.key==="Enter"||m.key===" ")&&e.part2SelectedToken&&(m.preventDefault(),u(d.dataset.slot,e.part2SelectedToken),setTimeout(()=>{const v=document.querySelector(`.drop-zone[data-slot="${d.dataset.slot}"]`);v&&(v.classList.add("drop-success"),setTimeout(()=>v.classList.remove("drop-success"),180))},0))})}),document.querySelectorAll(".drop-clear").forEach(d=>{d.addEventListener("click",m=>{m.stopPropagation();const v=d.dataset.slot;v&&u(v,null)})})}if(e.currentStep===3){const u=(d,m)=>{e.part3History.push({...e.part3Answer}),e.part3Answer={...e.part3Answer,[d]:m},e.part3SelectedToken=null,e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",E(e)};document.querySelectorAll(".drag-token").forEach(d=>{d.addEventListener("dragstart",m=>{d.classList.add("dragging"),m.dataTransfer?.setData("text/plain",d.dataset.value||""),m.dataTransfer?.setData("text/type",d.dataset.type||"")}),d.addEventListener("dragend",()=>{d.classList.remove("dragging")}),d.addEventListener("click",()=>{e.part3SelectedToken={type:d.dataset.type,value:d.dataset.value},E(e)}),d.addEventListener("keydown",m=>{(m.key==="Enter"||m.key===" ")&&(m.preventDefault(),e.part3SelectedToken={type:d.dataset.type,value:d.dataset.value},E(e))})}),document.querySelectorAll(".drop-zone").forEach(d=>{d.addEventListener("dragover",m=>{m.preventDefault(),d.classList.add("drag-over")}),d.addEventListener("dragleave",()=>{d.classList.remove("drag-over")}),d.addEventListener("drop",m=>{m.preventDefault(),d.classList.remove("drag-over");const v=m.dataTransfer?.getData("text/plain"),N=m.dataTransfer?.getData("text/type"),F=d.dataset.accept;v&&N&&F===N&&(u(d.dataset.slot,v),setTimeout(()=>{const q=document.querySelector(`.drop-zone[data-slot="${d.dataset.slot}"]`);q&&(q.classList.add("drop-success"),setTimeout(()=>q.classList.remove("drop-success"),180))},0))}),d.addEventListener("click",()=>{if(e.part3SelectedToken){const{type:m,value:v}=e.part3SelectedToken;d.dataset.accept===m&&(u(d.dataset.slot,v),setTimeout(()=>{const F=document.querySelector(`.drop-zone[data-slot="${d.dataset.slot}"]`);F&&(F.classList.add("drop-success"),setTimeout(()=>F.classList.remove("drop-success"),180))},0))}}),d.addEventListener("keydown",m=>{if((m.key==="Enter"||m.key===" ")&&e.part3SelectedToken){m.preventDefault();const{type:v,value:N}=e.part3SelectedToken;d.dataset.accept===v&&(u(d.dataset.slot,N),setTimeout(()=>{const q=document.querySelector(`.drop-zone[data-slot="${d.dataset.slot}"]`);q&&(q.classList.add("drop-success"),setTimeout(()=>q.classList.remove("drop-success"),180))},0))}})}),document.querySelectorAll(".drop-clear").forEach(d=>{d.addEventListener("click",m=>{m.stopPropagation();const v=d.dataset.slot;v&&u(v,null)})})}e._shortcutsBound||(document.addEventListener("keydown",u=>{const d=u.key.toLowerCase();d==="enter"?document.getElementById("submitBtn")?.click():u.ctrlKey&&d==="z"&&(u.preventDefault(),e.undo(),E(e))}),e._shortcutsBound=!0)}console.log("validator.js loaded v1");function Fe(e,t,n=0){function o(s,c){return Math.abs(s[0]-c[0])<=n&&Math.abs(s[1]-c[1])<=n}const r=[];for(const s of e){const c=t.find(a=>o(s,a));c&&r.push(c)}return r}const xt={placePoints:(e,t,n,o)=>{if(e.currentStep!==1)return;const r=e.expectedPoints.length;if(e.studentPoints.length>=r)return;const s=n.getBoundingClientRect();let c=t.clientX-s.left,a=t.clientY-s.top;const i=e.view.xmin,l=e.view.xmax,p=e.view.ymin,f=e.view.ymax;let y=s.width,h=s.height;if(n.createSVGPoint&&n.getScreenCTM){const T=n.getScreenCTM();if(T){const L=n.createSVGPoint();L.x=t.clientX,L.y=t.clientY;const O=L.matrixTransform(T.inverse());c=O.x,a=O.y;const $=n.viewBox?.baseVal;$&&$.width&&$.height&&(y=$.width,h=$.height)}}const b=i+c/y*(l-i),g=f-a/h*(f-p),k=e.config.interaction?.snapStep??1,x=[Math.round(b/k)*k,Math.round(g/k)*k],S=e.config.interaction?.hitRadiusPx??18,I=(x[0]-i)/(l-i)*y,P=(f-x[1])/(f-p)*h,B=I-c,C=P-a;Math.sqrt(B*B+C*C)>S||e.studentPoints.some(T=>T[0]===x[0]&&T[1]===x[1])||(e.studentPoints.push(x),e.orderedStudentPoints=Fe(e.expectedPoints,e.studentPoints),o())},drawPolyline:()=>{},dragHandles:()=>{},selectInterval:()=>{}};function Be(e,t){document.addEventListener("pointerdown",function(n){const o=document.getElementById("graphSvg");if(!o||!o.contains(n.target))return;const r=e.config.interaction?.mode||"placePoints",s=e.activityHandlers??{},c={...xt,...s};c[r]&&c[r](e,n,o,t)}),console.log("Interaction attached")}const xe={type:M.GRAPH_PLOT,initState:()=>({submitted:!1}),render:({page:e})=>`
      <div class="page-graph-plot">
        ${e?.showPrompt?_(e):""}
        <div class="legacy-graph-root"></div>
      </div>
    `,bind:({root:e,state:t})=>{const n=e.querySelector(".legacy-graph-root");n&&(t._legacyRenderTarget=n,t._legacyWrap=!1,E(t),t._graphPlotInteractionBound||(Be(t,()=>{E(t)}),t._graphPlotInteractionBound=!0))}},H=e=>{if(!e?.submitted)return"";const t=e.isCorrect?"success":"error",n=e.feedback??(e.isCorrect?"Correct.":"Not correct. Try again.");return`<div class="page-feedback ${t}">${n}</div>`},j=(e,t,n)=>{e.submitted=!0,e.isCorrect=!!t,e.feedback=e.isCorrect?"Correct.":"Not correct. Try again."},Se={type:M.DRAG_DROP_FILL,initState:()=>({answers:{},selectedToken:null,submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.blanks)?e.blanks:[],o=Array.isArray(e?.tokens)?e.tokens:[],r=t?.answers??{},s=n.map(i=>{const l=r[i];return`<div class="drop-slot" data-blank="${i}" tabindex="0" role="button">${l||"[drop]"}</div>`}).join(""),c=o.map(i=>`<div class="token ${t?.selectedToken===i?"selected":""}" data-token="${i}" tabindex="0" role="button">${i}</div>`).join(""),a=H(t);return`
      <div class="page-drag-drop">
        ${_(e)}
        <div class="drop-zone">${s||"[drop zones]"}</div>
        <div class="token-bank">${c||"[token bank]"}</div>
        ${a}
      </div>
    `},bind:({root:e,pageState:t,page:n})=>{const o=e.querySelectorAll(".token"),r=e.querySelectorAll(".drop-slot");o.forEach(s=>{const c=()=>{t.selectedToken=s.dataset.token,e.querySelectorAll(".token").forEach(a=>a.classList.remove("selected")),s.classList.add("selected")};s.addEventListener("click",c),s.addEventListener("keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),c())})}),r.forEach(s=>{const c=()=>{if(!t.selectedToken)return;const a=s.dataset.blank;t.answers[a]=t.selectedToken,s.textContent=t.selectedToken,t.selectedToken=null,e.querySelectorAll(".token").forEach(i=>i.classList.remove("selected"))};s.addEventListener("click",c),s.addEventListener("keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),c())})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.blanks)?t.blanks:[],o=t?.correctAnswers??{},r=n.every(c=>!!e.answers?.[c]),s=n.every(c=>e.answers?.[c]===o[c]);return j(e,r&&s),{rerender:!0}},reset:({pageState:e})=>(e.answers={},e.selectedToken=null,e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},$e={type:M.MULTIPLE_CHOICE,initState:()=>({selected:[],submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.choices)?e.choices:[],o=!!e?.multiSelect,r=t?.selected??[],s=o?"checkbox":"radio",c=e?.id?`mc-${e.id}`:"mc",a=n.map((l,p)=>{const f=r.includes(String(p));return`
          <label class="choice-item">
            <input type="${s}" name="${c}" value="${p}" ${f?"checked":""}>
            <span>${l}</span>
          </label>
        `}).join(""),i=H(t);return`
      <div class="page-multiple-choice">
        ${_(e)}
        <div class="choice-list">${a||"[choices]"}</div>
        ${i}
      </div>
    `},bind:({root:e,pageState:t,page:n})=>{const o=!!n?.multiSelect,r=e.querySelectorAll(".choice-item input");r.forEach(s=>{s.addEventListener("change",()=>{if(o){const c=Array.from(r).filter(a=>a.checked).map(a=>a.value);t.selected=c}else t.selected=s.checked?[s.value]:[]})})},submit:({pageState:e,page:t})=>{const n=!!t?.multiSelect,o=e.selected??[];let r=!1;if(n){const s=Array.isArray(t?.correctIndices)?t.correctIndices.map(String):[],c=[...o].sort(),a=[...s].sort();r=c.length===a.length&&c.every((i,l)=>i===a[l])}else{const s=t?.correctIndex;r=o.length===1&&String(s)===o[0]}return j(e,r),{rerender:!0}},reset:({pageState:e})=>(e.selected=[],e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},ke={type:M.SORT_ORDER,initState:()=>({order:[],submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.items)?e.items:[],o=t?.order??[],r=n.map((c,a)=>{const i=o.indexOf(String(a)),l=i>=0?`<span class="order-badge">${i+1}</span>`:"";return`<div class="sort-item ${i>=0?"selected":""}" data-index="${a}" tabindex="0" role="button">${l}${c}</div>`}).join(""),s=H(t);return`
      <div class="page-sort-order">
        ${_(e)}
        <div class="sort-list">${r||"[sortable items]"}</div>
        ${s}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll(".sort-item").forEach(n=>{const o=()=>{const r=n.dataset.index;r&&(t.order.includes(r)?t.order=t.order.filter(s=>s!==r):t.order=[...t.order,r],e.querySelectorAll(".sort-item").forEach(s=>{s.classList.remove("selected"),s.querySelectorAll(".order-badge").forEach(c=>c.remove())}),t.order.forEach((s,c)=>{const a=e.querySelector(`.sort-item[data-index='${s}']`);if(a){a.classList.add("selected");const i=document.createElement("span");i.className="order-badge",i.textContent=String(c+1),a.prepend(i)}}))};n.addEventListener("click",o),n.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),o())})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.items)?t.items:[],o=Array.isArray(t?.correctOrder)?t.correctOrder:[],r=e.order??[],s=r.length===n.length;let c=!1;if(o.length>0)if(typeof o[0]=="number"){const a=o.map(String);c=a.length===r.length&&a.every((i,l)=>i===r[l])}else{const a=r.map(i=>n[Number(i)]);c=o.length===a.length&&o.every((i,l)=>i===a[l])}return j(e,s&&c),{rerender:!0}},reset:({pageState:e})=>(e.order=[],e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},we={type:M.MATCH_PAIRS,initState:()=>({pairs:{},selectedLeft:null,submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.leftItems)?e.leftItems:[],o=Array.isArray(e?.rightItems)?e.rightItems:[],r=t?.pairs??{},s=n.map((i,l)=>{const p=r[l]!==void 0;return`<div class="match-item ${t?.selectedLeft===String(l)?"selected":""}" data-side="left" data-index="${l}" tabindex="0" role="button">${i}${p?" ✓":""}</div>`}).join(""),c=o.map((i,l)=>{const f=Object.keys(r).find(y=>String(r[y])===String(l))!==void 0;return`<div class="match-item ${f?"paired":""}" data-side="right" data-index="${l}" tabindex="0" role="button">${i}${f?" ✓":""}</div>`}).join(""),a=H(t);return`
      <div class="page-match-pairs">
        ${_(e)}
        <div class="match-columns">
          <div class="match-column">${s||"[left items]"}</div>
          <div class="match-column">${c||"[right items]"}</div>
        </div>
        ${a}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll(".match-item[data-side='left']").forEach(n=>{const o=()=>{t.selectedLeft=n.dataset.index??null,e.querySelectorAll(".match-item[data-side='left']").forEach(r=>r.classList.remove("selected")),n.classList.add("selected")};n.addEventListener("click",o),n.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),o())})}),e.querySelectorAll(".match-item[data-side='right']").forEach(n=>{const o=()=>{const r=n.dataset.index;!t.selectedLeft||r===void 0||(t.pairs[t.selectedLeft]=Number(r),t.selectedLeft=null,e.querySelectorAll(".match-item[data-side='left']").forEach(s=>s.classList.remove("selected")))};n.addEventListener("click",o),n.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),o())})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.leftItems)?t.leftItems:[],o=t?.correctPairs??{},r=e.pairs??{},c=Object.keys(r).length===n.length&&Object.keys(o).every(a=>String(o[a])===String(r[a]));return j(e,c),{rerender:!0}},reset:({pageState:e})=>(e.pairs={},e.selectedLeft=null,e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},Ae={type:M.NUMERIC_INPUT,initState:()=>({value:"",submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=e?.unit?`<span class="numeric-unit">${e.unit}</span>`:"",o=t?.value??"",r=H(t);return`
      <div class="page-numeric-input">
        ${_(e)}
        <div class="numeric-input-row">
          <input class="numeric-input" type="text" placeholder="Enter value" value="${o}">
          ${n}
        </div>
        ${r}
      </div>
    `},bind:({root:e,pageState:t})=>{const n=e.querySelector(".numeric-input");n&&n.addEventListener("input",()=>{t.value=n.value})},submit:({pageState:e,page:t})=>{const n=e.value,o=Number(n),r=Number(t?.correctValue),s=Number(t?.tolerance??0),a=Number.isFinite(o)&&Number.isFinite(r)&&Math.abs(o-r)<=s;return j(e,a),{rerender:!0}},reset:({pageState:e})=>(e.value="",e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},Pe={type:M.TABLE_COMPLETE,initState:()=>({values:{},submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.columns)?e.columns:[],o=Array.isArray(e?.rows)?e.rows:[],r=t?.values??{},s=n.map(i=>`<th>${i}</th>`).join(""),c=o.map((i,l)=>`<tr>${i.map((f,y)=>{if(f==null){const h=`${l},${y}`,b=r[h]??"";return`<td><input data-row="${l}" data-col="${y}" type="text" value="${b}"></td>`}return`<td>${f}</td>`}).join("")}</tr>`).join(""),a=H(t);return`
      <div class="page-table-complete">
        ${_(e)}
        <table class="value-table">
          <thead><tr>${s||""}</tr></thead>
          <tbody>${c||""}</tbody>
        </table>
        ${a}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll("input[data-row]").forEach(n=>{n.addEventListener("input",()=>{const o=n.dataset.row,r=n.dataset.col;if(o===void 0||r===void 0)return;const s=`${o},${r}`;t.values[s]=n.value})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.rows)?t.rows:[],o=Array.isArray(t?.correctRows)?t.correctRows:[],r=e.values??{};let s=!0;return n.forEach((c,a)=>{c.forEach((i,l)=>{if(i==null){const p=`${a},${l}`,f=o?.[a]?.[l];(f==null||String(r[p]??"")!==String(f))&&(s=!1)}})}),j(e,s),{rerender:!0}},reset:({pageState:e})=>(e.values={},e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},Ee={type:M.TRUE_FALSE_GRID,initState:()=>({answers:{},submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const o=(Array.isArray(e?.statements)?e.statements:[]).map((s,c)=>{const a=t?.answers?.[c];return`
          <tr>
            <td>${s}</td>
            <td><button class="tf-btn ${a===!0?"selected":""}" data-index="${c}" data-value="true">True</button></td>
            <td><button class="tf-btn ${a===!1?"selected":""}" data-index="${c}" data-value="false">False</button></td>
          </tr>
        `}).join(""),r=H(t);return`
      <div class="page-true-false">
        ${_(e)}
        <table class="true-false-grid">
          <thead><tr><th>Statement</th><th>True</th><th>False</th></tr></thead>
          <tbody>${o||""}</tbody>
        </table>
        ${r}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll(".tf-btn").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.index,r=n.dataset.value==="true";o!==void 0&&(t.answers[o]=r,e.querySelectorAll(`.tf-btn[data-index='${o}']`).forEach(s=>s.classList.remove("selected")),n.classList.add("selected"))})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.statements)?t.statements:[],o=Array.isArray(t?.correctAnswers)?t.correctAnswers:[],r=e.answers??{},c=n.every((a,i)=>r[i]===!0||r[i]===!1)&&o.every((a,i)=>r[i]===a);return j(e,c),{rerender:!0}},reset:({pageState:e})=>(e.answers={},e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},Te={type:M.PROOF_STEPS,initState:()=>({order:[],submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.steps)?e.steps:[],o=t?.order??[],r=n.map((c,a)=>{const i=o.indexOf(String(a)),l=i>=0?`<span class="order-badge">${i+1}</span>`:"";return`<div class="proof-step ${i>=0?"selected":""}" data-index="${a}" tabindex="0" role="button">${l}${c}</div>`}).join(""),s=H(t);return`
      <div class="page-proof-steps">
        ${_(e)}
        <div class="proof-steps-list">${r||"[proof steps]"}</div>
        ${s}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll(".proof-step").forEach(n=>{const o=()=>{const r=n.dataset.index;r&&(t.order.includes(r)?t.order=t.order.filter(s=>s!==r):t.order=[...t.order,r],e.querySelectorAll(".proof-step").forEach(s=>{s.classList.remove("selected"),s.querySelectorAll(".order-badge").forEach(c=>c.remove())}),t.order.forEach((s,c)=>{const a=e.querySelector(`.proof-step[data-index='${s}']`);if(a){a.classList.add("selected");const i=document.createElement("span");i.className="order-badge",i.textContent=String(c+1),a.prepend(i)}}))};n.addEventListener("click",o),n.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),o())})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.steps)?t.steps:[],o=Array.isArray(t?.correctOrder)?t.correctOrder:[],r=e.order??[],s=r.length===n.length;let c=!1;if(o.length>0)if(typeof o[0]=="number"){const a=o.map(String);c=a.length===r.length&&a.every((i,l)=>i===r[l])}else{const a=r.map(i=>n[Number(i)]);c=o.length===a.length&&o.every((i,l)=>i===a[l])}return j(e,s&&c),{rerender:!0}},reset:({pageState:e})=>(e.order=[],e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},Ce={type:M.GRAPH_IDENTIFY,initState:()=>({selected:[],submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.targets)?e.targets:[],o=t?.selected??[],r=n.map((c,a)=>`<button class="target-chip ${o.includes(String(a))?"selected":""}" data-index="${a}">${c}</button>`).join(""),s=H(t);return`
      <div class="page-graph-identify">
        ${_(e)}
        <div class="graph-placeholder">[graph for identification]</div>
        <div class="target-list">${r||dt(["Targets pending"])}</div>
        ${s}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll(".target-chip").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.index;o!==void 0&&(t.selected.includes(o)?(t.selected=t.selected.filter(r=>r!==o),n.classList.remove("selected")):(t.selected=[...t.selected,o],n.classList.add("selected")))})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.correctTargets)?t.correctTargets.map(String):[],o=(e.selected??[]).map(String).sort(),r=[...n].sort(),s=o.length===r.length&&o.every((c,a)=>c===r[a]);return j(e,s),{rerender:!0}},reset:({pageState:e})=>(e.selected=[],e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},Le={type:M.TRANSFORMATION_BUILDER,initState:()=>({operations:[],submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.operations)?e.operations:[],o=t?.operations??[],r=n.map(a=>`<button class="operation-btn" data-op="${a}">${a}</button>`).join(""),s=o.length?o.map((a,i)=>`<div class="stack-item" data-index="${i}" tabindex="0" role="button">${a}</div>`).join(""):"[stacked operations]",c=H(t);return`
      <div class="page-transformation-builder">
        ${_(e)}
        <div class="operation-bank">${r||"[operations]"}</div>
        <div class="operation-stack">${s}</div>
        ${c}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll(".operation-btn").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.op;if(!o)return;t.operations=[...t.operations,o];const r=e.querySelector(".operation-stack");if(!r)return;const s=document.createElement("div");s.className="stack-item",s.tabIndex=0,s.setAttribute("role","button"),s.textContent=o,r.appendChild(s)})}),e.querySelectorAll(".stack-item").forEach(n=>{const o=()=>{const r=Number(n.dataset.index);Number.isNaN(r)||(t.operations=t.operations.filter((s,c)=>c!==r),n.remove())};n.addEventListener("click",o),n.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),o())})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.correctOperations)?t.correctOperations:[],o=e.operations??[],r=n.length===o.length&&n.every((s,c)=>s===o[c]);return j(e,r),{rerender:!0}},reset:({pageState:e})=>(e.operations=[],e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},St=new Map([[xe.type,xe],[Se.type,Se],[$e.type,$e],[ke.type,ke],[we.type,we],[Ae.type,Ae],[Pe.type,Pe],[Ee.type,Ee],[Te.type,Te],[Ce.type,Ce],[Le.type,Le]]),Re=e=>St.get(e),Me=e=>Array.isArray(e)?e:[],Ne=e=>e!==null&&typeof e=="object"&&!Array.isArray(e),$t={"graph-plot":()=>[],"drag-drop-fill":e=>{const t=[];if(Array.isArray(e?.tokens)||t.push("tokens must be an array"),Array.isArray(e?.blanks)||t.push("blanks must be an array"),!Ne(e?.correctAnswers))t.push("correctAnswers must be an object");else{const o=Me(e?.blanks).filter(r=>e.correctAnswers[r]===void 0);o.length>0&&t.push(`correctAnswers missing keys: ${o.join(", ")}`)}return t},"multiple-choice":e=>{const t=[];return Array.isArray(e?.choices)||t.push("choices must be an array"),!!e?.multiSelect?Array.isArray(e?.correctIndices)||t.push("correctIndices must be an array when multiSelect is true"):e?.correctIndex===void 0&&t.push("correctIndex is required when multiSelect is false"),t},"sort-order":e=>{const t=[];return Array.isArray(e?.items)||t.push("items must be an array"),Array.isArray(e?.correctOrder)?e?.items&&e.correctOrder.length!==e.items.length&&t.push("correctOrder length must match items length"):t.push("correctOrder must be an array"),t},"match-pairs":e=>{const t=[];return Array.isArray(e?.leftItems)||t.push("leftItems must be an array"),Array.isArray(e?.rightItems)||t.push("rightItems must be an array"),Ne(e?.correctPairs)||t.push("correctPairs must be an object"),t},"numeric-input":e=>{const t=[];return e?.correctValue===void 0&&t.push("correctValue is required"),e?.tolerance!==void 0&&!Number.isFinite(Number(e.tolerance))&&t.push("tolerance must be a number if provided"),t},"table-complete":e=>{const t=[];return Array.isArray(e?.columns)||t.push("columns must be an array"),Array.isArray(e?.rows)||t.push("rows must be an array"),Array.isArray(e?.correctRows)||t.push("correctRows must be an array"),t},"true-false-grid":e=>{const t=[];return Array.isArray(e?.statements)||t.push("statements must be an array"),Array.isArray(e?.correctAnswers)?e?.statements&&e.correctAnswers.length!==e.statements.length&&t.push("correctAnswers length must match statements length"):t.push("correctAnswers must be an array"),t},"proof-steps":e=>{const t=[];return Array.isArray(e?.steps)||t.push("steps must be an array"),Array.isArray(e?.correctOrder)||t.push("correctOrder must be an array"),t},"graph-identify":e=>{const t=[];return Array.isArray(e?.targets)||t.push("targets must be an array"),Array.isArray(e?.correctTargets)||t.push("correctTargets must be an array"),t},"transformation-builder":e=>{const t=[];return Array.isArray(e?.operations)||t.push("operations must be an array"),Array.isArray(e?.correctOperations)||t.push("correctOperations must be an array"),t}},kt=e=>{const t=[];return Me(e?.pages).forEach((o,r)=>{const s=o?.id??`page-${r+1}`,c=o?.type;if(!c){t.push(`[${s}] missing type`);return}if(!Re(c)){t.push(`[${s}] unknown type: ${c}`);return}const i=$t[c];i&&i(o).forEach(l=>t.push(`[${s}] ${l}`))}),t},he=e=>e!==null&&typeof e=="object"&&!Array.isArray(e),wt=e=>{const t=[];if(!he(e))return["config must be an object"];const n=e?.original?.points,o=e?.series;!Array.isArray(n)&&!Array.isArray(o)&&t.push("missing original.points or series array");const r=e?.grid??e?.view;return he(r)?["xmin","xmax","ymin","ymax"].forEach(s=>{r[s]===void 0&&t.push(`grid/view missing ${s}`)}):t.push("missing grid/view settings"),he(e?.interaction)||t.push("missing interaction settings"),t};function At(){return new URLSearchParams(window.location.search).get("src")}async function Pt(){const t=At()||"/engine/config/golden.json",n=await fetch(t);if(!n.ok)throw new Error(`Could not load config (${n.status}) from ${t}`);const o=await n.json(),r=Qe(o);if(Array.isArray(r?.pages)){const s=kt(r);if(s.length>0)throw new Error(`Invalid pages config:
- ${s.join(`
- `)}`)}else{const s=wt(r);if(s.length>0)throw new Error(`Invalid legacy config:
- ${s.join(`
- `)}`)}return{config:r,src:t}}const Et="functionPlot";function Tt(e){if(!e||typeof e!="string")return null;try{const t=new Function("x",`with(Math){ return (${e}); }`);return t(0),t}catch(t){return console.error("Failed to compile function expression:",e,t),null}}function Ct(e,t){const n=e?.activity?.config??{},o=n.function??n.expr??n.f??null,r=n.domain??[e?.grid?.xmin??-10,e?.grid?.xmax??10],s=Number(n.sampleStep??.5)||.5,c=Number(n.tolerance??.5)||.5,a=Tt(o),i=[];if(a)for(let l=r[0];l<=r[1];l=+(l+s).toFixed(10))try{const p=Number(a(l));Number.isFinite(p)&&i.push([+l,p])}catch{}return{expectedPoints:i,studentPoints:[],evaluate:a,tolerance:c}}function Lt(){return null}const Nt=Object.freeze(Object.defineProperty({__proto__:null,activityType:Et,createActivityState:Ct,getInteractionHandlers:Lt},Symbol.toStringTag,{value:"Module"})),It="intersection";function Ie(e){if(!e||typeof e!="string")return null;try{const t=new Function("x",`with(Math){ return (${e}); }`);return t(0),t}catch(t){return console.error("Failed to compile expression:",e,t),null}}function Ot(e,t){const n=e?.activity?.config??{},o=n.functionA??n.fA??n.a??null,r=n.functionB??n.fB??n.b??null,s=n.domain??[e?.grid?.xmin??-10,e?.grid?.xmax??10],c=Number(n.sampleStep??.5)||.5,a=Number(n.tolerance??.5)||.5,i=Ie(o),l=Ie(r),p=[];if(i&&l){let f=s[0],y;try{y=Number(i(f))-Number(l(f))}catch{y=NaN}for(let h=s[0]+c;h<=s[1];h=+(h+c).toFixed(10)){let b;try{b=Number(i(h))-Number(l(h))}catch{b=NaN}if(Number.isFinite(y)&&Number.isFinite(b)&&y===0)p.push([f,Number(i(f))]);else if(Number.isFinite(y)&&Number.isFinite(b)&&y*b<0){const g=Math.abs(y)/(Math.abs(y)+Math.abs(b)),k=f+(h-f)*(1-g),x=Number(i(k));p.push([+k,x])}f=h,y=b}}return{expectedPoints:p,studentPoints:[],evaluateA:i,evaluateB:l,tolerance:a}}function Ft(){return null}const Bt=Object.freeze(Object.defineProperty({__proto__:null,activityType:It,createActivityState:Ot,getInteractionHandlers:Ft},Symbol.toStringTag,{value:"Module"})),Rt="extrema";function Mt(e){if(!e||typeof e!="string")return null;try{const t=new Function("x",`with(Math){ return (${e}); }`);return t(0),t}catch(t){return console.error("Failed to compile expression:",e,t),null}}function _t(e,t){const n=e?.activity?.config??{},o=n.function??n.expr??n.f??null,r=n.domain??[e?.grid?.xmin??-10,e?.grid?.xmax??10],s=Number(n.sampleStep??.5)||.5,c=Number(n.tolerance??.5)||.5,a=Mt(o),i=[];if(a){const l=[];for(let p=r[0];p<=r[1];p=+(p+s).toFixed(10))try{const f=Number(a(p));Number.isFinite(f)&&l.push([+p,f])}catch{}for(let p=1;p<l.length-1;p++){const f=l[p-1][1],y=l[p][1],h=l[p+1][1];y>f&&y>h&&i.push(l[p]),y<f&&y<h&&i.push(l[p])}}return{expectedPoints:i,studentPoints:[],evaluate:a,tolerance:c}}function qt(){return null}const Ht=Object.freeze(Object.defineProperty({__proto__:null,activityType:Rt,createActivityState:_t,getInteractionHandlers:qt},Symbol.toStringTag,{value:"Module"})),jt="rationalPlot";function Dt(e){if(!e||typeof e!="string")return null;try{const t=new Function("x",`with(Math){ return (${e}); }`);return t(0),t}catch(t){return console.error("Failed to compile expression:",e,t),null}}function Gt(e,t){const n=e?.activity?.config??{},o=n.function??n.expr??n.f??null,r=n.domain??[e?.grid?.xmin??-10,e?.grid?.xmax??10],s=Number(n.sampleStep??.5)||.5,c=Number(n.tolerance??.5)||.5,a=Dt(o),i=[];if(a)for(let l=r[0];l<=r[1];l=+(l+s).toFixed(10))try{const p=Number(a(l));Number.isFinite(p)&&i.push([+l,p])}catch{}return{expectedPoints:i,studentPoints:[],evaluate:a,tolerance:c}}function Wt(){return null}const Vt=Object.freeze(Object.defineProperty({__proto__:null,activityType:jt,createActivityState:Gt,getInteractionHandlers:Wt},Symbol.toStringTag,{value:"Module"})),_e=new Map;function pe(e){!e||!e.activityType||_e.set(e.activityType,e)}function zt(e){return _e.get(e)}pe(Nt);pe(Bt);pe(Ht);pe(Vt);function Ut(e,t){if(!Array.isArray(e))return[];if(!t||!t.type)return e;const n=()=>{const r=t.pivot;return Array.isArray(r)&&r.length===2?[r[0],r[1]]:[0,0]},o=([r,s],c)=>{const a=(c%360+360)%360;return a===0?[r,s]:a===90?[-s,r]:a===180?[-r,-s]:a===270?[s,-r]:[r,s]};if(t.type==="reflect_x")return e.map(([r,s])=>[r,-s]);if(t.type==="reflect_y")return e.map(([r,s])=>[-r,s]);if(t.type==="translate"){const r=Number(t.dx??0),s=Number(t.dy??0);return e.map(([c,a])=>[c+r,a+s])}if(t.type==="rotate"){const r=Number(t.angle??0),[s,c]=n();return e.map(([a,i])=>{const l=a-s,p=i-c,[f,y]=o([l,p],r);return[f+s,y+c]})}if(t.type==="dilate"){const r=Number(t.k??1),[s,c]=n();return e.map(([a,i])=>[s+r*(a-s),c+r*(i-c)])}return e}const Yt=1;function Xt(e){const t=Number(e);return Number.isFinite(t)&&t>0?t:Yt}function Kt({config:e,src:t}){const n=e?.interaction??{},o=e?.feedback??{},r={...e,interaction:{...n,snapStep:Xt(n.snapStep),hitRadiusPx:n.hitRadiusPx??20},feedback:{showExpectedPointsOnFail:o.showExpectedPointsOnFail??!1,showSolutionOnFail:o.showSolutionOnFail??!1,allowHints:o.allowHints??!1}},s=r?.original?.points??[],c=r.activityType??r.activity?.type??"transformations",a=zt(c),i={config:r,src:t,pageState:{},currentPageIndex:0,expectedPoints:[],studentPoints:[],orderedStudentPoints:[],activityState:{},activityHandlers:null,currentStep:1,part2Answer:{x:null,y:null},part2SelectedToken:null,part2Submitted:!1,part2Correct:null,part2ShowSolution:!1,part2Feedback:"",part3Answers:[],part3Answer:{p1:null,p2:null,coordType:null,value:null},part3SelectedToken:null,part3History:[],part3Submitted:!1,part3Correct:null,part3ShowSolution:!1,part3Feedback:"",persistedGraphPoints:null,persistedReferenceGraph:null,slideExplanationOpen:{},showSolution:!1,lastSubmitCorrect:null,feedback:"",submitted:!1,view:{xmin:r.grid.xmin,xmax:r.grid.xmax,ymin:r.grid.ymin,ymax:r.grid.ymax}};if(a&&typeof a.createActivityState=="function")try{const l=a.createActivityState(r,t);l&&typeof l=="object"&&(i.activityState=l,Array.isArray(l.expectedPoints)&&(i.expectedPoints=l.expectedPoints),Array.isArray(l.studentPoints)&&(i.studentPoints=l.studentPoints))}catch(l){console.error("activity.createActivityState failed:",l)}if((!Array.isArray(i.expectedPoints)||i.expectedPoints.length===0)&&(i.expectedPoints=Ut(s,r?.transform)),a&&typeof a.getInteractionHandlers=="function")try{i.activityHandlers=a.getInteractionHandlers()}catch(l){console.error("activity.getInteractionHandlers failed:",l)}return i.undo=function(){i.studentPoints.pop(),i.orderedStudentPoints=Fe(i.expectedPoints,i.studentPoints),i.feedback=""},i.zoomIn=function(){const l=i.view.xmax-i.view.xmin,p=i.view.ymax-i.view.ymin,f=(i.view.xmin+i.view.xmax)/2,y=(i.view.ymin+i.view.ymax)/2;i.view.xmin=f-l*.8/2,i.view.xmax=f+l*.8/2,i.view.ymin=y-p*.8/2,i.view.ymax=y+p*.8/2},i.zoomOut=function(){const l=i.view.xmax-i.view.xmin,p=i.view.ymax-i.view.ymin,f=(i.view.xmin+i.view.xmax)/2,y=(i.view.ymin+i.view.ymax)/2;i.view.xmin=f-l*1.2/2,i.view.xmax=f+l*1.2/2,i.view.ymin=y-p*1.2/2,i.view.ymax=y+p*1.2/2},i.enableSolution=function(){i.showSolution=!0},i.clearSolution=function(){i.showSolution=!1},i.reset=function(){i.studentPoints=[],i.orderedStudentPoints=[],i.feedback="",i.showSolution=!1,i.lastSubmitCorrect=null,i.submitted=!1},i}const Qt=(e,t,n)=>(e.pageState||(e.pageState={}),e.pageState[t]||(e.pageState[t]=n?n():{}),e.pageState[t]),Jt=({page:e,index:t,total:n})=>Oe({page:e,index:t,total:n,bodyHtml:`<div class="page-unknown">Unknown page type: ${e?.type??"(missing)"}</div>`,footerHtml:""}),ue=e=>{const t=document.getElementById("app");if(!t)return;const n=Array.isArray(e.config?.pages)?e.config.pages:[],o=n.length,r=Math.max(0,Math.min(e.currentPageIndex??0,o-1)),s=n[r]??{type:"unknown"},c=Re(s.type);if(!c){t.innerHTML=Jt({page:s,index:r,total:o});return}const a=s.id??`page-${r+1}`,i=Qt(e,a,()=>c.initState?.(s)),l=`
    ${c.render({page:s,state:e,pageState:i,index:r,total:o})}
  `,p=s?.showFooter!==!1,f=p?`
    <div class="page-footer-controls">
      <button class="page-nav" data-action="prev" ${r===0?"disabled":""}>Back</button>
      <div class="page-footer-actions">
        <button class="page-reset" data-action="reset">Try Again</button>
        <button class="page-submit" data-action="submit">Submit</button>
        <button class="page-nav" data-action="next" ${r>=o-1?"disabled":""}>Next</button>
      </div>
    </div>
  `:"",h=`
    <div class="slide-scale-root">
      <div class="slide-scale-inner">
        <div class="slide-viewport">
          <div class="slide-safe-area">
            ${Oe({page:s,index:r,total:o,bodyHtml:l,footerHtml:f})}
          </div>
        </div>
      </div>
    </div>
  `;t.innerHTML=h,window.dispatchEvent(new Event("applet:rendered"));const b=t.querySelector(".page-shell");c.bind?.({root:b,state:e,pageState:i,page:s,index:r,total:o});const g=k=>{const x=k==="next"?r+1:r-1;e.currentPageIndex=Math.max(0,Math.min(x,o-1)),ue(e)};p&&(b?.querySelector("[data-action='prev']")?.addEventListener("click",()=>g("prev")),b?.querySelector("[data-action='next']")?.addEventListener("click",()=>g("next")),b?.querySelector("[data-action='submit']")?.addEventListener("click",()=>{c.submit?.({root:b,state:e,pageState:i,page:s,index:r,total:o})?.rerender&&ue(e)}),b?.querySelector("[data-action='reset']")?.addEventListener("click",()=>{c.reset?.({root:b,state:e,pageState:i,page:s,index:r,total:o})?.rerender&&ue(e)}))};async function Zt(){try{const{config:e,src:t}=await Pt(),n=new URLSearchParams(window.location.search),o=n.get("mode"),r=n.get("embed"),s=r==="1"||r==="true",c=r==="0"||r==="false",a=n.get("legacy")==="1"||o==="legacy",i=e?.ui?.mode??e?.mode,l=e?.ui?.publishMode===!0,p=o==="slide"||e?.slideMode===!0||i==="slide";let f=!1;try{f=window.self!==window.top}catch{f=!0}const y=!c&&(l||s||p||f);p&&(document.documentElement.classList.add("slide-mode"),document.body.classList.add("slide-mode")),l&&(document.documentElement.classList.add("publish-mode"),document.body.classList.add("publish-mode")),y&&(document.documentElement.classList.add("embed-mode"),document.body.classList.add("embed-mode"),document.querySelector(".wrap")?.classList.add("embed-viewport"));const h=document.getElementById("app"),b=e?.ui?.layout??{},g={ppt1080p:{slideWidth:"1280px",slideHeight:"720px",safePadding:"24px",contentWidth:"1200px",contentPadding:"24px",graphSize:"520px"},ppt720p:{slideWidth:"960px",slideHeight:"540px",safePadding:"18px",contentWidth:"900px",contentPadding:"18px",graphSize:"480px"},ppt4x3:{slideWidth:"1024px",slideHeight:"768px",safePadding:"20px",contentWidth:"960px",contentPadding:"20px",graphSize:"520px"}},k=b.preset,x=k&&g[k]?g[k]:null,S=x?{...x,...b}:b;h&&(h.dataset.publishMode=l?"1":"0",h.dataset.embedMode=y?"1":"0"),y&&(S.overflowPolicy="clamp"),h&&S&&(S.slideWidth&&h.style.setProperty("--slide-width",String(S.slideWidth)),S.slideHeight&&h.style.setProperty("--slide-height",String(S.slideHeight)),S.safePadding&&h.style.setProperty("--safe-padding",String(S.safePadding)),S.contentWidth&&h.style.setProperty("--content-width",String(S.contentWidth)),S.contentPadding&&h.style.setProperty("--content-padding",String(S.contentPadding)),S.graphSize&&h.style.setProperty("--graph-size",String(S.graphSize)),S.overflowPolicy&&(h.dataset.overflowPolicy=String(S.overflowPolicy)));const I=Kt({config:e,src:t});I.uiMode=p?"slide":"browser";const P=(w,T)=>{const L=Number.parseFloat(String(w).trim());return Number.isFinite(L)?L:T},B=(w,T)=>{if(!w)return;w.querySelectorAll(".page-body, .activity-copy > section, .explanation-box").forEach(O=>{O.classList.add("collapsible-section"),T?O.classList.add("collapsed"):O.classList.remove("collapsed");let $=null;const R=O.nextElementSibling;R&&R.classList.contains("collapse-toggle")&&($=R),$||($=document.createElement("button"),$.type="button",$.className="collapse-toggle",$.addEventListener("click",()=>{const K=O.classList.toggle("collapsed");$.textContent=K?"Show more":"Show less"}),O.insertAdjacentElement("afterend",$)),$.textContent=O.classList.contains("collapsed")?"Show more":"Show less",$.style.display=T?"inline-flex":"none"})},C=()=>{const w=document.getElementById("app");if(!w)return;const T=w.querySelector(".slide-scale-inner");if(!T)return;const L=getComputedStyle(w),O=P(L.getPropertyValue("--slide-width"),1280),$=P(L.getPropertyValue("--slide-height"),720),R=w.clientWidth||window.innerWidth,K=w.clientHeight||window.innerHeight,te=Math.min(R/O,K/$,1);T.style.setProperty("--slide-scale",String(te));const G=w.querySelector(".slide-safe-area");if(G){const Q=G.scrollHeight>G.clientHeight||G.scrollWidth>G.clientWidth;G.classList.toggle("overflow-warning",Q);const V=w.dataset.overflowPolicy;G.classList.toggle("overflow-clamp",V==="clamp"),B(G,V==="collapse"&&Q)}},D=Array.isArray(e?.pages)&&e.pages.length>0&&!a;D?ue(I):E(I),C(),window.addEventListener("resize",C),window.addEventListener("applet:rendered",()=>{requestAnimationFrame(C)}),D||Be(I,()=>{E(I)})}catch(e){console.error(e);const t=document.getElementById("app");t&&(t.innerHTML=`<pre style="color:red;">${e.message}</pre>`)}}Zt();
