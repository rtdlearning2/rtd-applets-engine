const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./graphPlotPage-COZg45GR.js","./pageTypes-s5bfgjb6.js","./dragDropFillPage-BY-7Odo7.js","./pageUi-D8KbPjWU.js","./multipleChoicePage-CldL3rWw.js","./sortOrderPage-x2RKAYAZ.js","./matchPairsPage-L9B8uiF_.js","./numericInputPage-BpD8WcMd.js","./tableCompletePage-pnFSMtWU.js","./trueFalseGridPage-B8YQtMjx.js","./proofStepsPage-BBO12UNG.js","./graphIdentifyPage-AjubeSce.js","./transformationBuilderPage-Y9jFKUSD.js"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&l(d)}).observe(document,{childList:!0,subtree:!0});function s(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function l(n){if(n.ep)return;n.ep=!0;const i=s(n);fetch(n.href,i)}})();const Re="0",K={xmin:-10,xmax:10,ymin:-10,ymax:10},se={title:"",subtitle:"",instructions:"",legend:[]},ce={mode:"placePoints",snapStep:1,hitRadiusPx:12};function Me(e={}){const t=`${e?.schemaVersion??Re}`;return t==="1"?He(e):{...e,schemaVersion:t}}function He(e){const t=Fe(e),s=Ne(e),l=qe(e),n=We(e),i=je(e),d=De(e,s),u=i.type??e.activityType??"transformations",a=Ge(e,n),p=e.transform??i.transform;return{...e,schemaVersion:"1",view:t,ui:s,interaction:l,series:n,activity:i,grid:t,title:s.title,subtitle:s.subtitle,instructions:s.instructions,legend:s.legend,original:a,transform:p,activityType:u,...d?{pages:d}:{}}}function Fe(e){const t=e.view??e.grid??K;return{xmin:U(t.xmin,K.xmin),xmax:U(t.xmax,K.xmax),ymin:U(t.ymin,K.ymin),ymax:U(t.ymax,K.ymax)}}function Ne(e){const t=ue(e.ui)?e.ui:{};return{title:t.title??e.title??se.title,subtitle:t.subtitle??e.subtitle??se.subtitle,instructions:t.instructions??e.instructions??se.instructions,legend:t.legend??e.legend??se.legend}}function qe(e){const t=ue(e.interaction)?e.interaction:{};return{mode:t.mode??ce.mode,snapStep:U(t.snapStep,ce.snapStep),hitRadiusPx:U(t.hitRadiusPx,ce.hitRadiusPx)}}function De(e,t){if(Array.isArray(e.pages))return e.pages;if(!Ve(e))return null;const s=t?.instructions??e.instructions??"";return[{id:"p1",type:"graph-plot",title:t?.title??e.title??"Graph Task",prompt:s}]}function Ve(e){const t=e.usePages??e.pageMode,s=e.ui?.usePages??e.ui?.pageMode,l=t??s;return l===!0?!0:typeof l=="string"?l==="template"||l==="pages":!1}function We(e){return Array.isArray(e.series)?e.series:e.original?.points?[{id:"original",role:"original",points:e.original.points}]:[]}function je(e){const t=ue(e.activity)?e.activity:{},s=t.type??e.activityType??"transformations";return{...t,type:s}}function Ge(e,t){if(e.original?.points)return e.original;const s=Ue(t),l=ze(s);return Array.isArray(l)?{points:l}:{points:[]}}function Ue(e){if(!Array.isArray(e))return null;const t=["original","reference","base"];for(const s of t){const l=e.find(n=>n?.role===s||n?.id===s);if(l)return l}return e[0]??null}function ze(e){return e?Array.isArray(e.points)?e.points:Array.isArray(e.geometry?.points)?e.geometry.points:Array.isArray(e.data?.points)?e.data.points:null:null}function U(e,t){const s=Number(e);return Number.isFinite(s)?s:t}function ue(e){return e!==null&&typeof e=="object"&&!Array.isArray(e)}const Ye="modulepreload",Xe=function(e,t){return new URL(e,t).href},ye={},H=function(t,s,l){let n=Promise.resolve();if(s&&s.length>0){let p=function(y){return Promise.all(y.map(g=>Promise.resolve(g).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};const d=document.getElementsByTagName("link"),u=document.querySelector("meta[property=csp-nonce]"),a=u?.nonce||u?.getAttribute("nonce");n=p(s.map(y=>{if(y=Xe(y,l),y in ye)return;ye[y]=!0;const g=y.endsWith(".css"),h=g?'[rel="stylesheet"]':"";if(l)for(let w=d.length-1;w>=0;w--){const v=d[w];if(v.href===y&&(!g||v.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${y}"]${h}`))return;const f=document.createElement("link");if(f.rel=g?"stylesheet":Ye,g||(f.as="script"),f.crossOrigin="",f.href=y,a&&f.setAttribute("nonce",a),document.head.appendChild(f),g)return new Promise((w,v)=>{f.addEventListener("load",w),f.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${y}`)))})}))}function i(d){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=d,window.dispatchEvent(u),!u.defaultPrevented)throw d}return n.then(d=>{for(const u of d||[])u.status==="rejected"&&i(u.reason);return t().catch(i)})},pe=new Map,he={"graph-plot":()=>H(()=>import("./graphPlotPage-COZg45GR.js"),__vite__mapDeps([0,1]),import.meta.url).then(e=>e.graphPlotPage),"drag-drop-fill":()=>H(()=>import("./dragDropFillPage-BY-7Odo7.js"),__vite__mapDeps([2,1,3]),import.meta.url).then(e=>e.dragDropFillPage),"multiple-choice":()=>H(()=>import("./multipleChoicePage-CldL3rWw.js"),__vite__mapDeps([4,1,3]),import.meta.url).then(e=>e.multipleChoicePage),"sort-order":()=>H(()=>import("./sortOrderPage-x2RKAYAZ.js"),__vite__mapDeps([5,1,3]),import.meta.url).then(e=>e.sortOrderPage),"match-pairs":()=>H(()=>import("./matchPairsPage-L9B8uiF_.js"),__vite__mapDeps([6,1,3]),import.meta.url).then(e=>e.matchPairsPage),"numeric-input":()=>H(()=>import("./numericInputPage-BpD8WcMd.js"),__vite__mapDeps([7,1,3]),import.meta.url).then(e=>e.numericInputPage),"table-complete":()=>H(()=>import("./tableCompletePage-pnFSMtWU.js"),__vite__mapDeps([8,1,3]),import.meta.url).then(e=>e.tableCompletePage),"true-false-grid":()=>H(()=>import("./trueFalseGridPage-B8YQtMjx.js"),__vite__mapDeps([9,1,3]),import.meta.url).then(e=>e.trueFalseGridPage),"proof-steps":()=>H(()=>import("./proofStepsPage-BBO12UNG.js"),__vite__mapDeps([10,1,3]),import.meta.url).then(e=>e.proofStepsPage),"graph-identify":()=>H(()=>import("./graphIdentifyPage-AjubeSce.js"),__vite__mapDeps([11,1,3]),import.meta.url).then(e=>e.graphIdentifyPage),"transformation-builder":()=>H(()=>import("./transformationBuilderPage-Y9jFKUSD.js"),__vite__mapDeps([12,1,3]),import.meta.url).then(e=>e.transformationBuilderPage)};async function Ke(e){const t=[...new Set(e.map(s=>s?.type).filter(Boolean))];await Promise.all(t.filter(s=>he[s]&&!pe.has(s)).map(s=>he[s]().then(l=>pe.set(s,l))))}const ge=e=>pe.get(e),be=e=>Array.isArray(e)?e:[],ve=e=>e!==null&&typeof e=="object"&&!Array.isArray(e),Qe={"graph-plot":()=>[],"drag-drop-fill":e=>{const t=[];if(Array.isArray(e?.tokens)||t.push("tokens must be an array"),Array.isArray(e?.blanks)||t.push("blanks must be an array"),!ve(e?.correctAnswers))t.push("correctAnswers must be an object");else{const l=be(e?.blanks).filter(n=>e.correctAnswers[n]===void 0);l.length>0&&t.push(`correctAnswers missing keys: ${l.join(", ")}`)}return t},"multiple-choice":e=>{const t=[];return Array.isArray(e?.choices)||t.push("choices must be an array"),!!e?.multiSelect?Array.isArray(e?.correctIndices)||t.push("correctIndices must be an array when multiSelect is true"):e?.correctIndex===void 0&&t.push("correctIndex is required when multiSelect is false"),t},"sort-order":e=>{const t=[];return Array.isArray(e?.items)||t.push("items must be an array"),Array.isArray(e?.correctOrder)?e?.items&&e.correctOrder.length!==e.items.length&&t.push("correctOrder length must match items length"):t.push("correctOrder must be an array"),t},"match-pairs":e=>{const t=[];return Array.isArray(e?.leftItems)||t.push("leftItems must be an array"),Array.isArray(e?.rightItems)||t.push("rightItems must be an array"),ve(e?.correctPairs)||t.push("correctPairs must be an object"),t},"numeric-input":e=>{const t=[];return e?.correctValue===void 0&&t.push("correctValue is required"),e?.tolerance!==void 0&&!Number.isFinite(Number(e.tolerance))&&t.push("tolerance must be a number if provided"),t},"table-complete":e=>{const t=[];return Array.isArray(e?.columns)||t.push("columns must be an array"),Array.isArray(e?.rows)||t.push("rows must be an array"),Array.isArray(e?.correctRows)||t.push("correctRows must be an array"),t},"true-false-grid":e=>{const t=[];return Array.isArray(e?.statements)||t.push("statements must be an array"),Array.isArray(e?.correctAnswers)?e?.statements&&e.correctAnswers.length!==e.statements.length&&t.push("correctAnswers length must match statements length"):t.push("correctAnswers must be an array"),t},"proof-steps":e=>{const t=[];return Array.isArray(e?.steps)||t.push("steps must be an array"),Array.isArray(e?.correctOrder)||t.push("correctOrder must be an array"),t},"graph-identify":e=>{const t=[];return Array.isArray(e?.targets)||t.push("targets must be an array"),Array.isArray(e?.correctTargets)||t.push("correctTargets must be an array"),t},"transformation-builder":e=>{const t=[];return Array.isArray(e?.operations)||t.push("operations must be an array"),Array.isArray(e?.correctOperations)||t.push("correctOperations must be an array"),t}},Ze=e=>{const t=[];return be(e?.pages).forEach((l,n)=>{const i=l?.id??`page-${n+1}`,d=l?.type;if(!d){t.push(`[${i}] missing type`);return}if(!ge(d)){t.push(`[${i}] unknown type: ${d}`);return}const a=Qe[d];a&&a(l).forEach(p=>t.push(`[${i}] ${p}`))}),t},de=e=>e!==null&&typeof e=="object"&&!Array.isArray(e),Je=e=>{const t=[];if(!de(e))return["config must be an object"];const s=e?.original?.points,l=e?.series;!Array.isArray(s)&&!Array.isArray(l)&&t.push("missing original.points or series array");const n=e?.grid??e?.view;return de(n)?["xmin","xmax","ymin","ymax"].forEach(i=>{n[i]===void 0&&t.push(`grid/view missing ${i}`)}):t.push("missing grid/view settings"),de(e?.interaction)||t.push("missing interaction settings"),t},xe=new Map;function et(e){!e||!e.activityType||xe.set(e.activityType,e)}function tt(e){return xe.get(e)}const Se={};function rt(e,t){typeof e!="string"||typeof t!="function"||(Se[e]=t)}function nt(e,t,s){const l=e&&Se[e];return l?l(t,s):{isCorrect:!1,details:{message:"No validator registered."}}}function ot(){return new URLSearchParams(window.location.search).get("src")}async function st(e,t){if(!e?.activityModule)return;const l=await import(new URL(e.activityModule,new URL(t,window.location.href)).href);et(l),typeof l.validate=="function"&&rt(l.activityType,l.validate)}async function it(){const t=ot()||"/applets/configs/golden.json",s=await fetch(t);if(!s.ok)throw new Error(`Could not load config (${s.status}) from ${t}`);const l=await s.json(),n=Me(l);if(await st(n?.activity,t),await Ke(n?.pages??[]),Array.isArray(n?.pages)){const i=Ze(n);if(i.length>0)throw new Error(`Invalid pages config:
- ${i.join(`
- `)}`)}else{const i=Je(n);if(i.length>0)throw new Error(`Invalid legacy config:
- ${i.join(`
- `)}`)}return{config:n,src:t}}console.log("validator.js loaded v1");function we(e,t,s=0){function l(i,d){return Math.abs(i[0]-d[0])<=s&&Math.abs(i[1]-d[1])<=s}const n=[];for(const i of e){const d=t.find(u=>l(i,u));d&&n.push(d)}return n}function at(e,t){if(!Array.isArray(e))return[];if(!t||!t.type)return e;const s=()=>{const n=t.pivot;return Array.isArray(n)&&n.length===2?[n[0],n[1]]:[0,0]},l=([n,i],d)=>{const u=(d%360+360)%360;return u===0?[n,i]:u===90?[-i,n]:u===180?[-n,-i]:u===270?[i,-n]:[n,i]};if(t.type==="reflect_x")return e.map(([n,i])=>[n,-i]);if(t.type==="reflect_y")return e.map(([n,i])=>[-n,i]);if(t.type==="translate"){const n=Number(t.dx??0),i=Number(t.dy??0);return e.map(([d,u])=>[d+n,u+i])}if(t.type==="rotate"){const n=Number(t.angle??0),[i,d]=s();return e.map(([u,a])=>{const p=u-i,y=a-d,[g,h]=l([p,y],n);return[g+i,h+d]})}if(t.type==="dilate"){const n=Number(t.k??1),[i,d]=s();return e.map(([u,a])=>[i+n*(u-i),d+n*(a-d)])}return e}const lt=1;function ct(e){const t=Number(e);return Number.isFinite(t)&&t>0?t:lt}function dt({config:e,src:t}){const s=e?.interaction??{},l=e?.feedback??{},n={...e,interaction:{...s,snapStep:ct(s.snapStep),hitRadiusPx:s.hitRadiusPx??20},feedback:{showExpectedPointsOnFail:l.showExpectedPointsOnFail??!1,showSolutionOnFail:l.showSolutionOnFail??!1,allowHints:l.allowHints??!1}},i=n?.original?.points??[],d=n.activityType??n.activity?.type??"transformations",u=tt(d),a={config:n,src:t,pageState:{},currentPageIndex:0,expectedPoints:[],studentPoints:[],orderedStudentPoints:[],activityState:{},activityHandlers:null,currentStep:1,part2Answer:{x:null,y:null},part2SelectedToken:null,part2Submitted:!1,part2Correct:null,part2ShowSolution:!1,part2Feedback:"",part3Answers:[],part3Answer:{p1:null,p2:null,coordType:null,value:null},part3SelectedToken:null,part3History:[],part3Submitted:!1,part3Correct:null,part3ShowSolution:!1,part3Feedback:"",persistedGraphPoints:null,persistedReferenceGraph:null,slideExplanationOpen:{},showSolution:!1,lastSubmitCorrect:null,feedback:"",submitted:!1,view:{xmin:n.grid.xmin,xmax:n.grid.xmax,ymin:n.grid.ymin,ymax:n.grid.ymax}};if(u&&typeof u.createActivityState=="function")try{const p=u.createActivityState(n,t);p&&typeof p=="object"&&(a.activityState=p,Array.isArray(p.expectedPoints)&&(a.expectedPoints=p.expectedPoints),Array.isArray(p.studentPoints)&&(a.studentPoints=p.studentPoints))}catch(p){console.error("activity.createActivityState failed:",p)}if((!Array.isArray(a.expectedPoints)||a.expectedPoints.length===0)&&(a.expectedPoints=at(i,n?.transform)),u&&typeof u.getInteractionHandlers=="function")try{a.activityHandlers=u.getInteractionHandlers()}catch(p){console.error("activity.getInteractionHandlers failed:",p)}return a.undo=function(){a.studentPoints.pop(),a.orderedStudentPoints=we(a.expectedPoints,a.studentPoints),a.feedback=""},a.zoomIn=function(){const p=a.view.xmax-a.view.xmin,y=a.view.ymax-a.view.ymin,g=(a.view.xmin+a.view.xmax)/2,h=(a.view.ymin+a.view.ymax)/2;a.view.xmin=g-p*.8/2,a.view.xmax=g+p*.8/2,a.view.ymin=h-y*.8/2,a.view.ymax=h+y*.8/2},a.zoomOut=function(){const p=a.view.xmax-a.view.xmin,y=a.view.ymax-a.view.ymin,g=(a.view.xmin+a.view.xmax)/2,h=(a.view.ymin+a.view.ymax)/2;a.view.xmin=g-p*1.2/2,a.view.xmax=g+p*1.2/2,a.view.ymin=h-y*1.2/2,a.view.ymax=h+y*1.2/2},a.enableSolution=function(){a.showSolution=!0},a.clearSolution=function(){a.showSolution=!1},a.reset=function(){a.studentPoints=[],a.orderedStudentPoints=[],a.feedback="",a.showSolution=!1,a.lastSubmitCorrect=null,a.submitted=!1},a}function pt(e,t,s,l={}){const{xmin:n,xmax:i,ymin:d,ymax:u}=t,{width:a,height:p}=s,y=a/(i-n),g=p/(u-d),h=S=>(S-n)*y,f=S=>p-(S-d)*g,w=f(0),v=h(0);let A="";for(let S=Math.ceil(n);S<=Math.floor(i);S++){const b=h(S);A+=`<line x1="${b}" y1="0" x2="${b}" y2="${p}" stroke="${S===0?"#000":"#f2f2f2"}"/>`,S!==0&&(A+=`<text x="${b}" y="${w+15}" font-size="12" font-family="sans-serif" text-anchor="middle" fill="#666">${S}</text>`)}for(let S=Math.ceil(d);S<=Math.floor(u);S++){const b=f(S);A+=`<line x1="0" y1="${b}" x2="${a}" y2="${b}" stroke="${S===0?"#000":"#f2f2f2"}"/>`,S!==0&&(A+=`<text x="${v-5}" y="${b+4}" font-size="12" font-family="sans-serif" text-anchor="end" fill="#666">${S}</text>`)}return e+A}function ut(e,t,s,l){const{xmin:n,xmax:i,ymin:d,ymax:u}=s,{width:a,height:p}=l,y=a/(i-n),g=p/(u-d),h=v=>(v-n)*y,f=v=>p-(v-d)*g;let w="";for(const v of t){const A=v.style||{},S=v.label;if(v.type==="points"){const b=A.r??5,I=A.fill??"black";for(const P of v.points)w+=`<circle cx="${h(P.x)}" cy="${f(P.y)}" r="${b}" fill="${I}" />`;if(S&&v.points.length>0){const P=v.points[v.points.length-1];w+=`<text x="${h(P.x)+8}" y="${f(P.y)}" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="${I}">${S}</text>`}}else if(v.type==="polyline"){const b=A.stroke??"black",I=A.strokeWidth??2,P=A.fill??"none",R=A.opacity??1,L=A.dashed?"5,5":"none";if(v.points.length>0){const N=Array.isArray(v.segmentMask)?v.segmentMask:null;if(N){let $="",E=!1;for(let C=0;C<v.points.length-1;C++){const B=v.points[C],x=v.points[C+1];!!(N[C]&&N[C+1])?E?$+=`L ${h(x.x)} ${f(x.y)} `:($+=`M ${h(B.x)} ${f(B.y)} `,$+=`L ${h(x.x)} ${f(x.y)} `,E=!0):E=!1}$&&(w+=`<path d="${$.trim()}" fill="${P}" stroke="${b}" stroke-width="${I}" opacity="${R}" stroke-dasharray="${L}" />`)}else{const $=v.points.map((E,C)=>(C===0?"M":"L")+h(E.x)+" "+f(E.y)).join(" ");w+=`<path d="${$}" fill="${P}" stroke="${b}" stroke-width="${I}" opacity="${R}" stroke-dasharray="${L}" />`}if(S){const $=v.points[v.points.length-1];w+=`<text x="${h($.x)+8}" y="${f($.y)}" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="${b}">${S}</text>`}}}}return e+w}function T(e){const t=document.getElementById("app"),s=e?._legacyRenderTarget??t,l=e?._legacyWrap!==void 0?e._legacyWrap:!0;if(!s)return;const n=e.config,i=n.original.points,d=e.expectedPoints,u=e.studentPoints??[],a=e.orderedStudentPoints??[],p=e.uiMode==="slide",y=n?.ui?.layout??{},g=Number(y.graphSize),h=Number.isFinite(g)&&g>0?g:p?520:600,f=Number.isFinite(g)&&g>0?g:p?520:600,w="<p>Notice how the y-coordinate of all points on the transformed graph g(x) are the <i>negative</i> of the y-coordinate on the f(x).</p><p>This is a <b>vertical reflection</b> about the x-axis.</p>",v=e.lastSubmitCorrect?"feedback-success":e.submitted&&e.lastSubmitCorrect===!1?"feedback-error":"";n.activity?.progressLabel;const A=!!e.slideExplanationOpen?.[e.currentStep];Array.isArray(e.persistedReferenceGraph)?e.persistedReferenceGraph:Array.isArray(e.persistedGraphPoints)&&e.persistedGraphPoints;const b=((o,r)=>o===1?null:Array.isArray(r.persistedReferenceGraph)&&r.persistedReferenceGraph.length>0?r.persistedReferenceGraph:Array.isArray(r.persistedGraphPoints)?r.persistedGraphPoints:null)(e.currentStep,e),I=e.currentStep>=2&&b&&b.length>0,P="−",R={x:"x",y:`${P}y`},L=e.part2Answer??{x:null,y:null},N=!!(L.x&&L.y),$=!!e.part2Correct,E=!!e.part2Submitted,C=E?{x:L.x===R.x,y:L.y===R.y}:{x:!1,y:!1},B=E&&!$?{x:L.x!==R.x,y:L.y!==R.y}:{x:!1,y:!1},x=o=>{if(!o)return"";if(o.startsWith(P)){const r=o.slice(P.length);return`<span class="math-minus">${P}</span><span class="math-var">${r}</span>`}return`<span class="math-var">${o}</span>`},M=o=>{if(o==null)return"";const r=String(o);return r.startsWith("-")?`<span class="math-minus">${P}</span><span class="math-num">${r.slice(1)}</span>`:r.startsWith(P)?`<span class="math-minus">${P}</span><span class="math-num">${r.slice(P.length)}</span>`:`<span class="math-num">${r}</span>`},z=o=>{const[r,c]=o;return`<span class="rule-math">(</span>${M(r)}<span class="rule-math">,</span> ${M(c)}<span class="rule-math">)</span>`},Q=[{value:"x",html:x("x"),group:"x"},{value:`${P}x`,html:x(`${P}x`),group:"x"},{value:"y",html:x("y"),group:"y"},{value:`${P}y`,html:x(`${P}y`),group:"y"}],Y=(o=>{const r=[];for(let m=0;m<o.length-1;m++){const[_,O]=o[m],[F,oe]=o[m+1];if(O===0&&r.push([_,0]),oe===0&&r.push([F,0]),O<0&&oe>0||O>0&&oe<0){const Ie=(0-O)/(oe-O),Be=_+Ie*(F-_),Oe=Math.round(Be*1e3)/1e3;r.push([Oe,0])}}const c=new Set;return r.filter(m=>{const _=`${m[0]},${m[1]}`;return c.has(_)?!1:(c.add(_),!0)})})(i),V=Y.map(o=>`${o[0]},${o[1]}`),k=e.part3Answer??{p1:null,p2:null,coordType:null,value:null},ke=!!(k.p1&&k.p2&&k.coordType&&k.value),Z=!!e.part3Correct,X=!!e.part3Submitted,Ae=X&&Z,J=e.showSolution&&e.lastSubmitCorrect===!1,ae=e.lastSubmitCorrect===!0,Pe=J||ae,ee=new Set(V),te=k.p1&&k.p2&&k.p1===k.p2,re=X&&!Z?{p1:!k.p1||!ee.has(k.p1)||te,p2:!k.p2||!ee.has(k.p2)||te,coordType:k.coordType!=="y-coordinate",value:k.value!=="0"}:{p1:!1,p2:!1,coordType:!1,value:!1},ne=X?{p1:!!(k.p1&&ee.has(k.p1)&&!te),p2:!!(k.p2&&ee.has(k.p2)&&!te),coordType:k.coordType==="y-coordinate",value:k.value==="0"}:{p1:!1,p2:!1,coordType:!1,value:!1},W=new Map,le=o=>{const r=`${o[0]},${o[1]}`;W.has(r)||W.set(r,z(o))};Y.forEach(le),i.forEach(le),d.forEach(o=>le([o[0],o[1]]));const Ee=["0,-1","1,0","0,1","4,0"].filter(o=>W.has(o)).map(o=>({type:"point",value:o,html:W.get(o)})),Te=[{type:"coordType",value:"x-coordinate",html:"x-coordinate"},{type:"coordType",value:"y-coordinate",html:"y-coordinate"}],Le=[{type:"value",value:"0",html:M("0")},{type:"value",value:`${P}1`,html:M(`${P}1`)}],me=`
    <div class="explanation-box success-reveal status-success ${p?"slide-compact":""}">
      <div class="status-title">Correct — nice work!</div>
      <div class="explanation-inline">
        <span class="status-text">Notice how each y-coordinate is replaced by its opposite value.</span>
        ${p?`
          <button class="slide-explanation-toggle inline" data-step="${e.currentStep}">
            ${A?"Hide explanation":"Show explanation"}
          </button>
        `:""}
      </div>
      ${p?`
        <div class="slide-explanation-text ${A?"open":""}">
          A reflection in the x-axis keeps x-values the same and multiplies y-values by ${P}1. Points on the x-axis have y = 0, so they do not move under the reflection. Therefore, the shared points are the x-intercepts, and they have the same y-coordinate, which is 0.
        </div>
      `:`A reflection in the x-axis keeps x-values the same and multiplies y-values by ${P}1. Points on the x-axis have y = 0, so they do not move under the reflection. Therefore, the shared points are the x-intercepts, and they have the same y-coordinate, which is 0.`}
      <button id="nextPartBtn" class="next-part-btn">Finish Exploration →</button>
    </div>
  `,j=([o,r])=>({x:o,y:r}),D=[];let G=`<svg id="graphSvg" width="${h}" height="${f}" viewBox="0 0 ${h} ${f}" xmlns="http://www.w3.org/2000/svg">`;if(G=pt(G,e.view,{width:h,height:f}),i.length>0){const o=i.map(j);D.push({type:"polyline",points:o,style:{stroke:"#2563eb",strokeWidth:2}}),D.push({type:"points",points:o,style:{fill:"#2563eb",r:6}})}if(!I&&u.length>1){const o=[...u].sort((r,c)=>r[0]-c[0]);D.push({type:"polyline",points:o.map(j),style:{stroke:e.submitted?e.lastSubmitCorrect?"#16a34a":"#dc2626":"#6d28d9",strokeWidth:e.submitted&&e.lastSubmitCorrect?4:3,opacity:1}})}if(!I&&u.length>0){const o=e.config.interaction?.mode||"placePoints",_=e.submitted?e.lastSubmitCorrect?"#16a34a":"#dc2626":"#6d28d9",O=e.submitted&&e.lastSubmitCorrect?4:3;o==="placePoints"?D.push({type:"points",points:u.map(j),style:{fill:_,r:6}}):u.length>1&&D.push({type:"polyline",points:u.map(j),style:{stroke:_,strokeWidth:O,opacity:.25}})}if(!I&&a.length>1){const o=new Set(a.map(m=>`${m[0]},${m[1]}`)),r=e.expectedPoints.map(j),c=e.expectedPoints.map(m=>o.has(`${m[0]},${m[1]}`));D.push({type:"polyline",points:r,segmentMask:c,style:{stroke:e.submitted?e.lastSubmitCorrect?"#16a34a":"#dc2626":"#6d28d9",strokeWidth:e.submitted&&e.lastSubmitCorrect?4:3,opacity:1}})}if(e.expectedPoints&&e.expectedPoints.length>0&&(e.submitted||I)){const o=I?b:d;if((e.showSolution||I)&&o.length>0){const r=o.map(j);D.push({type:"polyline",points:r,style:{stroke:"#16a34a",strokeWidth:5}}),D.push({type:"points",points:r,style:{fill:"#16a34a",r:6}})}}G=ut(G,D,e.view,{width:h,height:f}),G+="</svg>";const Ce=e.currentStep===2&&E&&($||e.part2ShowSolution)?" step-2-resolved":"",fe=`
    <div class="main-container step-${e.currentStep}${Ce}">
      <div class="activity-layout">
        <div class="activity-copy left-panel">
        <div class="page-heading">
          ${e.currentStep===3?"":'<div class="heading-label">Exploration 2</div>'}
          <div class="heading-title">Reflection in the <span class="nowrap">x-axis</span></div>
        </div>

        <section style="margin-bottom:18px;padding-top:8px;">
          ${e.currentStep===1?`
            ${Pe?"":`
              <div class="question-label">Question 1 (of 3)</div>
              <div class="task-instructions">Sketch the mirror image graph, <strong>y = g(x)</strong>, by clicking where the 5 connection points should be, and using the above controls.</div>
            `}
            ${e.feedback&&e.lastSubmitCorrect===!1&&!J?`
              <div id="feedback" class="graph-feedback ${v}">
                ${e.feedback}
              </div>
            `:""}
              ${e.lastSubmitCorrect||e.showSolution?`
                <div id="explanation" class="explanation-box ${e.lastSubmitCorrect||e.showSolution?"success-reveal":""} ${p?"slide-compact":""} ${J||ae?"show-solution":""}">
                  ${e.lastSubmitCorrect?`
                    <div class="status-title">${e.feedback}</div>
                  `:""}
                  ${p?J||ae?`
                    <div class="slide-explanation-text open">
                      ${w}
                    </div>
                  `:`
                    <div class="slide-explanation-text ${A?"open":""}">
                      ${w}
                    </div>
                    <button class="slide-explanation-toggle" data-step="${e.currentStep}">
                      ${A?"Hide explanation":"Show explanation"}
                    </button>
                  `:w}
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
                  <span class="rule-math">(</span>${x("x")}<span class="rule-math">,</span> ${x("y")}<span class="rule-math">)</span>
                  <span class="rule-arrow">&rarr;</span>
                  <span class="rule-math">(</span>

                  <div class="drop-stack">
                    <div class="drop-label">NEW X</div>
                    <div class="drop-zone ${L.x?"filled":""} ${C.x?"correct":""} ${B.x?"invalid shake":""}" data-slot="x" tabindex="0" role="button" aria-label="new x drop zone">
                      ${L.x?`
                        <span class="drop-value">${x(L.x)}</span>
                        <button class="drop-clear" data-slot="x" aria-label="Clear new x">&times;</button>
                      `:'<span class="drop-placeholder">drop</span>'}
                    </div>
                  </div>

                  <span class="rule-sep">,</span>

                  <div class="drop-stack">
                    <div class="drop-label">NEW Y</div>
                    <div class="drop-zone ${L.y?"filled":""} ${C.y?"correct":""} ${B.y?"invalid shake":""}" data-slot="y" tabindex="0" role="button" aria-label="new y drop zone">
                      ${L.y?`
                        <span class="drop-value">${x(L.y)}</span>
                        <button class="drop-clear" data-slot="y" aria-label="Clear new y">&times;</button>
                      `:'<span class="drop-placeholder">drop</span>'}
                    </div>
                  </div>

                  <span class="rule-math">)</span>
                </div>
              </div>

              ${E&&!$?`
                <div class="rule-hint">Check how the y-values change.</div>
              `:""}
              </div>

              ${E&&($||e.part2ShowSolution)?"":`
              <div class="token-bank">
              <div class="token-group">
                <div class="token-label">X-values</div>
                <div class="token-row">
                  ${Q.filter(o=>o.group==="x").map(o=>`
                    <div class="drag-token ${e.part2SelectedToken===o.value?"selected":""}" data-value="${o.value}" tabindex="0" role="button" aria-pressed="${e.part2SelectedToken===o.value}" draggable="true">${o.html}</div>
                  `).join("")}
                </div>
              </div>

              <div class="token-group">
                <div class="token-label">Y-values</div>
                <div class="token-row">
                  ${Q.filter(o=>o.group==="y").map(o=>`
                    <div class="drag-token ${e.part2SelectedToken===o.value?"selected":""}" data-value="${o.value}" tabindex="0" role="button" aria-pressed="${e.part2SelectedToken===o.value}" draggable="true">${o.html}</div>
                  `).join("")}
                </div>
              </div>
            </div>
              `}
            </div>

            <div class="feedback-area">
              ${E?`
                ${$?`
                  ${e.part2ShowSolution?`
                    <div class="explanation-box success-reveal solution-explanation ${p?"slide-compact":""}">
                      The mapping rule is <span class="rule-math">(</span>${x("x")}<span class="rule-math">,</span> ${x("y")}<span class="rule-math">) &rarr; (</span>${x("x")}<span class="rule-math">,</span> ${x(`${P}y`)}<span class="rule-math">)</span>.
                      <button id="nextPartBtn" class="next-part-btn">Continue to Part 3 →</button>
                    </div>
                  `:`
                    <div class="status-card success-reveal status-success ${p?"slide-compact":""}">
                      <div class="status-title">Correct — nice work!</div>
                      <div class="status-text">Notice how each y-coordinate is replaced by its opposite value.</div>
                      <button id="nextPartBtn" class="next-part-btn">Continue to Part 3 →</button>
                    </div>
                  `}
                `:`
                  <div class="status-card success-reveal status-error ${p?"slide-compact":""}">
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
                  <div class="drop-zone point-slot ${k.p1?"filled":""} ${ne.p1?"correct":""} ${re.p1?"invalid shake":""}" data-slot="p1" data-accept="point" tabindex="0" role="button" aria-label="first point drop zone">
                    ${k.p1?`
                      <span class="drop-value">${W.get(k.p1)??""}</span>
                      <button class="drop-clear" data-slot="p1" aria-label="Clear first point">&times;</button>
                    `:'<span class="drop-placeholder">drop</span>'}
                  </div>
                  <span class="rule-sep">and</span>
                  <div class="drop-zone point-slot ${k.p2?"filled":""} ${ne.p2?"correct":""} ${re.p2?"invalid shake":""}" data-slot="p2" data-accept="point" tabindex="0" role="button" aria-label="second point drop zone">
                    ${k.p2?`
                      <span class="drop-value">${W.get(k.p2)??""}</span>
                      <button class="drop-clear" data-slot="p2" aria-label="Clear second point">&times;</button>
                    `:'<span class="drop-placeholder">drop</span>'}
                  </div>
                  <span class="rule-math">.</span>
                </div>
              </div>

              <div class="mapping-line">
                <span class="rule-prefix">They have the same</span>
                <div class="math-expression">
                  <div class="drop-zone coord-slot ${k.coordType?"filled":""} ${ne.coordType?"correct":""} ${re.coordType?"invalid shake":""}" data-slot="coordType" data-accept="coordType" tabindex="0" role="button" aria-label="coordinate type drop zone">
                    ${k.coordType?`
                      <span class="drop-value">${k.coordType}</span>
                      <button class="drop-clear" data-slot="coordType" aria-label="Clear coordinate type">&times;</button>
                    `:'<span class="drop-placeholder">drop</span>'}
                  </div>
                  <span class="rule-sep">,</span>
                  <span class="rule-prefix">which is</span>
                  <div class="drop-zone value-slot ${k.value?"filled":""} ${ne.value?"correct":""} ${re.value?"invalid shake":""}" data-slot="value" data-accept="value" tabindex="0" role="button" aria-label="value drop zone">
                    ${k.value?`
                      <span class="drop-value">${M(k.value)}</span>
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
                        ${Ee.map(o=>`
                          <div class="drag-token ${e.part3SelectedToken?.value===o.value?"selected":""}" data-type="${o.type}" data-value="${o.value}" tabindex="0" role="button" aria-pressed="${e.part3SelectedToken?.value===o.value}" draggable="true">${o.html}</div>
                        `).join("")}
                      </div>
                    </div>

                    <div class="token-group">
                      <div class="token-label">Type:</div>
                      <div class="token-row">
                        ${Te.map(o=>`
                          <div class="drag-token ${e.part3SelectedToken?.value===o.value?"selected":""}" data-type="${o.type}" data-value="${o.value}" tabindex="0" role="button" aria-pressed="${e.part3SelectedToken?.value===o.value}" draggable="true">${o.html}</div>
                        `).join("")}
                      </div>
                    </div>

                    <div class="token-group">
                      <div class="token-label">Value:</div>
                      <div class="token-row">
                        ${Le.map(o=>`
                          <div class="drag-token ${e.part3SelectedToken?.value===o.value?"selected":""}" data-type="${o.type}" data-value="${o.value}" tabindex="0" role="button" aria-pressed="${e.part3SelectedToken?.value===o.value}" draggable="true">${o.html}</div>
                        `).join("")}
                      </div>
                    </div>
                  </div>
                </div>

            <div class="feedback-area">
              ${X?`
              ${Z?`
                ${p?"":me}
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
            <button id="submitBtn" class="submit-btn" ${e.currentStep===2&&!N||e.currentStep===3&&!ke?"disabled":""}>Submit</button>
            ${e.currentStep===1&&!e.showSolution&&e.lastSubmitCorrect===!1||e.currentStep===2&&E&&!$||e.currentStep===3&&X&&!Z?'<button id="solutionBtn">See Solution</button><button id="tryAgainBtn" style="margin-left:6px;">Try Again</button>':""}
          </div>
        </div>

        <div class="graph-frame">
          ${G}
          <div class="graph-label">y = f(x)</div>
          ${e.showSolution||e.lastSubmitCorrect||I?'<div class="solution-label">y = g(x)</div>':""}
        </div>

        ${p&&e.currentStep===3&&Ae?`
          <div class="graph-completion slide-q3-completion">
            ${me}
          </div>
        `:""}

        </div>
      </div>
    </div>
  `,_e=l?`
      <div class="slide-scale-root">
        <div class="slide-scale-inner">
          <div class="slide-viewport">
            <div class="slide-safe-area">
              ${fe}
            </div>
          </div>
        </div>
      </div>
    `:fe;if(s.innerHTML=_e,window.dispatchEvent(new Event("applet:rendered")),document.getElementById("undoBtn")?.addEventListener("click",()=>{if(e.currentStep===2)e.part2Answer?.y?e.part2Answer={...e.part2Answer,y:null}:e.part2Answer?.x&&(e.part2Answer={...e.part2Answer,x:null}),e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",T(e);else if(e.currentStep===3){const o=e.part3History.pop();o&&(e.part3Answer=o),e.part3SelectedToken=null,e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",T(e)}else e.undo(),T(e)}),document.getElementById("resetBtn")?.addEventListener("click",()=>{e.currentStep===2?(e.part2Answer={x:null,y:null},e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",T(e)):e.currentStep===3?(e.part3Answer={p1:null,p2:null,coordType:null,value:null},e.part3SelectedToken=null,e.part3History=[],e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",T(e)):(e.reset(),T(e))}),document.getElementById("tryAgainBtn")?.addEventListener("click",()=>{e.currentStep===2?(e.part2Answer={x:null,y:null},e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",T(e)):e.currentStep===3?(e.part3Answer={p1:null,p2:null,coordType:null,value:null},e.part3SelectedToken=null,e.part3History=[],e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",T(e)):(e.reset(),T(e))}),document.getElementById("submitBtn")?.addEventListener("click",()=>{if(e.currentStep===2){if(!e.part2Answer?.x||!e.part2Answer?.y)return;const c=e.part2Answer?.x==="x"&&e.part2Answer?.y==="−y";e.part2Submitted=!0,e.part2Correct=c,e.part2ShowSolution=!1,e.part2Feedback=c?"Correct — nice work!":'Not Correct — try again or click "See Solution".',T(e),e.currentStep!==2&&setTimeout(()=>{const m=document.querySelector(c?"#nextPartBtn":".status-card");m&&m.scrollIntoView({behavior:"smooth",block:"center"})},0);return}if(e.currentStep===3){if(!e.part3Answer?.p1||!e.part3Answer?.p2||!e.part3Answer?.coordType||!e.part3Answer?.value)return;const c=new Set(V),m=c.has(e.part3Answer.p1)&&c.has(e.part3Answer.p2)&&e.part3Answer.p1!==e.part3Answer.p2&&e.part3Answer.coordType==="y-coordinate"&&e.part3Answer.value==="0";e.part3Submitted=!0,e.part3Correct=m,e.part3ShowSolution=!1,e.part3Feedback=m?"Correct — nice work!":'Not Correct — try again or click "See Solution".',T(e),setTimeout(()=>{const _=document.querySelector(m?"#nextPartBtn":".status-card");_&&_.scrollIntoView({behavior:"smooth",block:"center"})},0);return}const o=e.config?.activityType??"transformations",r=nt(o,e,e.config);if(e.submitted=!0,e.lastSubmitCorrect=!!r?.isCorrect,e.lastSubmitCorrect){e.feedback="CORRECT - Your graph is bang on!";const c=d.map(m=>[m[0],m[1]]);e.persistedGraphPoints=c,e.persistedReferenceGraph=c.map(m=>[m[0],m[1]])}else e.feedback='<strong>Not Correct</strong> - Click "Try Again" or "See Solution".';e.lastSubmitCorrect||(e.showSolution=n.feedback.showExpectedPointsOnFail),T(e),e.lastSubmitCorrect?setTimeout(()=>{const c=document.getElementById("nextPartBtn");c&&c.scrollIntoView({behavior:"smooth",block:"center"})},0):e.currentStep!==1&&setTimeout(()=>{const c=document.getElementById("feedback");c&&c.scrollIntoView({behavior:"smooth",block:"center"})},0)}),document.getElementById("solutionBtn")?.addEventListener("click",()=>{if(e.currentStep===2){e.part2Answer={x:"x",y:"−y"},e.part2Submitted=!0,e.part2Correct=!0,e.part2ShowSolution=!0,e.part2Feedback="Correct — nice work!",T(e);return}if(e.currentStep===3){e.part3Answer={p1:V[0]??null,p2:V[1]??null,coordType:"y-coordinate",value:"0"},e.part3History=[],e.part3Submitted=!0,e.part3Correct=!0,e.part3ShowSolution=!0,e.part3Feedback="Correct — nice work!",T(e);return}e.enableSolution(),T(e),e.currentStep!==1&&setTimeout(()=>{const o=document.getElementById("nextPartBtn");o&&o.scrollIntoView({behavior:"smooth",block:"center"})},0)}),document.getElementById("nextPartBtn")?.addEventListener("click",()=>{if(e.currentStep===1){if(!e.persistedReferenceGraph){const o=d.map(r=>[r[0],r[1]]);e.persistedGraphPoints=o,e.persistedReferenceGraph=o.map(r=>[r[0],r[1]])}e.currentStep=2,e.studentPoints=[],e.orderedStudentPoints=[],e.submitted=!1,e.lastSubmitCorrect=null,e.feedback="",e.showSolution=!1,e.part2Answer={x:null,y:null},e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",e.slideExplanationOpen={...e.slideExplanationOpen,2:!1},T(e);return}if(e.currentStep===2){e.currentStep=3,e.part3Answer={p1:null,p2:null,coordType:null,value:null},e.part3SelectedToken=null,e.part3History=[],e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",e.slideExplanationOpen={...e.slideExplanationOpen,3:!1},T(e);return}e.currentStep===3&&(e.currentStep=4,e.slideExplanationOpen={...e.slideExplanationOpen,4:!1},T(e))}),document.querySelectorAll(".slide-explanation-toggle").forEach(o=>{o.addEventListener("click",()=>{const r=Number(o.dataset.step);e.slideExplanationOpen={...e.slideExplanationOpen,[r]:!e.slideExplanationOpen?.[r]},T(e)})}),e.currentStep===2){const o=(r,c)=>{e.part2Answer={...e.part2Answer,[r]:c},e.part2SelectedToken=null,e.part2Submitted=!1,e.part2Correct=null,e.part2ShowSolution=!1,e.part2Feedback="",T(e)};document.querySelectorAll(".drag-token").forEach(r=>{r.addEventListener("dragstart",c=>{r.classList.add("dragging"),c.dataTransfer?.setData("text/plain",r.dataset.value||"")}),r.addEventListener("dragend",()=>{r.classList.remove("dragging")}),r.addEventListener("click",()=>{e.part2SelectedToken=r.dataset.value||null,T(e)}),r.addEventListener("keydown",c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),e.part2SelectedToken=r.dataset.value||null,T(e))})}),document.querySelectorAll(".drop-zone").forEach(r=>{r.addEventListener("dragover",c=>{c.preventDefault(),r.classList.add("drag-over")}),r.addEventListener("dragleave",()=>{r.classList.remove("drag-over")}),r.addEventListener("drop",c=>{c.preventDefault(),r.classList.remove("drag-over");const m=c.dataTransfer?.getData("text/plain");m&&(o(r.dataset.slot,m),setTimeout(()=>{const _=document.querySelector(`.drop-zone[data-slot="${r.dataset.slot}"]`);_&&(_.classList.add("drop-success"),setTimeout(()=>_.classList.remove("drop-success"),180))},0))}),r.addEventListener("click",()=>{e.part2SelectedToken&&(o(r.dataset.slot,e.part2SelectedToken),setTimeout(()=>{const c=document.querySelector(`.drop-zone[data-slot="${r.dataset.slot}"]`);c&&(c.classList.add("drop-success"),setTimeout(()=>c.classList.remove("drop-success"),180))},0))}),r.addEventListener("keydown",c=>{(c.key==="Enter"||c.key===" ")&&e.part2SelectedToken&&(c.preventDefault(),o(r.dataset.slot,e.part2SelectedToken),setTimeout(()=>{const m=document.querySelector(`.drop-zone[data-slot="${r.dataset.slot}"]`);m&&(m.classList.add("drop-success"),setTimeout(()=>m.classList.remove("drop-success"),180))},0))})}),document.querySelectorAll(".drop-clear").forEach(r=>{r.addEventListener("click",c=>{c.stopPropagation();const m=r.dataset.slot;m&&o(m,null)})})}if(e.currentStep===3){const o=(r,c)=>{e.part3History.push({...e.part3Answer}),e.part3Answer={...e.part3Answer,[r]:c},e.part3SelectedToken=null,e.part3Submitted=!1,e.part3Correct=null,e.part3ShowSolution=!1,e.part3Feedback="",T(e)};document.querySelectorAll(".drag-token").forEach(r=>{r.addEventListener("dragstart",c=>{r.classList.add("dragging"),c.dataTransfer?.setData("text/plain",r.dataset.value||""),c.dataTransfer?.setData("text/type",r.dataset.type||"")}),r.addEventListener("dragend",()=>{r.classList.remove("dragging")}),r.addEventListener("click",()=>{e.part3SelectedToken={type:r.dataset.type,value:r.dataset.value},T(e)}),r.addEventListener("keydown",c=>{(c.key==="Enter"||c.key===" ")&&(c.preventDefault(),e.part3SelectedToken={type:r.dataset.type,value:r.dataset.value},T(e))})}),document.querySelectorAll(".drop-zone").forEach(r=>{r.addEventListener("dragover",c=>{c.preventDefault(),r.classList.add("drag-over")}),r.addEventListener("dragleave",()=>{r.classList.remove("drag-over")}),r.addEventListener("drop",c=>{c.preventDefault(),r.classList.remove("drag-over");const m=c.dataTransfer?.getData("text/plain"),_=c.dataTransfer?.getData("text/type"),O=r.dataset.accept;m&&_&&O===_&&(o(r.dataset.slot,m),setTimeout(()=>{const F=document.querySelector(`.drop-zone[data-slot="${r.dataset.slot}"]`);F&&(F.classList.add("drop-success"),setTimeout(()=>F.classList.remove("drop-success"),180))},0))}),r.addEventListener("click",()=>{if(e.part3SelectedToken){const{type:c,value:m}=e.part3SelectedToken;r.dataset.accept===c&&(o(r.dataset.slot,m),setTimeout(()=>{const O=document.querySelector(`.drop-zone[data-slot="${r.dataset.slot}"]`);O&&(O.classList.add("drop-success"),setTimeout(()=>O.classList.remove("drop-success"),180))},0))}}),r.addEventListener("keydown",c=>{if((c.key==="Enter"||c.key===" ")&&e.part3SelectedToken){c.preventDefault();const{type:m,value:_}=e.part3SelectedToken;r.dataset.accept===m&&(o(r.dataset.slot,_),setTimeout(()=>{const F=document.querySelector(`.drop-zone[data-slot="${r.dataset.slot}"]`);F&&(F.classList.add("drop-success"),setTimeout(()=>F.classList.remove("drop-success"),180))},0))}})}),document.querySelectorAll(".drop-clear").forEach(r=>{r.addEventListener("click",c=>{c.stopPropagation();const m=r.dataset.slot;m&&o(m,null)})})}e._shortcutsBound||(document.addEventListener("keydown",o=>{const r=o.key.toLowerCase();r==="enter"?document.getElementById("submitBtn")?.click():o.ctrlKey&&r==="z"&&(o.preventDefault(),e.undo(),T(e))}),e._shortcutsBound=!0)}const mt=(e,t,s)=>(e.pageState||(e.pageState={}),e.pageState[t]||(e.pageState[t]=s?s():{}),e.pageState[t]),ft=(e,t)=>e?.id??`page-${t+1}`,$e=({page:e,index:t,total:s,bodyHtml:l,footerHtml:n})=>{const i=ft(e,t),d=e?.title??`Page ${t+1}`,u=e?.subtitle??"",a=s>0?`Page ${t+1} of ${s}`:"",p=e?.showProgress!==!1,y=e?.showTitle!==!1;return`
    <section class="page-shell" data-page-id="${i}">
      <header class="page-header">
        ${p?`<div class="page-progress">${a}</div>`:""}
        ${y?`<h2 class="page-title">${d}</h2>`:""}
        ${y&&u?`<div class="page-subtitle">${u}</div>`:""}
      </header>
      <div class="page-body">
        ${l}
      </div>
      ${n?`<footer class="page-footer">${n}</footer>`:""}
    </section>
  `},xt=e=>e?.prompt?`<div class="page-prompt">${e.prompt}</div>`:"",St=e=>!e||e.length===0?"":`<ul class="page-placeholder-list">${e.map(s=>`<li>${s}</li>`).join("")}</ul>`,yt=({page:e,index:t,total:s})=>$e({page:e,index:t,total:s,bodyHtml:`<div class="page-unknown">Unknown page type: ${e?.type??"(missing)"}</div>`,footerHtml:""}),ie=e=>{const t=document.getElementById("app");if(!t)return;const s=Array.isArray(e.config?.pages)?e.config.pages:[],l=s.length,n=Math.max(0,Math.min(e.currentPageIndex??0,l-1)),i=s[n]??{type:"unknown"},d=ge(i.type);if(!d){t.innerHTML=yt({page:i,index:n,total:l});return}const u=i.id??`page-${n+1}`,a=mt(e,u,()=>d.initState?.(i)),p=`
    ${d.render({page:i,state:e,pageState:a,index:n,total:l})}
  `,y=i?.showFooter!==!1,g=y?`
    <div class="page-footer-controls">
      <button class="page-nav" data-action="prev" ${n===0?"disabled":""}>Back</button>
      <div class="page-footer-actions">
        <button class="page-reset" data-action="reset">Try Again</button>
        <button class="page-submit" data-action="submit">Submit</button>
        <button class="page-nav" data-action="next" ${n>=l-1?"disabled":""}>Next</button>
      </div>
    </div>
  `:"",f=`
    <div class="slide-scale-root">
      <div class="slide-scale-inner">
        <div class="slide-viewport">
          <div class="slide-safe-area">
            ${$e({page:i,index:n,total:l,bodyHtml:p,footerHtml:g})}
          </div>
        </div>
      </div>
    </div>
  `;t.innerHTML=f,window.dispatchEvent(new Event("applet:rendered"));const w=t.querySelector(".page-shell");d.bind?.({root:w,state:e,pageState:a,page:i,index:n,total:l});const v=A=>{const S=A==="next"?n+1:n-1;e.currentPageIndex=Math.max(0,Math.min(S,l-1)),ie(e)};y&&(w?.querySelector("[data-action='prev']")?.addEventListener("click",()=>v("prev")),w?.querySelector("[data-action='next']")?.addEventListener("click",()=>v("next")),w?.querySelector("[data-action='submit']")?.addEventListener("click",()=>{d.submit?.({root:w,state:e,pageState:a,page:i,index:n,total:l})?.rerender&&ie(e)}),w?.querySelector("[data-action='reset']")?.addEventListener("click",()=>{d.reset?.({root:w,state:e,pageState:a,page:i,index:n,total:l})?.rerender&&ie(e)}))},ht={placePoints:(e,t,s,l)=>{if(e.currentStep!==1)return;const n=e.expectedPoints.length;if(e.studentPoints.length>=n)return;const i=s.getBoundingClientRect();let d=t.clientX-i.left,u=t.clientY-i.top;const a=e.view.xmin,p=e.view.xmax,y=e.view.ymin,g=e.view.ymax;let h=i.width,f=i.height;if(s.createSVGPoint&&s.getScreenCTM){const E=s.getScreenCTM();if(E){const C=s.createSVGPoint();C.x=t.clientX,C.y=t.clientY;const B=C.matrixTransform(E.inverse());d=B.x,u=B.y;const x=s.viewBox?.baseVal;x&&x.width&&x.height&&(h=x.width,f=x.height)}}const w=a+d/h*(p-a),v=g-u/f*(g-y),A=e.config.interaction?.snapStep??1,S=[Math.round(w/A)*A,Math.round(v/A)*A],b=e.config.interaction?.hitRadiusPx??18,I=(S[0]-a)/(p-a)*h,P=(g-S[1])/(g-y)*f,R=I-d,L=P-u;Math.sqrt(R*R+L*L)>b||e.studentPoints.some(E=>E[0]===S[0]&&E[1]===S[1])||(e.studentPoints.push(S),e.orderedStudentPoints=we(e.expectedPoints,e.studentPoints),l())},drawPolyline:()=>{},dragHandles:()=>{},selectInterval:()=>{}};function vt(e,t){document.addEventListener("pointerdown",function(s){const l=document.getElementById("graphSvg");if(!l||!l.contains(s.target))return;const n=e.config.interaction?.mode||"placePoints",i=e.activityHandlers??{},d={...ht,...i};d[n]&&d[n](e,s,l,t)}),console.log("Interaction attached")}async function gt(){try{const{config:e,src:t}=await it(),s=new URLSearchParams(window.location.search),l=s.get("mode"),n=s.get("embed"),i=n==="1"||n==="true",d=n==="0"||n==="false",u=s.get("legacy")==="1"||l==="legacy",a=e?.ui?.mode??e?.mode,p=e?.ui?.publishMode===!0,y=l==="slide"||e?.slideMode===!0||a==="slide";let g=!1;try{g=window.self!==window.top}catch{g=!0}const h=!d&&(p||i||y||g);y&&(document.documentElement.classList.add("slide-mode"),document.body.classList.add("slide-mode")),p&&(document.documentElement.classList.add("publish-mode"),document.body.classList.add("publish-mode")),h&&(document.documentElement.classList.add("embed-mode"),document.body.classList.add("embed-mode"),document.querySelector(".wrap")?.classList.add("embed-viewport"));const f=document.getElementById("app"),w=e?.ui?.layout??{},v={ppt1080p:{slideWidth:"1280px",slideHeight:"720px",safePadding:"24px",contentWidth:"1200px",contentPadding:"24px",graphSize:"520px"},ppt720p:{slideWidth:"960px",slideHeight:"540px",safePadding:"18px",contentWidth:"900px",contentPadding:"18px",graphSize:"480px"},ppt4x3:{slideWidth:"1024px",slideHeight:"768px",safePadding:"20px",contentWidth:"960px",contentPadding:"20px",graphSize:"520px"}},A=w.preset,S=A&&v[A]?v[A]:null,b=S?{...S,...w}:w;f&&(f.dataset.publishMode=p?"1":"0",f.dataset.embedMode=h?"1":"0"),h&&(b.overflowPolicy="clamp"),f&&b&&(b.slideWidth&&f.style.setProperty("--slide-width",String(b.slideWidth)),b.slideHeight&&f.style.setProperty("--slide-height",String(b.slideHeight)),b.safePadding&&f.style.setProperty("--safe-padding",String(b.safePadding)),b.contentWidth&&f.style.setProperty("--content-width",String(b.contentWidth)),b.contentPadding&&f.style.setProperty("--content-padding",String(b.contentPadding)),b.graphSize&&f.style.setProperty("--graph-size",String(b.graphSize)),b.overflowPolicy&&(f.dataset.overflowPolicy=String(b.overflowPolicy)));const I=dt({config:e,src:t});I.uiMode=y?"slide":"browser";const P=($,E)=>{const C=Number.parseFloat(String($).trim());return Number.isFinite(C)?C:E},R=($,E)=>{if(!$)return;$.querySelectorAll(".page-body, .activity-copy > section, .explanation-box").forEach(B=>{B.classList.add("collapsible-section"),E?B.classList.add("collapsed"):B.classList.remove("collapsed");let x=null;const M=B.nextElementSibling;M&&M.classList.contains("collapse-toggle")&&(x=M),x||(x=document.createElement("button"),x.type="button",x.className="collapse-toggle",x.addEventListener("click",()=>{const z=B.classList.toggle("collapsed");x.textContent=z?"Show more":"Show less"}),B.insertAdjacentElement("afterend",x)),x.textContent=B.classList.contains("collapsed")?"Show more":"Show less",x.style.display=E?"inline-flex":"none"})},L=()=>{const $=document.getElementById("app");if(!$)return;const E=$.querySelector(".slide-scale-inner");if(!E)return;const C=getComputedStyle($),B=P(C.getPropertyValue("--slide-width"),1280),x=P(C.getPropertyValue("--slide-height"),720),M=$.clientWidth||window.innerWidth,z=$.clientHeight||window.innerHeight,Q=Math.min(M/B,z/x,1);E.style.setProperty("--slide-scale",String(Q));const q=$.querySelector(".slide-safe-area");if(q){const Y=q.scrollHeight>q.clientHeight||q.scrollWidth>q.clientWidth;q.classList.toggle("overflow-warning",Y);const V=$.dataset.overflowPolicy;q.classList.toggle("overflow-clamp",V==="clamp"),R(q,V==="collapse"&&Y)}},N=Array.isArray(e?.pages)&&e.pages.length>0&&!u;N?ie(I):T(I),L(),window.addEventListener("resize",L),window.addEventListener("applet:rendered",()=>{requestAnimationFrame(L)}),N||vt(I,()=>{T(I)})}catch(e){console.error(e);const t=document.getElementById("app");t&&(t.innerHTML=`<pre style="color:red;">${e.message}</pre>`)}}gt();export{vt as a,xt as b,St as c,T as r};
