(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();const ze="0",Z={xmin:-10,xmax:10,ymin:-10,ymax:10},ce={title:"",subtitle:"",instructions:"",legend:[]},pe={mode:"placePoints",snapStep:1,hitRadiusPx:12};function Ye(e={}){const t=`${e?.schemaVersion??ze}`;return t==="1"?Xe(e):{...e,schemaVersion:t}}function Xe(e){const t=Ke(e),n=Qe(e),o=Je(e),r=tt(e),s=rt(e),a=Ze(e,n),c=s.type??e.activityType??"transformations",i=nt(e,r),u=e.transform??s.transform;return{...e,schemaVersion:"1",view:t,ui:n,interaction:o,series:r,activity:s,grid:t,title:n.title,subtitle:n.subtitle,instructions:n.instructions,legend:n.legend,original:i,transform:u,activityType:c,...a?{pages:a}:{}}}function Ke(e){const t=e.view??e.grid??Z;return{xmin:X(t.xmin,Z.xmin),xmax:X(t.xmax,Z.xmax),ymin:X(t.ymin,Z.ymin),ymax:X(t.ymax,Z.ymax)}}function Qe(e){const t=me(e.ui)?e.ui:{};return{title:t.title??e.title??ce.title,subtitle:t.subtitle??e.subtitle??ce.subtitle,instructions:t.instructions??e.instructions??ce.instructions,legend:t.legend??e.legend??ce.legend}}function Je(e){const t=me(e.interaction)?e.interaction:{};return{mode:t.mode??pe.mode,snapStep:X(t.snapStep,pe.snapStep),hitRadiusPx:X(t.hitRadiusPx,pe.hitRadiusPx)}}function Ze(e,t){if(Array.isArray(e.pages))return e.pages;if(!et(e))return null;const n=t?.instructions??e.instructions??"";return[{id:"p1",type:"graph-plot",title:t?.title??e.title??"Graph Task",prompt:n}]}function et(e){const t=e.usePages??e.pageMode,n=e.ui?.usePages??e.ui?.pageMode,o=t??n;return o===!0?!0:typeof o=="string"?o==="template"||o==="pages":!1}function tt(e){return Array.isArray(e.series)?e.series:e.original?.points?[{id:"original",role:"original",points:e.original.points}]:[]}function rt(e){const t=me(e.activity)?e.activity:{},n=t.type??e.activityType??"transformations";return{...t,type:n}}function nt(e,t){if(e.original?.points)return e.original;const n=st(t),o=ot(n);return Array.isArray(o)?{points:o}:{points:[]}}function st(e){if(!Array.isArray(e))return null;const t=["original","reference","base"];for(const n of t){const o=e.find(r=>r?.role===n||r?.id===n);if(o)return o}return e[0]??null}function ot(e){return e?Array.isArray(e.points)?e.points:Array.isArray(e.geometry?.points)?e.geometry.points:Array.isArray(e.data?.points)?e.data.points:null:null}function X(e,t){const n=Number(e);return Number.isFinite(n)?n:t}function me(e){return e!==null&&typeof e=="object"&&!Array.isArray(e)}const F={GRAPH_PLOT:"graph-plot",DRAG_DROP_FILL:"drag-drop-fill",MULTIPLE_CHOICE:"multiple-choice",SORT_ORDER:"sort-order",MATCH_PAIRS:"match-pairs",NUMERIC_INPUT:"numeric-input",TABLE_COMPLETE:"table-complete",TRUE_FALSE_GRID:"true-false-grid",PROOF_STEPS:"proof-steps",GRAPH_IDENTIFY:"graph-identify",TRANSFORMATION_BUILDER:"transformation-builder"},it=(e,t)=>e?.id??`page-${t+1}`,Le=({page:e,index:t,total:n,bodyHtml:o,footerHtml:r})=>{const s=it(e,t),a=e?.title??`Page ${t+1}`,c=e?.subtitle??"",i=n>0?`Page ${t+1} of ${n}`:"",u=e?.showProgress!==!1,y=e?.showTitle!==!1;return`
    <section class="page-shell" data-page-id="${s}">
      <header class="page-header">
        ${u?`<div class="page-progress">${i}</div>`:""}
        ${y?`<h2 class="page-title">${a}</h2>`:""}
        ${y&&c?`<div class="page-subtitle">${c}</div>`:""}
      </header>
      <div class="page-body">
        ${o}
      </div>
      ${r?`<footer class="page-footer">${r}</footer>`:""}
    </section>
  `},H=e=>e?.prompt?`<div class="page-prompt">${e.prompt}</div>`:"",at=e=>!e||e.length===0?"":`<ul class="page-placeholder-list">${e.map(n=>`<li>${n}</li>`).join("")}</ul>`,Ce={};function ct(e,t){typeof e!="string"||typeof t!="function"||(Ce[e]=t)}function lt(e,t,n){const o=e&&Ce[e];return o?o(t,n):{isCorrect:!1,details:{message:"No validator registered."}}}function dt(e,t,n,o={}){const{xmin:r,xmax:s,ymin:a,ymax:c}=t,{width:i,height:u}=n,y=i/(s-r),m=u/(c-a),v=x=>(x-r)*y,g=x=>u-(x-a)*m,P=g(0),$=v(0);let w="";for(let x=Math.ceil(r);x<=Math.floor(s);x++){const h=v(x);w+=`<line x1="${h}" y1="0" x2="${h}" y2="${u}" stroke="${x===0?"#000":"#f2f2f2"}"/>`,x!==0&&(w+=`<text x="${h}" y="${P+15}" font-size="12" font-family="sans-serif" text-anchor="middle" fill="#666">${x}</text>`)}for(let x=Math.ceil(a);x<=Math.floor(c);x++){const h=g(x);w+=`<line x1="0" y1="${h}" x2="${i}" y2="${h}" stroke="${x===0?"#000":"#f2f2f2"}"/>`,x!==0&&(w+=`<text x="${$-5}" y="${h+4}" font-size="12" font-family="sans-serif" text-anchor="end" fill="#666">${x}</text>`)}return e+w}function ut(e,t,n,o){const{xmin:r,xmax:s,ymin:a,ymax:c}=n,{width:i,height:u}=o,y=i/(s-r),m=u/(c-a),v=$=>($-r)*y,g=$=>u-($-a)*m;let P="";for(const $ of t){const w=$.style||{},x=$.label;if($.type==="points"){const h=w.r??5,O=w.fill??"black";for(const A of $.points)P+=`<circle cx="${v(A.x)}" cy="${g(A.y)}" r="${h}" fill="${O}" />`;if(x&&$.points.length>0){const A=$.points[$.points.length-1];P+=`<text x="${v(A.x)+8}" y="${g(A.y)}" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="${O}">${x}</text>`}}else if($.type==="polyline"){const h=w.stroke??"black",O=w.strokeWidth??2,A=w.fill??"none",N=w.opacity??1,L=w.dashed?"5,5":"none";if($.points.length>0){const j=Array.isArray($.segmentMask)?$.segmentMask:null;if(j){let S="",T=!1;for(let C=0;C<$.points.length-1;C++){const R=$.points[C],b=$.points[C+1];!!(j[C]&&j[C+1])?T?S+=`L ${v(b.x)} ${g(b.y)} `:(S+=`M ${v(R.x)} ${g(R.y)} `,S+=`L ${v(b.x)} ${g(b.y)} `,T=!0):T=!1}S&&(P+=`<path d="${S.trim()}" fill="${A}" stroke="${h}" stroke-width="${O}" opacity="${N}" stroke-dasharray="${L}" />`)}else{const S=$.points.map((T,C)=>(C===0?"M":"L")+v(T.x)+" "+g(T.y)).join(" ");P+=`<path d="${S}" fill="${A}" stroke="${h}" stroke-width="${O}" opacity="${N}" stroke-dasharray="${L}" />`}if(x){const S=$.points[$.points.length-1];P+=`<text x="${v(S.x)+8}" y="${g(S.y)}" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="${h}">${x}</text>`}}}}return e+P}function E(e){const t=document.getElementById("app"),n=e?._legacyRenderTarget??t,o=e?._legacyWrap!==void 0?e._legacyWrap:!0;if(!n)return;const r=e.config,s=r.original.points,a=e.expectedPoints,c=e.studentPoints??[],i=e.orderedStudentPoints??[],u=e.uiMode==="slide",y=r?.ui?.layout??{},m=Number(y.graphSize),v=Number.isFinite(m)&&m>0?m:u?520:600,g=Number.isFinite(m)&&m>0?m:u?520:600,P="<p>Notice how the y-coordinate of all points on the transformed graph g(x) are the <i>negative</i> of the y-coordinate on the f(x).</p><p>This is a <b>vertical reflection</b> about the x-axis.</p>",$=e.lastSubmitCorrect?"feedback-success":e.submitted&&e.lastSubmitCorrect===!1?"feedback-error":"";r.activity?.progressLabel;const w=!!e.slideExplanationOpen?.[e.currentStep];Array.isArray(e.persistedReferenceGraph)?e.persistedReferenceGraph:Array.isArray(e.persistedGraphPoints)&&e.persistedGraphPoints;const h=((d,l)=>d===1?null:Array.isArray(l.persistedReferenceGraph)&&l.persistedReferenceGraph.length>0?l.persistedReferenceGraph:Array.isArray(l.persistedGraphPoints)?l.persistedGraphPoints:null)(e.currentStep,e),O=e.currentStep>=2&&h&&h.length>0,A="−",N={x:"x",y:`${A}y`},L=e.part2Answer??{x:null,y:null},j=!!(L.x&&L.y),S=!!e.part2Correct,T=!!e.part2Submitted,C=T?{x:L.x===N.x,y:L.y===N.y}:{x:!1,y:!1},R=T&&!S?{x:L.x!==N.x,y:L.y!==N.y}:{x:!1,y:!1},b=d=>{if(!d)return"";if(d.startsWith(A)){const l=d.slice(A.length);return`<span class="math-minus">${A}</span><span class="math-var">${l}</span>`}return`<span class="math-var">${d}</span>`},q=d=>{if(d==null)return"";const l=String(d);return l.startsWith("-")?`<span class="math-minus">${A}</span><span class="math-num">${l.slice(1)}</span>`:l.startsWith(A)?`<span class="math-minus">${A}</span><span class="math-num">${l.slice(A.length)}</span>`:`<span class="math-num">${l}</span>`},K=d=>{const[l,p]=d;return`<span class="rule-math">(</span>${q(l)}<span class="rule-math">,</span> ${q(p)}<span class="rule-math">)</span>`},ee=[{value:"x",html:b("x"),group:"x"},{value:`${A}x`,html:b(`${A}x`),group:"x"},{value:"y",html:b("y"),group:"y"},{value:`${A}y`,html:b(`${A}y`),group:"y"}],Q=(d=>{const l=[];for(let f=0;f<d.length-1;f++){const[I,B]=d[f],[M,ae]=d[f+1];if(B===0&&l.push([I,0]),ae===0&&l.push([M,0]),B<0&&ae>0||B>0&&ae<0){const We=(0-B)/(ae-B),Ue=I+We*(M-I),Ve=Math.round(Ue*1e3)/1e3;l.push([Ve,0])}}const p=new Set;return l.filter(f=>{const I=`${f[0]},${f[1]}`;return p.has(I)?!1:(p.add(I),!0)})})(s),U=Q.map(d=>`${d[0]},${d[1]}`),k=e.part3Answer??{p1:null,p2:null,coordType:null,value:null},qe=!!(k.p1&&k.p2&&k.coordType&&k.value),te=!!e.part3Correct,J=!!e.part3Submitted,Fe=J&&te,re=e.showSolution&&e.lastSubmitCorrect===!1,de=e.lastSubmitCorrect===!0,He=re||de,ne=new Set(U),se=k.p1&&k.p2&&k.p1===k.p2,oe=J&&!te?{p1:!k.p1||!ne.has(k.p1)||se,p2:!k.p2||!ne.has(k.p2)||se,coordType:k.coordType!=="y-coordinate",value:k.value!=="0"}:{p1:!1,p2:!1,coordType:!1,value:!1},ie=J?{p1:!!(k.p1&&ne.has(k.p1)&&!se),p2:!!(k.p2&&ne.has(k.p2)&&!se),coordType:k.coordType==="y-coordinate",value:k.value==="0"}:{p1:!1,p2:!1,coordType:!1,value:!1},V=new Map,ue=d=>{const l=`${d[0]},${d[1]}`;V.has(l)||V.set(l,K(d))};Q.forEach(ue),s.forEach(ue),a.forEach(d=>ue([d[0],d[1]]));const Me=["0,-1","1,0","0,1","4,0"].filter(d=>V.has(d)).map(d=>({type:"point",value:d,html:V.get(d)})),De=[{type:"coordType",value:"x-coordinate",html:"x-coordinate"},{type:"coordType",value:"y-coordinate",html:"y-coordinate"}],_e=[{type:"value",value:"0",html:q("0")},{type:"value",value:`${A}1`,html:q(`${A}1`)}],ye=`
    <div class="explanation-box success-reveal status-success ${u?"slide-compact":""}">
      <div class="status-title">Correct — nice work!</div>
      <div class="explanation-inline">
        <span class="status-text">Notice how each y-coordinate is replaced by its opposite value.</span>
        ${u?`
          <button class="slide-explanation-toggle inline" data-step="${e.currentStep}">
            ${w?"Hide explanation":"Show explanation"}
          </button>
        `:""}
      </div>
      ${u?`
        <div class="slide-explanation-text ${w?"open":""}">
          A reflection in the x-axis keeps x-values the same and multiplies y-values by ${A}1. Points on the x-axis have y = 0, so they do not move under the reflection. Therefore, the shared points are the x-intercepts, and they have the same y-coordinate, which is 0.
        </div>
      `:`A reflection in the x-axis keeps x-values the same and multiplies y-values by ${A}1. Points on the x-axis have y = 0, so they do not move under the reflection. Therefore, the shared points are the x-intercepts, and they have the same y-coordinate, which is 0.`}
      <button id="nextPartBtn" class="next-part-btn">Finish Exploration →</button>
    </div>
  `,z=([d,l])=>({x:d,y:l}),W=[];let Y=`<svg id="graphSvg" width="${v}" height="${g}" viewBox="0 0 ${v} ${g}" xmlns="http://www.w3.org/2000/svg">`;if(Y=dt(Y,e.view,{width:v,height:g}),s.length>0){const d=s.map(z);W.push({type:"polyline",points:d,style:{stroke:"#2563eb",strokeWidth:2}}),W.push({type:"points",points:d,style:{fill:"#2563eb",r:6}})}if(!O&&c.length>1){const d=[...c].sort((l,p)=>l[0]-p[0]);W.push({type:"polyline",points:d.map(z),style:{stroke:e.submitted?e.lastSubmitCorrect?"#16a34a":"#dc2626":"#6d28d9",strokeWidth:e.submitted&&e.lastSubmitCorrect?4:3,opacity:1}})}if(!O&&c.length>0){const d=e.config.interaction?.mode||"placePoints",I=e.submitted?e.lastSubmitCorrect?"#16a34a":"#dc2626":"#6d28d9",B=e.submitted&&e.lastSubmitCorrect?4:3;d==="placePoints"?W.push({type:"points",points:c.map(z),style:{fill:I,r:6}}):c.length>1&&W.push({type:"polyline",points:c.map(z),style:{stroke:I,strokeWidth:B,opacity:.25}})}if(!O&&i.length>1){const d=new Set(i.map(f=>`${f[0]},${f[1]}`)),l=e.expectedPoints.map(z),p=e.expectedPoints.map(f=>d.has(`${f[0]},${f[1]}`));W.push({type:"polyline",points:l,segmentMask:p,style:{stroke:e.submitted?e.lastSubmitCorrect?"#16a34a":"#dc2626":"#6d28d9",strokeWidth:e.submitted&&e.lastSubmitCorrect?4:3,opacity:1}})}if(e.expectedPoints&&e.expectedPoints.length>0&&(e.submitted||O)){const d=O?h:a;if((e.showSolution||O)&&d.length>0){const l=d.map(z);W.push({type:"polyline",points:l,style:{stroke:"#16a34a",strokeWidth:5}}),W.push({type:"points",points:l,style:{fill:"#16a34a",r:6}})}}Y=ut(Y,W,e.view,{width:v,height:g}),Y+="</svg>";const je=e.currentStep===2&&T&&(S||e.part2ShowSolution)?" step-2-resolved":"",ve=`
    <div class="main-container step-${e.currentStep}${je}">
      <div class="activity-layout">
        <div class="activity-copy left-panel">
        <div class="page-heading">
          ${e.currentStep===3?"":'<div class="heading-label">Exploration 2</div>'}
          <div class="heading-title">Reflection in the <span class="nowrap">x-axis</span></div>
        </div>

        <section style="margin-bottom:18px;padding-top:8px;">
          ${e.currentStep===1?`
            ${He?"":`
              <div class="question-label">Question 1 (of 3)</div>
              <div class="task-instructions">Sketch the mirror image graph, <strong>y = g(x)</strong>, by clicking where the 5 connection points should be, and using the above controls.</div>
            `}
            ${e.feedback&&e.lastSubmitCorrect===!1&&!re?`
              <div id="feedback" class="graph-feedback ${$}">
                ${e.feedback}
              </div>
            `:""}
              ${e.lastSubmitCorrect||e.showSolution?`
                <div id="explanation" class="explanation-box ${e.lastSubmitCorrect||e.showSolution?"success-reveal":""} ${u?"slide-compact":""} ${re||de?"show-solution":""}">
                  ${e.lastSubmitCorrect?`
                    <div class="status-title">${e.feedback}</div>
                  `:""}
                  ${u?re||de?`
                    <div class="slide-explanation-text open">
                      ${P}
                    </div>
                  `:`
                    <div class="slide-explanation-text ${w?"open":""}">
                      ${P}
                    </div>
                    <button class="slide-explanation-toggle" data-step="${e.currentStep}">
                      ${w?"Hide explanation":"Show explanation"}
                    </button>
                  `:P}
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
                  <span class="rule-math">(</span>${b("x")}<span class="rule-math">,</span> ${b("y")}<span class="rule-math">)</span>
                  <span class="rule-arrow">&rarr;</span>
                  <span class="rule-math">(</span>

                  <div class="drop-stack">
                    <div class="drop-label">NEW X</div>
                    <div class="drop-zone ${L.x?"filled":""} ${C.x?"correct":""} ${R.x?"invalid shake":""}" data-slot="x" tabindex="0" role="button" aria-label="new x drop zone">
                      ${L.x?`
                        <span class="drop-value">${b(L.x)}</span>
                        <button class="drop-clear" data-slot="x" aria-label="Clear new x">&times;</button>
                      `:'<span class="drop-placeholder">drop</span>'}
                    </div>
                  </div>

                  <span class="rule-sep">,</span>

                  <div class="drop-stack">
                    <div class="drop-label">NEW Y</div>
                    <div class="drop-zone ${L.y?"filled":""} ${C.y?"correct":""} ${R.y?"invalid shake":""}" data-slot="y" tabindex="0" role="button" aria-label="new y drop zone">
                      ${L.y?`
                        <span class="drop-value">${b(L.y)}</span>
                        <button class="drop-clear" data-slot="y" aria-label="Clear new y">&times;</button>
                      `:'<span class="drop-placeholder">drop</span>'}
                    </div>
                  </div>

                  <span class="rule-math">)</span>
                </div>
              </div>

              ${T&&!S?`
                <div class="rule-hint">Check how the y-values change.</div>
              `:""}
              </div>

              ${T&&(S||e.part2ShowSolution)?"":`
              <div class="token-bank">
              <div class="token-group">
                <div class="token-label">X-values</div>
                <div class="token-row">
                  ${ee.filter(d=>d.group==="x").map(d=>`
                    <div class="drag-token ${e.part2SelectedToken===d.value?"selected":""}" data-value="${d.value}" tabindex="0" role="button" aria-pressed="${e.part2SelectedToken===d.value}" draggable="true">${d.html}</div>
                  `).join("")}
                </div>
              </div>

              <div class="token-group">
                <div class="token-label">Y-values</div>
                <div class="token-row">
                  ${ee.filter(d=>d.group==="y").map(d=>`
                    <div class="drag-token ${e.part2SelectedToken===d.value?"selected":""}" data-value="${d.value}" tabindex="0" role="button" aria-pressed="${e.part2SelectedToken===d.value}" draggable="true">${d.html}</div>
                  `).join("")}
                </div>
              </div>
            </div>
              `}
            </div>

            <div class="feedback-area">
              ${T?`
                ${S?`
                  ${e.part2ShowSolution?`
                    <div class="explanation-box success-reveal solution-explanation ${u?"slide-compact":""}">
                      The mapping rule is <span class="rule-math">(</span>${b("x")}<span class="rule-math">,</span> ${b("y")}<span class="rule-math">) &rarr; (</span>${b("x")}<span class="rule-math">,</span> ${b(`${A}y`)}<span class="rule-math">)</span>.
                      <button id="nextPartBtn" class="next-part-btn">Continue to Part 3 →</button>
                    </div>
                  `:`
                    <div class="status-card success-reveal status-success ${u?"slide-compact":""}">
                      <div class="status-title">Correct — nice work!</div>
                      <div class="status-text">Notice how each y-coordinate is replaced by its opposite value.</div>
                      <button id="nextPartBtn" class="next-part-btn">Continue to Part 3 →</button>
                    </div>
                  `}
                `:`
                  <div class="status-card success-reveal status-error ${u?"slide-compact":""}">
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
                  <div class="drop-zone point-slot ${k.p1?"filled":""} ${ie.p1?"correct":""} ${oe.p1?"invalid shake":""}" data-slot="p1" data-accept="point" tabindex="0" role="button" aria-label="first point drop zone">
                    ${k.p1?`
                      <span class="drop-value">${V.get(k.p1)??""}</span>
                      <button class="drop-clear" data-slot="p1" aria-label="Clear first point">&times;</button>
                    `:'<span class="drop-placeholder">drop</span>'}
                  </div>
                  <span class="rule-sep">and</span>
                  <div class="drop-zone point-slot ${k.p2?"filled":""} ${ie.p2?"correct":""} ${oe.p2?"invalid shake":""}" data-slot="p2" data-accept="point" tabindex="0" role="button" aria-label="second point drop zone">
                    ${k.p2?`
                      <span class="drop-value">${V.get(k.p2)??""}</span>
                      <button class="drop-clear" data-slot="p2" aria-label="Clear second point">&times;</button>
                    `:'<span class="drop-placeholder">drop</span>'}
                  </div>
                  <span class="rule-math">.</span>
                </div>
              </div>

              <div class="mapping-line">
                <span class="rule-prefix">They have the same</span>
                <div class="math-expression">
                  <div class="drop-zone coord-slot ${k.coordType?"filled":""} ${ie.coordType?"correct":""} ${oe.coordType?"invalid shake":""}" data-slot="coordType" data-accept="coordType" tabindex="0" role="button" aria-label="coordinate type drop zone">
                    ${k.coordType?`
                      <span class="drop-value">${k.coordType}</span>
                      <button class="drop-clear" data-slot="coordType" aria-label="Clear coordinate type">&times;</button>
                    `:'<span class="drop-placeholder">drop</span>'}
                  </div>
                  <span class="rule-sep">,</span>
                  <span class="rule-prefix">which is</span>
                  <div class="drop-zone value-slot ${k.value?"filled":""} ${ie.value?"correct":""} ${oe.value?"invalid shake":""}" data-slot="value" data-accept="value" tabindex="0" role="button" aria-label="value drop zone">
                    ${k.value?`
                      <span class="drop-value">${q(k.value)}</span>
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
                        ${Me.map(d=>`
                          <div class="drag-token ${e.part3SelectedToken?.value===d.value?"selected":""}" data-type="${d.type}" data-value="${d.value}" tabindex="0" role="button" aria-pressed="${e.part3SelectedToken?.value===d.value}" draggable="true">${d.html}</div>
                        `).join("")}
                      </div>
                    </div>

                    <div class="token-group">
                      <div class="token-label">Type:</div>
                      <div class="token-row">
                        ${De.map(d=>`
                          <div class="drag-token ${e.part3SelectedToken?.value===d.value?"selected":""}" data-type="${d.type}" data-value="${d.value}" tabindex="0" role="button" aria-pressed="${e.part3SelectedToken?.value===d.value}" draggable="true">${d.html}</div>
                        `).join("")}
                      </div>
                    </div>

                    <div class="token-group">
                      <div class="token-label">Value:</div>
                      <div class="token-row">
                        ${_e.map(d=>`
                          <div class="drag-token ${e.part3SelectedToken?.value===d.value?"selected":""}" data-type="${d.type}" data-value="${d.value}" tabindex="0" role="button" aria-pressed="${e.part3SelectedToken?.value===d.value}" draggable="true">${d.html}</div>
                        `).join("")}
                      </div>
                    </div>
                  </div>
                </div>

            <div class="feedback-area">
              ${J?`
              ${te?`
                ${u?"":ye}
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
            <button id="submitBtn" class="submit-btn" ${e.currentStep===2&&!j||e.currentStep===3&&!qe?"disabled":""}>Submit</button>
            ${e.currentStep===1&&!e.showSolution&&e.lastSubmitCorrect===!1||e.currentStep===2&&T&&!S||e.currentStep===3&&J&&!te?'<button id="solutionBtn">See Solution</button><button id="tryAgainBtn" style="margin-left:6px;">Try Again</button>':""}
          </div>
        </div>

        <div class="graph-frame">
          ${Y}
          <div class="graph-label">y = f(x)</div>
          ${e.showSolution||e.lastSubmitCorrect||O?'<div class="solution-label">y = g(x)</div>':""}
        </div>

        ${u&&e.currentStep===3&&Fe?`
          <div class="graph-completion slide-q3-completion">
            ${ye}
          </div>
        `:""}

        </div>
      </div>
    </div>
  `,Ge=o?`
      <div class="slide-scale-root">
        <div class="slide-scale-inner">
          <div class="slide-viewport">
            <div class="slide-safe-area">
              ${ve}
            </div>
          </div>
        </div>
      </div>
    `:ve;if(n.innerHTML=Ge,window.dispatchEvent(new Event("applet:rendered")),document.getElementById("undoBtn")?.addEventListener("click",()=>{if(e.currentStep===2)e.part2Answer?.y?e.part2Answer={...e.part2Answer,y:null}:e.part2Answer?.x&&(e.part2Answer={...e.part2Answer,x:null}),e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",E(e);else if(e.currentStep===3){const d=e.part3History.pop();d&&(e.part3Answer=d),e.part3SelectedToken=null,e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",E(e)}else e.undo(),E(e)}),document.getElementById("resetBtn")?.addEventListener("click",()=>{e.currentStep===2?(e.part2Answer={x:null,y:null},e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",E(e)):e.currentStep===3?(e.part3Answer={p1:null,p2:null,coordType:null,value:null},e.part3SelectedToken=null,e.part3History=[],e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",E(e)):(e.reset(),E(e))}),document.getElementById("tryAgainBtn")?.addEventListener("click",()=>{e.currentStep===2?(e.part2Answer={x:null,y:null},e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",E(e)):e.currentStep===3?(e.part3Answer={p1:null,p2:null,coordType:null,value:null},e.part3SelectedToken=null,e.part3History=[],e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",E(e)):(e.reset(),E(e))}),document.getElementById("submitBtn")?.addEventListener("click",()=>{if(e.currentStep===2){if(!e.part2Answer?.x||!e.part2Answer?.y)return;const p=e.part2Answer?.x==="x"&&e.part2Answer?.y==="−y";e.part2Submitted=!0,e.part2Correct=p,e.part2ShowSolution=!1,e.part2Feedback=p?"Correct — nice work!":'Not Correct — try again or click "See Solution".',E(e),e.currentStep!==2&&setTimeout(()=>{const f=document.querySelector(p?"#nextPartBtn":".status-card");f&&f.scrollIntoView({behavior:"smooth",block:"center"})},0);return}if(e.currentStep===3){if(!e.part3Answer?.p1||!e.part3Answer?.p2||!e.part3Answer?.coordType||!e.part3Answer?.value)return;const p=new Set(U),f=p.has(e.part3Answer.p1)&&p.has(e.part3Answer.p2)&&e.part3Answer.p1!==e.part3Answer.p2&&e.part3Answer.coordType==="y-coordinate"&&e.part3Answer.value==="0";e.part3Submitted=!0,e.part3Correct=f,e.part3ShowSolution=!1,e.part3Feedback=f?"Correct — nice work!":'Not Correct — try again or click "See Solution".',E(e),setTimeout(()=>{const I=document.querySelector(f?"#nextPartBtn":".status-card");I&&I.scrollIntoView({behavior:"smooth",block:"center"})},0);return}const d=e.config?.activityType??"transformations",l=lt(d,e,e.config);if(e.submitted=!0,e.lastSubmitCorrect=!!l?.isCorrect,e.lastSubmitCorrect){e.feedback="CORRECT - Your graph is bang on!";const p=a.map(f=>[f[0],f[1]]);e.persistedGraphPoints=p,e.persistedReferenceGraph=p.map(f=>[f[0],f[1]])}else e.feedback='<strong>Not Correct</strong> - Click "Try Again" or "See Solution".';e.lastSubmitCorrect||(e.showSolution=r.feedback.showExpectedPointsOnFail),E(e),e.lastSubmitCorrect?setTimeout(()=>{const p=document.getElementById("nextPartBtn");p&&p.scrollIntoView({behavior:"smooth",block:"center"})},0):e.currentStep!==1&&setTimeout(()=>{const p=document.getElementById("feedback");p&&p.scrollIntoView({behavior:"smooth",block:"center"})},0)}),document.getElementById("solutionBtn")?.addEventListener("click",()=>{if(e.currentStep===2){e.part2Answer={x:"x",y:"−y"},e.part2Submitted=!0,e.part2Correct=!0,e.part2ShowSolution=!0,e.part2Feedback="Correct — nice work!",E(e);return}if(e.currentStep===3){e.part3Answer={p1:U[0]??null,p2:U[1]??null,coordType:"y-coordinate",value:"0"},e.part3History=[],e.part3Submitted=!0,e.part3Correct=!0,e.part3ShowSolution=!0,e.part3Feedback="Correct — nice work!",E(e);return}e.enableSolution(),E(e),e.currentStep!==1&&setTimeout(()=>{const d=document.getElementById("nextPartBtn");d&&d.scrollIntoView({behavior:"smooth",block:"center"})},0)}),document.getElementById("nextPartBtn")?.addEventListener("click",()=>{if(e.currentStep===1){if(!e.persistedReferenceGraph){const d=a.map(l=>[l[0],l[1]]);e.persistedGraphPoints=d,e.persistedReferenceGraph=d.map(l=>[l[0],l[1]])}e.currentStep=2,e.studentPoints=[],e.orderedStudentPoints=[],e.submitted=!1,e.lastSubmitCorrect=null,e.feedback="",e.showSolution=!1,e.part2Answer={x:null,y:null},e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",e.slideExplanationOpen={...e.slideExplanationOpen,2:!1},E(e);return}if(e.currentStep===2){e.currentStep=3,e.part3Answer={p1:null,p2:null,coordType:null,value:null},e.part3SelectedToken=null,e.part3History=[],e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",e.slideExplanationOpen={...e.slideExplanationOpen,3:!1},E(e);return}e.currentStep===3&&(e.currentStep=4,e.slideExplanationOpen={...e.slideExplanationOpen,4:!1},E(e))}),document.querySelectorAll(".slide-explanation-toggle").forEach(d=>{d.addEventListener("click",()=>{const l=Number(d.dataset.step);e.slideExplanationOpen={...e.slideExplanationOpen,[l]:!e.slideExplanationOpen?.[l]},E(e)})}),e.currentStep===2){const d=(l,p)=>{e.part2Answer={...e.part2Answer,[l]:p},e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",E(e)};document.querySelectorAll(".drag-token").forEach(l=>{l.addEventListener("dragstart",p=>{l.classList.add("dragging"),p.dataTransfer?.setData("text/plain",l.dataset.value||"")}),l.addEventListener("dragend",()=>{l.classList.remove("dragging")}),l.addEventListener("click",()=>{e.part2SelectedToken=l.dataset.value||null,E(e)}),l.addEventListener("keydown",p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),e.part2SelectedToken=l.dataset.value||null,E(e))})}),document.querySelectorAll(".drop-zone").forEach(l=>{l.addEventListener("dragover",p=>{p.preventDefault(),l.classList.add("drag-over")}),l.addEventListener("dragleave",()=>{l.classList.remove("drag-over")}),l.addEventListener("drop",p=>{p.preventDefault(),l.classList.remove("drag-over");const f=p.dataTransfer?.getData("text/plain");f&&(d(l.dataset.slot,f),setTimeout(()=>{const I=document.querySelector(`.drop-zone[data-slot="${l.dataset.slot}"]`);I&&(I.classList.add("drop-success"),setTimeout(()=>I.classList.remove("drop-success"),180))},0))}),l.addEventListener("click",()=>{e.part2SelectedToken&&(d(l.dataset.slot,e.part2SelectedToken),setTimeout(()=>{const p=document.querySelector(`.drop-zone[data-slot="${l.dataset.slot}"]`);p&&(p.classList.add("drop-success"),setTimeout(()=>p.classList.remove("drop-success"),180))},0))}),l.addEventListener("keydown",p=>{(p.key==="Enter"||p.key===" ")&&e.part2SelectedToken&&(p.preventDefault(),d(l.dataset.slot,e.part2SelectedToken),setTimeout(()=>{const f=document.querySelector(`.drop-zone[data-slot="${l.dataset.slot}"]`);f&&(f.classList.add("drop-success"),setTimeout(()=>f.classList.remove("drop-success"),180))},0))})}),document.querySelectorAll(".drop-clear").forEach(l=>{l.addEventListener("click",p=>{p.stopPropagation();const f=l.dataset.slot;f&&d(f,null)})})}if(e.currentStep===3){const d=(l,p)=>{e.part3History.push({...e.part3Answer}),e.part3Answer={...e.part3Answer,[l]:p},e.part3SelectedToken=null,e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",E(e)};document.querySelectorAll(".drag-token").forEach(l=>{l.addEventListener("dragstart",p=>{l.classList.add("dragging"),p.dataTransfer?.setData("text/plain",l.dataset.value||""),p.dataTransfer?.setData("text/type",l.dataset.type||"")}),l.addEventListener("dragend",()=>{l.classList.remove("dragging")}),l.addEventListener("click",()=>{e.part3SelectedToken={type:l.dataset.type,value:l.dataset.value},E(e)}),l.addEventListener("keydown",p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),e.part3SelectedToken={type:l.dataset.type,value:l.dataset.value},E(e))})}),document.querySelectorAll(".drop-zone").forEach(l=>{l.addEventListener("dragover",p=>{p.preventDefault(),l.classList.add("drag-over")}),l.addEventListener("dragleave",()=>{l.classList.remove("drag-over")}),l.addEventListener("drop",p=>{p.preventDefault(),l.classList.remove("drag-over");const f=p.dataTransfer?.getData("text/plain"),I=p.dataTransfer?.getData("text/type"),B=l.dataset.accept;f&&I&&B===I&&(d(l.dataset.slot,f),setTimeout(()=>{const M=document.querySelector(`.drop-zone[data-slot="${l.dataset.slot}"]`);M&&(M.classList.add("drop-success"),setTimeout(()=>M.classList.remove("drop-success"),180))},0))}),l.addEventListener("click",()=>{if(e.part3SelectedToken){const{type:p,value:f}=e.part3SelectedToken;l.dataset.accept===p&&(d(l.dataset.slot,f),setTimeout(()=>{const B=document.querySelector(`.drop-zone[data-slot="${l.dataset.slot}"]`);B&&(B.classList.add("drop-success"),setTimeout(()=>B.classList.remove("drop-success"),180))},0))}}),l.addEventListener("keydown",p=>{if((p.key==="Enter"||p.key===" ")&&e.part3SelectedToken){p.preventDefault();const{type:f,value:I}=e.part3SelectedToken;l.dataset.accept===f&&(d(l.dataset.slot,I),setTimeout(()=>{const M=document.querySelector(`.drop-zone[data-slot="${l.dataset.slot}"]`);M&&(M.classList.add("drop-success"),setTimeout(()=>M.classList.remove("drop-success"),180))},0))}})}),document.querySelectorAll(".drop-clear").forEach(l=>{l.addEventListener("click",p=>{p.stopPropagation();const f=l.dataset.slot;f&&d(f,null)})})}e._shortcutsBound||(document.addEventListener("keydown",d=>{const l=d.key.toLowerCase();l==="enter"?document.getElementById("submitBtn")?.click():d.ctrlKey&&l==="z"&&(d.preventDefault(),e.undo(),E(e))}),e._shortcutsBound=!0)}console.log("validator.js loaded v1");function Ie(e,t,n=0){function o(s,a){return Math.abs(s[0]-a[0])<=n&&Math.abs(s[1]-a[1])<=n}const r=[];for(const s of e){const a=t.find(c=>o(s,c));a&&r.push(a)}return r}const pt={placePoints:(e,t,n,o)=>{if(e.currentStep!==1)return;const r=e.expectedPoints.length;if(e.studentPoints.length>=r)return;const s=n.getBoundingClientRect();let a=t.clientX-s.left,c=t.clientY-s.top;const i=e.view.xmin,u=e.view.xmax,y=e.view.ymin,m=e.view.ymax;let v=s.width,g=s.height;if(n.createSVGPoint&&n.getScreenCTM){const T=n.getScreenCTM();if(T){const C=n.createSVGPoint();C.x=t.clientX,C.y=t.clientY;const R=C.matrixTransform(T.inverse());a=R.x,c=R.y;const b=n.viewBox?.baseVal;b&&b.width&&b.height&&(v=b.width,g=b.height)}}const P=i+a/v*(u-i),$=m-c/g*(m-y),w=e.config.interaction?.snapStep??1,x=[Math.round(P/w)*w,Math.round($/w)*w],h=e.config.interaction?.hitRadiusPx??18,O=(x[0]-i)/(u-i)*v,A=(m-x[1])/(m-y)*g,N=O-a,L=A-c;Math.sqrt(N*N+L*L)>h||e.studentPoints.some(T=>T[0]===x[0]&&T[1]===x[1])||(e.studentPoints.push(x),e.orderedStudentPoints=Ie(e.expectedPoints,e.studentPoints),o())},drawPolyline:()=>{},dragHandles:()=>{},selectInterval:()=>{}};function Oe(e,t){document.addEventListener("pointerdown",function(n){const o=document.getElementById("graphSvg");if(!o||!o.contains(n.target))return;const r=e.config.interaction?.mode||"placePoints",s=e.activityHandlers??{},a={...pt,...s};a[r]&&a[r](e,n,o,t)}),console.log("Interaction attached")}const he={type:F.GRAPH_PLOT,initState:()=>({submitted:!1}),render:({page:e})=>`
      <div class="page-graph-plot">
        ${e?.showPrompt?H(e):""}
        <div class="legacy-graph-root"></div>
      </div>
    `,bind:({root:e,state:t})=>{const n=e.querySelector(".legacy-graph-root");n&&(t._legacyRenderTarget=n,t._legacyWrap=!1,E(t),t._graphPlotInteractionBound||(Oe(t,()=>{E(t)}),t._graphPlotInteractionBound=!0))}},D=e=>{if(!e?.submitted)return"";const t=e.isCorrect?"success":"error",n=e.feedback??(e.isCorrect?"Correct.":"Not correct. Try again.");return`<div class="page-feedback ${t}">${n}</div>`},_=(e,t,n)=>{e.submitted=!0,e.isCorrect=!!t,e.feedback=e.isCorrect?"Correct.":"Not correct. Try again."},be={type:F.DRAG_DROP_FILL,initState:()=>({answers:{},selectedToken:null,submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.blanks)?e.blanks:[],o=Array.isArray(e?.tokens)?e.tokens:[],r=t?.answers??{},s=n.map(i=>{const u=r[i];return`<div class="drop-slot" data-blank="${i}" tabindex="0" role="button">${u||"[drop]"}</div>`}).join(""),a=o.map(i=>`<div class="token ${t?.selectedToken===i?"selected":""}" data-token="${i}" tabindex="0" role="button">${i}</div>`).join(""),c=D(t);return`
      <div class="page-drag-drop">
        ${H(e)}
        <div class="drop-zone">${s||"[drop zones]"}</div>
        <div class="token-bank">${a||"[token bank]"}</div>
        ${c}
      </div>
    `},bind:({root:e,pageState:t,page:n})=>{const o=e.querySelectorAll(".token"),r=e.querySelectorAll(".drop-slot");o.forEach(s=>{const a=()=>{t.selectedToken=s.dataset.token,e.querySelectorAll(".token").forEach(c=>c.classList.remove("selected")),s.classList.add("selected")};s.addEventListener("click",a),s.addEventListener("keydown",c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),a())})}),r.forEach(s=>{const a=()=>{if(!t.selectedToken)return;const c=s.dataset.blank;t.answers[c]=t.selectedToken,s.textContent=t.selectedToken,t.selectedToken=null,e.querySelectorAll(".token").forEach(i=>i.classList.remove("selected"))};s.addEventListener("click",a),s.addEventListener("keydown",c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),a())})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.blanks)?t.blanks:[],o=t?.correctAnswers??{},r=n.every(a=>!!e.answers?.[a]),s=n.every(a=>e.answers?.[a]===o[a]);return _(e,r&&s),{rerender:!0}},reset:({pageState:e})=>(e.answers={},e.selectedToken=null,e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},ge={type:F.MULTIPLE_CHOICE,initState:()=>({selected:[],submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.choices)?e.choices:[],o=!!e?.multiSelect,r=t?.selected??[],s=o?"checkbox":"radio",a=e?.id?`mc-${e.id}`:"mc",c=n.map((u,y)=>{const m=r.includes(String(y));return`
          <label class="choice-item">
            <input type="${s}" name="${a}" value="${y}" ${m?"checked":""}>
            <span>${u}</span>
          </label>
        `}).join(""),i=D(t);return`
      <div class="page-multiple-choice">
        ${H(e)}
        <div class="choice-list">${c||"[choices]"}</div>
        ${i}
      </div>
    `},bind:({root:e,pageState:t,page:n})=>{const o=!!n?.multiSelect,r=e.querySelectorAll(".choice-item input");r.forEach(s=>{s.addEventListener("change",()=>{if(o){const a=Array.from(r).filter(c=>c.checked).map(c=>c.value);t.selected=a}else t.selected=s.checked?[s.value]:[]})})},submit:({pageState:e,page:t})=>{const n=!!t?.multiSelect,o=e.selected??[];let r=!1;if(n){const s=Array.isArray(t?.correctIndices)?t.correctIndices.map(String):[],a=[...o].sort(),c=[...s].sort();r=a.length===c.length&&a.every((i,u)=>i===c[u])}else{const s=t?.correctIndex;r=o.length===1&&String(s)===o[0]}return _(e,r),{rerender:!0}},reset:({pageState:e})=>(e.selected=[],e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},xe={type:F.SORT_ORDER,initState:()=>({order:[],submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.items)?e.items:[],o=t?.order??[],r=n.map((a,c)=>{const i=o.indexOf(String(c)),u=i>=0?`<span class="order-badge">${i+1}</span>`:"";return`<div class="sort-item ${i>=0?"selected":""}" data-index="${c}" tabindex="0" role="button">${u}${a}</div>`}).join(""),s=D(t);return`
      <div class="page-sort-order">
        ${H(e)}
        <div class="sort-list">${r||"[sortable items]"}</div>
        ${s}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll(".sort-item").forEach(n=>{const o=()=>{const r=n.dataset.index;r&&(t.order.includes(r)?t.order=t.order.filter(s=>s!==r):t.order=[...t.order,r],e.querySelectorAll(".sort-item").forEach(s=>{s.classList.remove("selected"),s.querySelectorAll(".order-badge").forEach(a=>a.remove())}),t.order.forEach((s,a)=>{const c=e.querySelector(`.sort-item[data-index='${s}']`);if(c){c.classList.add("selected");const i=document.createElement("span");i.className="order-badge",i.textContent=String(a+1),c.prepend(i)}}))};n.addEventListener("click",o),n.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),o())})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.items)?t.items:[],o=Array.isArray(t?.correctOrder)?t.correctOrder:[],r=e.order??[],s=r.length===n.length;let a=!1;if(o.length>0)if(typeof o[0]=="number"){const c=o.map(String);a=c.length===r.length&&c.every((i,u)=>i===r[u])}else{const c=r.map(i=>n[Number(i)]);a=o.length===c.length&&o.every((i,u)=>i===c[u])}return _(e,s&&a),{rerender:!0}},reset:({pageState:e})=>(e.order=[],e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},$e={type:F.MATCH_PAIRS,initState:()=>({pairs:{},selectedLeft:null,submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.leftItems)?e.leftItems:[],o=Array.isArray(e?.rightItems)?e.rightItems:[],r=t?.pairs??{},s=n.map((i,u)=>{const y=r[u]!==void 0;return`<div class="match-item ${t?.selectedLeft===String(u)?"selected":""}" data-side="left" data-index="${u}" tabindex="0" role="button">${i}${y?" ✓":""}</div>`}).join(""),a=o.map((i,u)=>{const m=Object.keys(r).find(v=>String(r[v])===String(u))!==void 0;return`<div class="match-item ${m?"paired":""}" data-side="right" data-index="${u}" tabindex="0" role="button">${i}${m?" ✓":""}</div>`}).join(""),c=D(t);return`
      <div class="page-match-pairs">
        ${H(e)}
        <div class="match-columns">
          <div class="match-column">${s||"[left items]"}</div>
          <div class="match-column">${a||"[right items]"}</div>
        </div>
        ${c}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll(".match-item[data-side='left']").forEach(n=>{const o=()=>{t.selectedLeft=n.dataset.index??null,e.querySelectorAll(".match-item[data-side='left']").forEach(r=>r.classList.remove("selected")),n.classList.add("selected")};n.addEventListener("click",o),n.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),o())})}),e.querySelectorAll(".match-item[data-side='right']").forEach(n=>{const o=()=>{const r=n.dataset.index;!t.selectedLeft||r===void 0||(t.pairs[t.selectedLeft]=Number(r),t.selectedLeft=null,e.querySelectorAll(".match-item[data-side='left']").forEach(s=>s.classList.remove("selected")))};n.addEventListener("click",o),n.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),o())})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.leftItems)?t.leftItems:[],o=t?.correctPairs??{},r=e.pairs??{},a=Object.keys(r).length===n.length&&Object.keys(o).every(c=>String(o[c])===String(r[c]));return _(e,a),{rerender:!0}},reset:({pageState:e})=>(e.pairs={},e.selectedLeft=null,e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},Se={type:F.NUMERIC_INPUT,initState:()=>({value:"",submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=e?.unit?`<span class="numeric-unit">${e.unit}</span>`:"",o=t?.value??"",r=D(t);return`
      <div class="page-numeric-input">
        ${H(e)}
        <div class="numeric-input-row">
          <input class="numeric-input" type="text" placeholder="Enter value" value="${o}">
          ${n}
        </div>
        ${r}
      </div>
    `},bind:({root:e,pageState:t})=>{const n=e.querySelector(".numeric-input");n&&n.addEventListener("input",()=>{t.value=n.value})},submit:({pageState:e,page:t})=>{const n=e.value,o=Number(n),r=Number(t?.correctValue),s=Number(t?.tolerance??0),c=Number.isFinite(o)&&Number.isFinite(r)&&Math.abs(o-r)<=s;return _(e,c),{rerender:!0}},reset:({pageState:e})=>(e.value="",e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},ke={type:F.TABLE_COMPLETE,initState:()=>({values:{},submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.columns)?e.columns:[],o=Array.isArray(e?.rows)?e.rows:[],r=t?.values??{},s=n.map(i=>`<th>${i}</th>`).join(""),a=o.map((i,u)=>`<tr>${i.map((m,v)=>{if(m==null){const g=`${u},${v}`,P=r[g]??"";return`<td><input data-row="${u}" data-col="${v}" type="text" value="${P}"></td>`}return`<td>${m}</td>`}).join("")}</tr>`).join(""),c=D(t);return`
      <div class="page-table-complete">
        ${H(e)}
        <table class="value-table">
          <thead><tr>${s||""}</tr></thead>
          <tbody>${a||""}</tbody>
        </table>
        ${c}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll("input[data-row]").forEach(n=>{n.addEventListener("input",()=>{const o=n.dataset.row,r=n.dataset.col;if(o===void 0||r===void 0)return;const s=`${o},${r}`;t.values[s]=n.value})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.rows)?t.rows:[],o=Array.isArray(t?.correctRows)?t.correctRows:[],r=e.values??{};let s=!0;return n.forEach((a,c)=>{a.forEach((i,u)=>{if(i==null){const y=`${c},${u}`,m=o?.[c]?.[u];(m==null||String(r[y]??"")!==String(m))&&(s=!1)}})}),_(e,s),{rerender:!0}},reset:({pageState:e})=>(e.values={},e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},we={type:F.TRUE_FALSE_GRID,initState:()=>({answers:{},submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const o=(Array.isArray(e?.statements)?e.statements:[]).map((s,a)=>{const c=t?.answers?.[a];return`
          <tr>
            <td>${s}</td>
            <td><button class="tf-btn ${c===!0?"selected":""}" data-index="${a}" data-value="true">True</button></td>
            <td><button class="tf-btn ${c===!1?"selected":""}" data-index="${a}" data-value="false">False</button></td>
          </tr>
        `}).join(""),r=D(t);return`
      <div class="page-true-false">
        ${H(e)}
        <table class="true-false-grid">
          <thead><tr><th>Statement</th><th>True</th><th>False</th></tr></thead>
          <tbody>${o||""}</tbody>
        </table>
        ${r}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll(".tf-btn").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.index,r=n.dataset.value==="true";o!==void 0&&(t.answers[o]=r,e.querySelectorAll(`.tf-btn[data-index='${o}']`).forEach(s=>s.classList.remove("selected")),n.classList.add("selected"))})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.statements)?t.statements:[],o=Array.isArray(t?.correctAnswers)?t.correctAnswers:[],r=e.answers??{},a=n.every((c,i)=>r[i]===!0||r[i]===!1)&&o.every((c,i)=>r[i]===c);return _(e,a),{rerender:!0}},reset:({pageState:e})=>(e.answers={},e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},Ae={type:F.PROOF_STEPS,initState:()=>({order:[],submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.steps)?e.steps:[],o=t?.order??[],r=n.map((a,c)=>{const i=o.indexOf(String(c)),u=i>=0?`<span class="order-badge">${i+1}</span>`:"";return`<div class="proof-step ${i>=0?"selected":""}" data-index="${c}" tabindex="0" role="button">${u}${a}</div>`}).join(""),s=D(t);return`
      <div class="page-proof-steps">
        ${H(e)}
        <div class="proof-steps-list">${r||"[proof steps]"}</div>
        ${s}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll(".proof-step").forEach(n=>{const o=()=>{const r=n.dataset.index;r&&(t.order.includes(r)?t.order=t.order.filter(s=>s!==r):t.order=[...t.order,r],e.querySelectorAll(".proof-step").forEach(s=>{s.classList.remove("selected"),s.querySelectorAll(".order-badge").forEach(a=>a.remove())}),t.order.forEach((s,a)=>{const c=e.querySelector(`.proof-step[data-index='${s}']`);if(c){c.classList.add("selected");const i=document.createElement("span");i.className="order-badge",i.textContent=String(a+1),c.prepend(i)}}))};n.addEventListener("click",o),n.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),o())})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.steps)?t.steps:[],o=Array.isArray(t?.correctOrder)?t.correctOrder:[],r=e.order??[],s=r.length===n.length;let a=!1;if(o.length>0)if(typeof o[0]=="number"){const c=o.map(String);a=c.length===r.length&&c.every((i,u)=>i===r[u])}else{const c=r.map(i=>n[Number(i)]);a=o.length===c.length&&o.every((i,u)=>i===c[u])}return _(e,s&&a),{rerender:!0}},reset:({pageState:e})=>(e.order=[],e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},Ee={type:F.GRAPH_IDENTIFY,initState:()=>({selected:[],submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.targets)?e.targets:[],o=t?.selected??[],r=n.map((a,c)=>`<button class="target-chip ${o.includes(String(c))?"selected":""}" data-index="${c}">${a}</button>`).join(""),s=D(t);return`
      <div class="page-graph-identify">
        ${H(e)}
        <div class="graph-placeholder">[graph for identification]</div>
        <div class="target-list">${r||at(["Targets pending"])}</div>
        ${s}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll(".target-chip").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.index;o!==void 0&&(t.selected.includes(o)?(t.selected=t.selected.filter(r=>r!==o),n.classList.remove("selected")):(t.selected=[...t.selected,o],n.classList.add("selected")))})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.correctTargets)?t.correctTargets.map(String):[],o=(e.selected??[]).map(String).sort(),r=[...n].sort(),s=o.length===r.length&&o.every((a,c)=>a===r[c]);return _(e,s),{rerender:!0}},reset:({pageState:e})=>(e.selected=[],e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},Pe={type:F.TRANSFORMATION_BUILDER,initState:()=>({operations:[],submitted:!1,isCorrect:null,feedback:""}),render:({page:e,pageState:t})=>{const n=Array.isArray(e?.operations)?e.operations:[],o=t?.operations??[],r=n.map(c=>`<button class="operation-btn" data-op="${c}">${c}</button>`).join(""),s=o.length?o.map((c,i)=>`<div class="stack-item" data-index="${i}" tabindex="0" role="button">${c}</div>`).join(""):"[stacked operations]",a=D(t);return`
      <div class="page-transformation-builder">
        ${H(e)}
        <div class="operation-bank">${r||"[operations]"}</div>
        <div class="operation-stack">${s}</div>
        ${a}
      </div>
    `},bind:({root:e,pageState:t})=>{e.querySelectorAll(".operation-btn").forEach(n=>{n.addEventListener("click",()=>{const o=n.dataset.op;if(!o)return;t.operations=[...t.operations,o];const r=e.querySelector(".operation-stack");if(!r)return;const s=document.createElement("div");s.className="stack-item",s.tabIndex=0,s.setAttribute("role","button"),s.textContent=o,r.appendChild(s)})}),e.querySelectorAll(".stack-item").forEach(n=>{const o=()=>{const r=Number(n.dataset.index);Number.isNaN(r)||(t.operations=t.operations.filter((s,a)=>a!==r),n.remove())};n.addEventListener("click",o),n.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),o())})})},submit:({pageState:e,page:t})=>{const n=Array.isArray(t?.correctOperations)?t.correctOperations:[],o=e.operations??[],r=n.length===o.length&&n.every((s,a)=>s===o[a]);return _(e,r),{rerender:!0}},reset:({pageState:e})=>(e.operations=[],e.submitted=!1,e.isCorrect=null,e.feedback="",{rerender:!0})},ft=new Map([[he.type,he],[be.type,be],[ge.type,ge],[xe.type,xe],[$e.type,$e],[Se.type,Se],[ke.type,ke],[we.type,we],[Ae.type,Ae],[Ee.type,Ee],[Pe.type,Pe]]),Re=e=>ft.get(e),Be=e=>Array.isArray(e)?e:[],Te=e=>e!==null&&typeof e=="object"&&!Array.isArray(e),mt={"graph-plot":()=>[],"drag-drop-fill":e=>{const t=[];if(Array.isArray(e?.tokens)||t.push("tokens must be an array"),Array.isArray(e?.blanks)||t.push("blanks must be an array"),!Te(e?.correctAnswers))t.push("correctAnswers must be an object");else{const o=Be(e?.blanks).filter(r=>e.correctAnswers[r]===void 0);o.length>0&&t.push(`correctAnswers missing keys: ${o.join(", ")}`)}return t},"multiple-choice":e=>{const t=[];return Array.isArray(e?.choices)||t.push("choices must be an array"),!!e?.multiSelect?Array.isArray(e?.correctIndices)||t.push("correctIndices must be an array when multiSelect is true"):e?.correctIndex===void 0&&t.push("correctIndex is required when multiSelect is false"),t},"sort-order":e=>{const t=[];return Array.isArray(e?.items)||t.push("items must be an array"),Array.isArray(e?.correctOrder)?e?.items&&e.correctOrder.length!==e.items.length&&t.push("correctOrder length must match items length"):t.push("correctOrder must be an array"),t},"match-pairs":e=>{const t=[];return Array.isArray(e?.leftItems)||t.push("leftItems must be an array"),Array.isArray(e?.rightItems)||t.push("rightItems must be an array"),Te(e?.correctPairs)||t.push("correctPairs must be an object"),t},"numeric-input":e=>{const t=[];return e?.correctValue===void 0&&t.push("correctValue is required"),e?.tolerance!==void 0&&!Number.isFinite(Number(e.tolerance))&&t.push("tolerance must be a number if provided"),t},"table-complete":e=>{const t=[];return Array.isArray(e?.columns)||t.push("columns must be an array"),Array.isArray(e?.rows)||t.push("rows must be an array"),Array.isArray(e?.correctRows)||t.push("correctRows must be an array"),t},"true-false-grid":e=>{const t=[];return Array.isArray(e?.statements)||t.push("statements must be an array"),Array.isArray(e?.correctAnswers)?e?.statements&&e.correctAnswers.length!==e.statements.length&&t.push("correctAnswers length must match statements length"):t.push("correctAnswers must be an array"),t},"proof-steps":e=>{const t=[];return Array.isArray(e?.steps)||t.push("steps must be an array"),Array.isArray(e?.correctOrder)||t.push("correctOrder must be an array"),t},"graph-identify":e=>{const t=[];return Array.isArray(e?.targets)||t.push("targets must be an array"),Array.isArray(e?.correctTargets)||t.push("correctTargets must be an array"),t},"transformation-builder":e=>{const t=[];return Array.isArray(e?.operations)||t.push("operations must be an array"),Array.isArray(e?.correctOperations)||t.push("correctOperations must be an array"),t}},yt=e=>{const t=[];return Be(e?.pages).forEach((o,r)=>{const s=o?.id??`page-${r+1}`,a=o?.type;if(!a){t.push(`[${s}] missing type`);return}if(!Re(a)){t.push(`[${s}] unknown type: ${a}`);return}const i=mt[a];i&&i(o).forEach(u=>t.push(`[${s}] ${u}`))}),t},fe=e=>e!==null&&typeof e=="object"&&!Array.isArray(e),vt=e=>{const t=[];if(!fe(e))return["config must be an object"];const n=e?.original?.points,o=e?.series;!Array.isArray(n)&&!Array.isArray(o)&&t.push("missing original.points or series array");const r=e?.grid??e?.view;return fe(r)?["xmin","xmax","ymin","ymax"].forEach(s=>{r[s]===void 0&&t.push(`grid/view missing ${s}`)}):t.push("missing grid/view settings"),fe(e?.interaction)||t.push("missing interaction settings"),t},Ne=new Map;function ht(e){!e||!e.activityType||Ne.set(e.activityType,e)}function bt(e){return Ne.get(e)}function gt(){return new URLSearchParams(window.location.search).get("src")}async function xt(e,t){if(!e?.activityModule)return;const o=await import(new URL(e.activityModule,new URL(t,window.location.href)).href);ht(o),typeof o.validate=="function"&&ct(o.activityType,o.validate)}async function $t(){const t=gt()||"/applets/configs/golden.json",n=await fetch(t);if(!n.ok)throw new Error(`Could not load config (${n.status}) from ${t}`);const o=await n.json(),r=Ye(o);if(await xt(r?.activity,t),Array.isArray(r?.pages)){const s=yt(r);if(s.length>0)throw new Error(`Invalid pages config:
- ${s.join(`
- `)}`)}else{const s=vt(r);if(s.length>0)throw new Error(`Invalid legacy config:
- ${s.join(`
- `)}`)}return{config:r,src:t}}function St(e,t){if(!Array.isArray(e))return[];if(!t||!t.type)return e;const n=()=>{const r=t.pivot;return Array.isArray(r)&&r.length===2?[r[0],r[1]]:[0,0]},o=([r,s],a)=>{const c=(a%360+360)%360;return c===0?[r,s]:c===90?[-s,r]:c===180?[-r,-s]:c===270?[s,-r]:[r,s]};if(t.type==="reflect_x")return e.map(([r,s])=>[r,-s]);if(t.type==="reflect_y")return e.map(([r,s])=>[-r,s]);if(t.type==="translate"){const r=Number(t.dx??0),s=Number(t.dy??0);return e.map(([a,c])=>[a+r,c+s])}if(t.type==="rotate"){const r=Number(t.angle??0),[s,a]=n();return e.map(([c,i])=>{const u=c-s,y=i-a,[m,v]=o([u,y],r);return[m+s,v+a]})}if(t.type==="dilate"){const r=Number(t.k??1),[s,a]=n();return e.map(([c,i])=>[s+r*(c-s),a+r*(i-a)])}return e}const kt=1;function wt(e){const t=Number(e);return Number.isFinite(t)&&t>0?t:kt}function At({config:e,src:t}){const n=e?.interaction??{},o=e?.feedback??{},r={...e,interaction:{...n,snapStep:wt(n.snapStep),hitRadiusPx:n.hitRadiusPx??20},feedback:{showExpectedPointsOnFail:o.showExpectedPointsOnFail??!1,showSolutionOnFail:o.showSolutionOnFail??!1,allowHints:o.allowHints??!1}},s=r?.original?.points??[],a=r.activityType??r.activity?.type??"transformations",c=bt(a),i={config:r,src:t,pageState:{},currentPageIndex:0,expectedPoints:[],studentPoints:[],orderedStudentPoints:[],activityState:{},activityHandlers:null,currentStep:1,part2Answer:{x:null,y:null},part2SelectedToken:null,part2Submitted:!1,part2Correct:null,part2ShowSolution:!1,part2Feedback:"",part3Answers:[],part3Answer:{p1:null,p2:null,coordType:null,value:null},part3SelectedToken:null,part3History:[],part3Submitted:!1,part3Correct:null,part3ShowSolution:!1,part3Feedback:"",persistedGraphPoints:null,persistedReferenceGraph:null,slideExplanationOpen:{},showSolution:!1,lastSubmitCorrect:null,feedback:"",submitted:!1,view:{xmin:r.grid.xmin,xmax:r.grid.xmax,ymin:r.grid.ymin,ymax:r.grid.ymax}};if(c&&typeof c.createActivityState=="function")try{const u=c.createActivityState(r,t);u&&typeof u=="object"&&(i.activityState=u,Array.isArray(u.expectedPoints)&&(i.expectedPoints=u.expectedPoints),Array.isArray(u.studentPoints)&&(i.studentPoints=u.studentPoints))}catch(u){console.error("activity.createActivityState failed:",u)}if((!Array.isArray(i.expectedPoints)||i.expectedPoints.length===0)&&(i.expectedPoints=St(s,r?.transform)),c&&typeof c.getInteractionHandlers=="function")try{i.activityHandlers=c.getInteractionHandlers()}catch(u){console.error("activity.getInteractionHandlers failed:",u)}return i.undo=function(){i.studentPoints.pop(),i.orderedStudentPoints=Ie(i.expectedPoints,i.studentPoints),i.feedback=""},i.zoomIn=function(){const u=i.view.xmax-i.view.xmin,y=i.view.ymax-i.view.ymin,m=(i.view.xmin+i.view.xmax)/2,v=(i.view.ymin+i.view.ymax)/2;i.view.xmin=m-u*.8/2,i.view.xmax=m+u*.8/2,i.view.ymin=v-y*.8/2,i.view.ymax=v+y*.8/2},i.zoomOut=function(){const u=i.view.xmax-i.view.xmin,y=i.view.ymax-i.view.ymin,m=(i.view.xmin+i.view.xmax)/2,v=(i.view.ymin+i.view.ymax)/2;i.view.xmin=m-u*1.2/2,i.view.xmax=m+u*1.2/2,i.view.ymin=v-y*1.2/2,i.view.ymax=v+y*1.2/2},i.enableSolution=function(){i.showSolution=!0},i.clearSolution=function(){i.showSolution=!1},i.reset=function(){i.studentPoints=[],i.orderedStudentPoints=[],i.feedback="",i.showSolution=!1,i.lastSubmitCorrect=null,i.submitted=!1},i}const Et=(e,t,n)=>(e.pageState||(e.pageState={}),e.pageState[t]||(e.pageState[t]=n?n():{}),e.pageState[t]),Pt=({page:e,index:t,total:n})=>Le({page:e,index:t,total:n,bodyHtml:`<div class="page-unknown">Unknown page type: ${e?.type??"(missing)"}</div>`,footerHtml:""}),le=e=>{const t=document.getElementById("app");if(!t)return;const n=Array.isArray(e.config?.pages)?e.config.pages:[],o=n.length,r=Math.max(0,Math.min(e.currentPageIndex??0,o-1)),s=n[r]??{type:"unknown"},a=Re(s.type);if(!a){t.innerHTML=Pt({page:s,index:r,total:o});return}const c=s.id??`page-${r+1}`,i=Et(e,c,()=>a.initState?.(s)),u=`
    ${a.render({page:s,state:e,pageState:i,index:r,total:o})}
  `,y=s?.showFooter!==!1,m=y?`
    <div class="page-footer-controls">
      <button class="page-nav" data-action="prev" ${r===0?"disabled":""}>Back</button>
      <div class="page-footer-actions">
        <button class="page-reset" data-action="reset">Try Again</button>
        <button class="page-submit" data-action="submit">Submit</button>
        <button class="page-nav" data-action="next" ${r>=o-1?"disabled":""}>Next</button>
      </div>
    </div>
  `:"",g=`
    <div class="slide-scale-root">
      <div class="slide-scale-inner">
        <div class="slide-viewport">
          <div class="slide-safe-area">
            ${Le({page:s,index:r,total:o,bodyHtml:u,footerHtml:m})}
          </div>
        </div>
      </div>
    </div>
  `;t.innerHTML=g,window.dispatchEvent(new Event("applet:rendered"));const P=t.querySelector(".page-shell");a.bind?.({root:P,state:e,pageState:i,page:s,index:r,total:o});const $=w=>{const x=w==="next"?r+1:r-1;e.currentPageIndex=Math.max(0,Math.min(x,o-1)),le(e)};y&&(P?.querySelector("[data-action='prev']")?.addEventListener("click",()=>$("prev")),P?.querySelector("[data-action='next']")?.addEventListener("click",()=>$("next")),P?.querySelector("[data-action='submit']")?.addEventListener("click",()=>{a.submit?.({root:P,state:e,pageState:i,page:s,index:r,total:o})?.rerender&&le(e)}),P?.querySelector("[data-action='reset']")?.addEventListener("click",()=>{a.reset?.({root:P,state:e,pageState:i,page:s,index:r,total:o})?.rerender&&le(e)}))};async function Tt(){try{const{config:e,src:t}=await $t(),n=new URLSearchParams(window.location.search),o=n.get("mode"),r=n.get("embed"),s=r==="1"||r==="true",a=r==="0"||r==="false",c=n.get("legacy")==="1"||o==="legacy",i=e?.ui?.mode??e?.mode,u=e?.ui?.publishMode===!0,y=o==="slide"||e?.slideMode===!0||i==="slide";let m=!1;try{m=window.self!==window.top}catch{m=!0}const v=!a&&(u||s||y||m);y&&(document.documentElement.classList.add("slide-mode"),document.body.classList.add("slide-mode")),u&&(document.documentElement.classList.add("publish-mode"),document.body.classList.add("publish-mode")),v&&(document.documentElement.classList.add("embed-mode"),document.body.classList.add("embed-mode"),document.querySelector(".wrap")?.classList.add("embed-viewport"));const g=document.getElementById("app"),P=e?.ui?.layout??{},$={ppt1080p:{slideWidth:"1280px",slideHeight:"720px",safePadding:"24px",contentWidth:"1200px",contentPadding:"24px",graphSize:"520px"},ppt720p:{slideWidth:"960px",slideHeight:"540px",safePadding:"18px",contentWidth:"900px",contentPadding:"18px",graphSize:"480px"},ppt4x3:{slideWidth:"1024px",slideHeight:"768px",safePadding:"20px",contentWidth:"960px",contentPadding:"20px",graphSize:"520px"}},w=P.preset,x=w&&$[w]?$[w]:null,h=x?{...x,...P}:P;g&&(g.dataset.publishMode=u?"1":"0",g.dataset.embedMode=v?"1":"0"),v&&(h.overflowPolicy="clamp"),g&&h&&(h.slideWidth&&g.style.setProperty("--slide-width",String(h.slideWidth)),h.slideHeight&&g.style.setProperty("--slide-height",String(h.slideHeight)),h.safePadding&&g.style.setProperty("--safe-padding",String(h.safePadding)),h.contentWidth&&g.style.setProperty("--content-width",String(h.contentWidth)),h.contentPadding&&g.style.setProperty("--content-padding",String(h.contentPadding)),h.graphSize&&g.style.setProperty("--graph-size",String(h.graphSize)),h.overflowPolicy&&(g.dataset.overflowPolicy=String(h.overflowPolicy)));const O=At({config:e,src:t});O.uiMode=y?"slide":"browser";const A=(S,T)=>{const C=Number.parseFloat(String(S).trim());return Number.isFinite(C)?C:T},N=(S,T)=>{if(!S)return;S.querySelectorAll(".page-body, .activity-copy > section, .explanation-box").forEach(R=>{R.classList.add("collapsible-section"),T?R.classList.add("collapsed"):R.classList.remove("collapsed");let b=null;const q=R.nextElementSibling;q&&q.classList.contains("collapse-toggle")&&(b=q),b||(b=document.createElement("button"),b.type="button",b.className="collapse-toggle",b.addEventListener("click",()=>{const K=R.classList.toggle("collapsed");b.textContent=K?"Show more":"Show less"}),R.insertAdjacentElement("afterend",b)),b.textContent=R.classList.contains("collapsed")?"Show more":"Show less",b.style.display=T?"inline-flex":"none"})},L=()=>{const S=document.getElementById("app");if(!S)return;const T=S.querySelector(".slide-scale-inner");if(!T)return;const C=getComputedStyle(S),R=A(C.getPropertyValue("--slide-width"),1280),b=A(C.getPropertyValue("--slide-height"),720),q=S.clientWidth||window.innerWidth,K=S.clientHeight||window.innerHeight,ee=Math.min(q/R,K/b,1);T.style.setProperty("--slide-scale",String(ee));const G=S.querySelector(".slide-safe-area");if(G){const Q=G.scrollHeight>G.clientHeight||G.scrollWidth>G.clientWidth;G.classList.toggle("overflow-warning",Q);const U=S.dataset.overflowPolicy;G.classList.toggle("overflow-clamp",U==="clamp"),N(G,U==="collapse"&&Q)}},j=Array.isArray(e?.pages)&&e.pages.length>0&&!c;j?le(O):E(O),L(),window.addEventListener("resize",L),window.addEventListener("applet:rendered",()=>{requestAnimationFrame(L)}),j||Oe(O,()=>{E(O)})}catch(e){console.error(e);const t=document.getElementById("app");t&&(t.innerHTML=`<pre style="color:red;">${e.message}</pre>`)}}Tt();
