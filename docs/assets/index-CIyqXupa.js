const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./graphPlotPage-BRjmgMOJ.js","./pageTypes-s5bfgjb6.js","./dragDropFillPage-BztVO8eG.js","./pageUi-D8KbPjWU.js","./multipleChoicePage-QhbN1TdG.js","./sortOrderPage-CULfI2yf.js","./matchPairsPage-3aMdL1nq.js","./numericInputPage-sApNw7Hf.js","./tableCompletePage-BVWKZrhF.js","./trueFalseGridPage-CZjx7NYC.js","./proofStepsPage-CBMZdE0W.js","./graphIdentifyPage-C38kEnR3.js","./transformationBuilderPage-dTrrOqfT.js"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const ke="0",V={xmin:-10,xmax:10,ymin:-10,ymax:10},q={title:"",subtitle:"",instructions:"",legend:[]},z={mode:"placePoints",snapStep:1,hitRadiusPx:12};function Ae(e={}){const t=`${e?.schemaVersion??ke}`;return t==="1"?Ee(e):{...e,schemaVersion:t}}function Ee(e){const t=Le(e),n=Se(e),r=Te(e),s=Oe(e),o=Me(e),c=_e(e,n),a=o.type??e.activityType??"transformations",i=Ce(e,s),u=e.transform??o.transform;return{...e,schemaVersion:"1",view:t,ui:n,interaction:r,series:s,activity:o,grid:t,title:n.title,subtitle:n.subtitle,instructions:n.instructions,legend:n.legend,original:i,transform:u,activityType:a,...c?{pages:c}:{}}}function Le(e){const t=e.view??e.grid??V;return{xmin:D(t.xmin,V.xmin),xmax:D(t.xmax,V.xmax),ymin:D(t.ymin,V.ymin),ymax:D(t.ymax,V.ymax)}}function Se(e){const t=Q(e.ui)?e.ui:{};return{title:t.title??e.title??q.title,subtitle:t.subtitle??e.subtitle??q.subtitle,instructions:t.instructions??e.instructions??q.instructions,legend:t.legend??e.legend??q.legend}}function Te(e){const t=Q(e.interaction)?e.interaction:{};return{mode:t.mode??z.mode,snapStep:D(t.snapStep,z.snapStep),hitRadiusPx:D(t.hitRadiusPx,z.hitRadiusPx)}}function _e(e,t){if(Array.isArray(e.pages))return e.pages;if(!Ie(e))return null;const n=t?.instructions??e.instructions??"";return[{id:"p1",type:"graph-plot",title:t?.title??e.title??"Graph Task",prompt:n}]}function Ie(e){const t=e.usePages??e.pageMode,n=e.ui?.usePages??e.ui?.pageMode,r=t??n;return r===!0?!0:typeof r=="string"?r==="template"||r==="pages":!1}function Oe(e){return Array.isArray(e.series)?e.series:e.original?.points?[{id:"original",role:"original",points:e.original.points}]:[]}function Me(e){const t=Q(e.activity)?e.activity:{},n=t.type??e.activityType??"transformations";return{...t,type:n}}function Ce(e,t){if(e.original?.points)return e.original;const n=He(t),r=Ne(n);return Array.isArray(r)?{points:r}:{points:[]}}function He(e){if(!Array.isArray(e))return null;const t=["original","reference","base"];for(const n of t){const r=e.find(s=>s?.role===n||s?.id===n);if(r)return r}return e[0]??null}function Ne(e){return e?Array.isArray(e.points)?e.points:Array.isArray(e.geometry?.points)?e.geometry.points:Array.isArray(e.data?.points)?e.data.points:null:null}function D(e,t){const n=Number(e);return Number.isFinite(n)?n:t}function Q(e){return e!==null&&typeof e=="object"&&!Array.isArray(e)}const Be="modulepreload",Re=function(e,t){return new URL(e,t).href},te={},O=function(t,n,r){let s=Promise.resolve();if(n&&n.length>0){let u=function(p){return Promise.all(p.map(b=>Promise.resolve(b).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};const c=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),i=a?.nonce||a?.getAttribute("nonce");s=u(n.map(p=>{if(p=Re(p,r),p in te)return;te[p]=!0;const b=p.endsWith(".css"),m=b?'[rel="stylesheet"]':"";if(r)for(let h=c.length-1;h>=0;h--){const d=c[h];if(d.href===p&&(!b||d.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${p}"]${m}`))return;const l=document.createElement("link");if(l.rel=b?"stylesheet":Be,b||(l.as="script"),l.crossOrigin="",l.href=p,i&&l.setAttribute("nonce",i),document.head.appendChild(l),b)return new Promise((h,d)=>{l.addEventListener("load",h),l.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${p}`)))})}))}function o(c){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=c,window.dispatchEvent(a),!a.defaultPrevented)throw c}return s.then(c=>{for(const a of c||[])a.status==="rejected"&&o(a.reason);return t().catch(o)})},Y=new Map,ne={"graph-plot":()=>O(()=>import("./graphPlotPage-BRjmgMOJ.js"),__vite__mapDeps([0,1]),import.meta.url).then(e=>e.graphPlotPage),"drag-drop-fill":()=>O(()=>import("./dragDropFillPage-BztVO8eG.js"),__vite__mapDeps([2,1,3]),import.meta.url).then(e=>e.dragDropFillPage),"multiple-choice":()=>O(()=>import("./multipleChoicePage-QhbN1TdG.js"),__vite__mapDeps([4,1,3]),import.meta.url).then(e=>e.multipleChoicePage),"sort-order":()=>O(()=>import("./sortOrderPage-CULfI2yf.js"),__vite__mapDeps([5,1,3]),import.meta.url).then(e=>e.sortOrderPage),"match-pairs":()=>O(()=>import("./matchPairsPage-3aMdL1nq.js"),__vite__mapDeps([6,1,3]),import.meta.url).then(e=>e.matchPairsPage),"numeric-input":()=>O(()=>import("./numericInputPage-sApNw7Hf.js"),__vite__mapDeps([7,1,3]),import.meta.url).then(e=>e.numericInputPage),"table-complete":()=>O(()=>import("./tableCompletePage-BVWKZrhF.js"),__vite__mapDeps([8,1,3]),import.meta.url).then(e=>e.tableCompletePage),"true-false-grid":()=>O(()=>import("./trueFalseGridPage-CZjx7NYC.js"),__vite__mapDeps([9,1,3]),import.meta.url).then(e=>e.trueFalseGridPage),"proof-steps":()=>O(()=>import("./proofStepsPage-CBMZdE0W.js"),__vite__mapDeps([10,1,3]),import.meta.url).then(e=>e.proofStepsPage),"graph-identify":()=>O(()=>import("./graphIdentifyPage-C38kEnR3.js"),__vite__mapDeps([11,1,3]),import.meta.url).then(e=>e.graphIdentifyPage),"transformation-builder":()=>O(()=>import("./transformationBuilderPage-dTrrOqfT.js"),__vite__mapDeps([12,1,3]),import.meta.url).then(e=>e.transformationBuilderPage),applet:()=>O(()=>import("./appletPage-BBZJEgoV.js"),[],import.meta.url).then(e=>e.appletPage)};async function De(e){const t=[...new Set(e.map(n=>n?.type).filter(Boolean))];await Promise.all(t.filter(n=>ne[n]&&!Y.has(n)).map(n=>ne[n]().then(r=>Y.set(n,r))))}const fe=e=>Y.get(e),me=e=>Array.isArray(e)?e:[],se=e=>e!==null&&typeof e=="object"&&!Array.isArray(e),Fe={applet:()=>[],"graph-plot":()=>[],"drag-drop-fill":e=>{const t=[];if(Array.isArray(e?.tokens)||t.push("tokens must be an array"),Array.isArray(e?.blanks)||t.push("blanks must be an array"),!se(e?.correctAnswers))t.push("correctAnswers must be an object");else{const r=me(e?.blanks).filter(s=>e.correctAnswers[s]===void 0);r.length>0&&t.push(`correctAnswers missing keys: ${r.join(", ")}`)}return t},"multiple-choice":e=>{const t=[];return Array.isArray(e?.choices)||t.push("choices must be an array"),!!e?.multiSelect?Array.isArray(e?.correctIndices)||t.push("correctIndices must be an array when multiSelect is true"):e?.correctIndex===void 0&&t.push("correctIndex is required when multiSelect is false"),t},"sort-order":e=>{const t=[];return Array.isArray(e?.items)||t.push("items must be an array"),Array.isArray(e?.correctOrder)?e?.items&&e.correctOrder.length!==e.items.length&&t.push("correctOrder length must match items length"):t.push("correctOrder must be an array"),t},"match-pairs":e=>{const t=[];return Array.isArray(e?.leftItems)||t.push("leftItems must be an array"),Array.isArray(e?.rightItems)||t.push("rightItems must be an array"),se(e?.correctPairs)||t.push("correctPairs must be an object"),t},"numeric-input":e=>{const t=[];return e?.correctValue===void 0&&t.push("correctValue is required"),e?.tolerance!==void 0&&!Number.isFinite(Number(e.tolerance))&&t.push("tolerance must be a number if provided"),t},"table-complete":e=>{const t=[];return Array.isArray(e?.columns)||t.push("columns must be an array"),Array.isArray(e?.rows)||t.push("rows must be an array"),Array.isArray(e?.correctRows)||t.push("correctRows must be an array"),t},"true-false-grid":e=>{const t=[];return Array.isArray(e?.statements)||t.push("statements must be an array"),Array.isArray(e?.correctAnswers)?e?.statements&&e.correctAnswers.length!==e.statements.length&&t.push("correctAnswers length must match statements length"):t.push("correctAnswers must be an array"),t},"proof-steps":e=>{const t=[];return Array.isArray(e?.steps)||t.push("steps must be an array"),Array.isArray(e?.correctOrder)||t.push("correctOrder must be an array"),t},"graph-identify":e=>{const t=[];return Array.isArray(e?.targets)||t.push("targets must be an array"),Array.isArray(e?.correctTargets)||t.push("correctTargets must be an array"),t},"transformation-builder":e=>{const t=[];return Array.isArray(e?.operations)||t.push("operations must be an array"),Array.isArray(e?.correctOperations)||t.push("correctOperations must be an array"),t}},Ve=e=>{const t=[];return me(e?.pages).forEach((r,s)=>{const o=r?.id??`page-${s+1}`,c=r?.type;if(!c){t.push(`[${o}] missing type`);return}if(!fe(c)){t.push(`[${o}] unknown type: ${c}`);return}const i=Fe[c];i&&i(r).forEach(u=>t.push(`[${o}] ${u}`))}),t},U=e=>e!==null&&typeof e=="object"&&!Array.isArray(e),je=e=>{const t=[];if(!U(e))return["config must be an object"];const n=e?.original?.points,r=e?.series;!Array.isArray(n)&&!Array.isArray(r)&&t.push("missing original.points or series array");const s=e?.grid??e?.view;return U(s)?["xmin","xmax","ymin","ymax"].forEach(o=>{s[o]===void 0&&t.push(`grid/view missing ${o}`)}):t.push("missing grid/view settings"),U(e?.interaction)||t.push("missing interaction settings"),t},ye=new Map;function qe(e){!e||!e.activityType||ye.set(e.activityType,e)}function We(e){return ye.get(e)}const he={};function ze(e,t){typeof e!="string"||typeof t!="function"||(he[e]=t)}function Ue(e,t,n){const r=e&&he[e];return r?r(t,n):{isCorrect:!1,details:{message:"No validator registered."}}}function Ge(){return new URLSearchParams(window.location.search).get("src")}async function re(e,t){if(!e?.activityModule)return;const r=await import(new URL(e.activityModule,new URL(t,window.location.href)).href);qe(r),typeof r.validate=="function"&&ze(r.activityType,r.validate)}async function Ye(){const t=Ge()||"/applets/configs/applet-5-reflect-x.json",n=await fetch(t);if(!n.ok)throw new Error(`Could not load config (${n.status}) from ${t}`);const r=await n.json(),s=Ae(r);await re(s?.activity,t);for(const o of s?.pages??[])o?.activity?.activityModule&&await re(o.activity,t);if(await De(s?.pages??[]),Array.isArray(s?.pages)){const o=Ve(s);if(o.length>0)throw new Error(`Invalid pages config:
- ${o.join(`
- `)}`)}else{const o=je(s);if(o.length>0)throw new Error(`Invalid legacy config:
- ${o.join(`
- `)}`)}return{config:s,src:t}}console.log("validator.js loaded v1");function ge(e,t,n=0){function r(o,c){return Math.abs(o[0]-c[0])<=n&&Math.abs(o[1]-c[1])<=n}const s=[];for(const o of e){const c=t.find(a=>r(o,a));c&&s.push(c)}return s}function Xe(e,t){if(!Array.isArray(e))return[];if(!t||!t.type)return e;const n=()=>{const s=t.pivot;return Array.isArray(s)&&s.length===2?[s[0],s[1]]:[0,0]},r=([s,o],c)=>{const a=(c%360+360)%360;return a===0?[s,o]:a===90?[-o,s]:a===180?[-s,-o]:a===270?[o,-s]:[s,o]};if(t.type==="reflect_x")return e.map(([s,o])=>[s,-o]);if(t.type==="reflect_y")return e.map(([s,o])=>[-s,o]);if(t.type==="translate"){const s=Number(t.dx??0),o=Number(t.dy??0);return e.map(([c,a])=>[c+s,a+o])}if(t.type==="rotate"){const s=Number(t.angle??0),[o,c]=n();return e.map(([a,i])=>{const u=a-o,p=i-c,[b,m]=r([u,p],s);return[b+o,m+c]})}if(t.type==="scale"){const s=Number(t.sx??1),o=Number(t.sy??1);return e.map(([c,a])=>[s*c,o*a])}if(t.type==="dilate"){const s=Number(t.k??1),[o,c]=n();return e.map(([a,i])=>[o+s*(a-o),c+s*(i-c)])}return e}function Ke(e){const t=e?.applet?.steps;if(!Array.isArray(t)||t.length===0)return null;const n={};for(const r of t)n[r.id]=Je(r);return{currentStep:0,persistedGraph:null,explanationOpen:{},steps:n}}function Je(e){switch(e.type){case"graph-plot":return{submitted:!1,correct:null,showSolution:!1,feedback:""};case"drag-drop-mapping":case"drag-drop-sentences":return{answers:{},selectedToken:null,history:[],submitted:!1,correct:null,showSolution:!1,feedback:""};case"table-input":{const t={},n={};for(const[r,s]of Object.entries(e.preFilledRows??{}))t[r]=String(s),n[r]=!0;return{cellValues:t,cellCorrect:n,allCorrect:!1,submitted:!1,correct:null,feedback:""}}default:return{}}}const Ze=1;function Qe(e){const t=Number(e);return Number.isFinite(t)&&t>0?t:Ze}function et({config:e,src:t}){const n=e?.interaction??{},r=e?.feedback??{},s={...e,interaction:{...n,snapStep:Qe(n.snapStep),hitRadiusPx:n.hitRadiusPx??20},feedback:{showExpectedPointsOnFail:r.showExpectedPointsOnFail??!1,showSolutionOnFail:r.showSolutionOnFail??!1,allowHints:r.allowHints??!1}},o=s?.original?.points??[],c=s.activityType??s.activity?.type??"transformations",a=We(c),i={config:s,src:t,pageState:{},currentPageIndex:0,expectedPoints:[],studentPoints:[],orderedStudentPoints:[],activity:a??null,activityState:{},activityHandlers:null,applet:Ke(s),showSolution:!1,lastSubmitCorrect:null,feedback:"",submitted:!1,view:{xmin:s.grid?.xmin??-10,xmax:s.grid?.xmax??10,ymin:s.grid?.ymin??-10,ymax:s.grid?.ymax??10}};if(a&&typeof a.createActivityState=="function")try{const u=a.createActivityState(s,t);u&&typeof u=="object"&&(i.activityState=u,Array.isArray(u.expectedPoints)&&(i.expectedPoints=u.expectedPoints),Array.isArray(u.studentPoints)&&(i.studentPoints=u.studentPoints))}catch(u){console.error("activity.createActivityState failed:",u)}if((!Array.isArray(i.expectedPoints)||i.expectedPoints.length===0)&&(i.expectedPoints=Xe(o,s?.transform)),a&&typeof a.getInteractionHandlers=="function")try{i.activityHandlers=a.getInteractionHandlers()}catch(u){console.error("activity.getInteractionHandlers failed:",u)}return i.undo=function(){i.studentPoints.pop(),i.orderedStudentPoints=ge(i.expectedPoints,i.studentPoints),i.feedback=""},i.zoomIn=function(){const u=i.view.xmax-i.view.xmin,p=i.view.ymax-i.view.ymin,b=(i.view.xmin+i.view.xmax)/2,m=(i.view.ymin+i.view.ymax)/2;i.view.xmin=b-u*.8/2,i.view.xmax=b+u*.8/2,i.view.ymin=m-p*.8/2,i.view.ymax=m+p*.8/2},i.zoomOut=function(){const u=i.view.xmax-i.view.xmin,p=i.view.ymax-i.view.ymin,b=(i.view.xmin+i.view.xmax)/2,m=(i.view.ymin+i.view.ymax)/2;i.view.xmin=b-u*1.2/2,i.view.xmax=b+u*1.2/2,i.view.ymin=m-p*1.2/2,i.view.ymax=m+p*1.2/2},i.enableSolution=function(){i.showSolution=!0},i.clearSolution=function(){i.showSolution=!1},i.reset=function(){i.studentPoints=[],i.orderedStudentPoints=[],i.feedback="",i.showSolution=!1,i.lastSubmitCorrect=null,i.submitted=!1},i}function tt(e,t,n,r={}){const{xmin:s,xmax:o,ymin:c,ymax:a}=t,{width:i,height:u}=n,p=i/(o-s),b=u/(a-c),m=y=>(y-s)*p,l=y=>u-(y-c)*b,h=l(0),d=m(0);let f="";for(let y=Math.ceil(s);y<=Math.floor(o);y++){const g=m(y);f+=`<line x1="${g}" y1="0" x2="${g}" y2="${u}" stroke="${y===0?"#000":"#f2f2f2"}"/>`,y!==0&&(f+=`<text x="${g}" y="${h+15}" font-size="12" font-family="sans-serif" text-anchor="middle" fill="#666">${y}</text>`)}for(let y=Math.ceil(c);y<=Math.floor(a);y++){const g=l(y);f+=`<line x1="0" y1="${g}" x2="${i}" y2="${g}" stroke="${y===0?"#000":"#f2f2f2"}"/>`,y!==0&&(f+=`<text x="${d-5}" y="${g+4}" font-size="12" font-family="sans-serif" text-anchor="end" fill="#666">${y}</text>`)}return e+f}function oe(e,t){try{const n=e.replace(/\bsqrt\s*\(/g,"Math.sqrt(").replace(/\babs\s*\(/g,"Math.abs(").replace(/\bsin\s*\(/g,"Math.sin(").replace(/\bcos\s*\(/g,"Math.cos(").replace(/\btan\s*\(/g,"Math.tan(").replace(/\blog\s*\(/g,"Math.log10(").replace(/\bln\s*\(/g,"Math.log(").replace(/\^/g,"**");return new Function("x",`"use strict"; return (${n});`)(t)}catch{return NaN}}function nt(e,t,n,r){const{xmin:s,xmax:o,ymin:c,ymax:a}=n,{width:i,height:u}=r,p=i/(o-s),b=u/(a-c),m=d=>(d-s)*p,l=d=>u-(d-c)*b;let h="";for(const d of t){const f=d.style||{},y=d.label;if(d.type==="smooth-curve"){const g=d.points??[],L=f.stroke??"black",k=f.strokeWidth??2,P=f.opacity??1;if(g.length>=2){let A=`M ${m(g[0].x)} ${l(g[0].y)}`;for(let E=0;E<g.length-1;E++){const x=g[Math.max(0,E-1)],S=g[E],v=g[E+1],$=g[Math.min(g.length-1,E+2)],w=m(x.x),T=l(x.y),I=m(S.x),B=l(S.y),N=m(v.x),F=l(v.y),_=m($.x),M=l($.y),C=I+(N-w)/6,H=B+(F-T)/6,we=N-(_-I)/6,Pe=F-(M-B)/6;A+=` C ${C} ${H}, ${we} ${Pe}, ${N} ${F}`}h+=`<path d="${A}" fill="none" stroke="${L}" stroke-width="${k}" opacity="${P}" />`}continue}if(d.type==="curve"){const g=d.fn??"",L=d.samples??200,k=d.domain?.[0]??s,P=d.domain?.[1]??o,A=f.stroke??"black",E=f.strokeWidth??2,x=f.opacity??1,S=f.dashed?"5,5":"none";let v="",$=!1;for(let w=0;w<=L;w++){const T=k+w/L*(P-k),I=oe(g,T);if(!isFinite(I)||I<c-1||I>a+1){$=!1;continue}const B=m(T),N=l(I);v+=$?`L ${B} ${N} `:`M ${B} ${N} `,$=!0}if(v&&(h+=`<path d="${v.trim()}" fill="none" stroke="${A}" stroke-width="${E}" opacity="${x}" stroke-dasharray="${S}" />`),y&&v){const w=(k+P)/2,T=oe(g,w);isFinite(T)&&(h+=`<text x="${m(w)+8}" y="${l(T)}" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="${A}">${y}</text>`)}continue}if(d.type==="points"){const g=f.r??5,L=f.fill??"black";for(let k=0;k<d.points.length;k++){const P=d.points[k];h+=`<circle cx="${m(P.x)}" cy="${l(P.y)}" r="${g}" fill="${L}" />`;const A=d.labels?.[k];A&&(h+=`<text x="${m(P.x)+8}" y="${l(P.y)-6}" font-family="sans-serif" font-size="11" font-weight="600" fill="${L}">${A}</text>`)}if(y&&d.points.length>0){const k=d.points[d.points.length-1];h+=`<text x="${m(k.x)+8}" y="${l(k.y)}" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="${L}">${y}</text>`}}else if(d.type==="polyline"){const g=f.stroke??"black",L=f.strokeWidth??2,k=f.fill??"none",P=f.opacity??1,A=f.dashed?"5,5":"none";if(d.points.length>0){const E=Array.isArray(d.segmentMask)?d.segmentMask:null;if(E){let x="",S=!1;for(let v=0;v<d.points.length-1;v++){const $=d.points[v],w=d.points[v+1];!!(E[v]&&E[v+1])?S?x+=`L ${m(w.x)} ${l(w.y)} `:(x+=`M ${m($.x)} ${l($.y)} `,x+=`L ${m(w.x)} ${l(w.y)} `,S=!0):S=!1}x&&(h+=`<path d="${x.trim()}" fill="${k}" stroke="${g}" stroke-width="${L}" opacity="${P}" stroke-dasharray="${A}" />`)}else{const x=d.points.map((S,v)=>(v===0?"M":"L")+m(S.x)+" "+l(S.y)).join(" ");h+=`<path d="${x}" fill="${k}" stroke="${g}" stroke-width="${L}" opacity="${P}" stroke-dasharray="${A}" />`}if(y){const x=d.points[d.points.length-1];h+=`<text x="${m(x.x)+8}" y="${l(x.y)}" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="${g}">${y}</text>`}}}}return e+h}function st(e,t,n,r){const s=t.correct||t.showSolution,o=!!n.explanationOpen?.[e.id],c=t.correct===!0?"feedback-success":t.submitted&&t.correct===!1?"feedback-error":"";if(!s)return`
      <div class="question-label">${e.questionLabel??""}</div>
      <div class="task-instructions">${e.instructions??""}</div>
      ${t.feedback&&t.submitted&&!t.correct?`
        <div id="feedback" class="graph-feedback ${c}">${t.feedback}</div>
      `:""}
    `;const a=e.explanation??"",i=r&&!t.showSolution;return`
    <div id="explanation"
         class="explanation-box success-reveal ${r?"slide-compact":""} ${t.showSolution?"show-solution":""}">
      ${t.correct?`<div class="status-title">${t.feedback}</div>`:""}
      <div class="explanation-inline">
        ${i?`
          <button class="slide-explanation-toggle inline" data-step-id="${e.id}">
            ${o?"Hide explanation":"Show explanation"}
          </button>
        `:""}
      </div>
      <div class="slide-explanation-text ${!i||o?"open":""}">
        ${a}
      </div>
      <button id="nextPartBtn" class="next-part-btn">${e.nextLabel??"Continue →"}</button>
    </div>
  `}const R="−";function j(e){if(!e)return"";if(e.startsWith(R)){const t=e.slice(R.length);return`<span class="math-minus">${R}</span><span class="math-var">${t}</span>`}return`<span class="math-var">${e}</span>`}function X(e){if(e==null)return"";const t=String(e);return t.startsWith("-")?`<span class="math-minus">${R}</span><span class="math-num">${t.slice(1)}</span>`:t.startsWith(R)?`<span class="math-minus">${R}</span><span class="math-num">${t.slice(R.length)}</span>`:`<span class="math-num">${t}</span>`}function K(e){const[t,n]=e;return`<span class="rule-math">(</span>${X(t)}<span class="rule-math">,</span> ${X(n)}<span class="rule-math">)</span>`}function ie(e){return e.html?e.html:e.type==="point"&&e.coords?K(e.coords):j(e.value)}function rt(e,t,n){const r=t.answers??{},s=t.submitted,o=t.correct,c=t.showSolution,a=s||c,i={},u={};if(s)for(const l of e.slots){const h=r[l.id],d=e.correctAnswer[l.id];i[l.id]=h===d,u[l.id]=!o&&h!==d}const p=e.slots.map((l,h)=>{const d=r[l.id],f=i[l.id],y=u[l.id],g=`
      <div class="drop-stack">
        <div class="drop-label">${l.label??l.id.toUpperCase()}</div>
        <div class="drop-zone ${d?"filled":""} ${f?"correct":""} ${y?"invalid shake":""}"
             data-slot="${l.id}" tabindex="0" role="button"
             aria-label="${l.label??l.id} drop zone">
          ${d?`
            <span class="drop-value">${j(d)}</span>
            <button class="drop-clear" data-slot="${l.id}" aria-label="Clear ${l.label??l.id}">&times;</button>
          `:'<span class="drop-placeholder">drop</span>'}
        </div>
      </div>
    `;return h<e.slots.length-1?g+'<span class="rule-sep">,</span>':g}).join(""),b=a&&(o||c)?"":`
    <div class="token-bank">
      ${e.tokenBanks.map(l=>`
        <div class="token-group">
          <div class="token-label">${l.label}</div>
          <div class="token-row">
            ${(l.tokens??[]).map(h=>{const d=t.selectedToken?.value===h.value;return`
                <div class="drag-token ${d?"selected":""}"
                     data-value="${h.value}" data-group="${l.group??"default"}"
                     tabindex="0" role="button" aria-pressed="${d}" draggable="true">
                  ${j(h.value)}
                </div>
              `}).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;let m="";return s&&(o?m=`
        <div class="status-card success-reveal status-success ${n?"slide-compact":""}">
          <div class="status-title">Correct — nice work!</div>
          <div class="status-text">${e.successText??""}</div>
          <button id="nextPartBtn" class="next-part-btn">${e.nextLabel??"Continue →"}</button>
        </div>
      `:m=`
        <div class="status-card success-reveal status-error ${n?"slide-compact":""}">
          <div class="status-title">Not Correct — try again or click “See Solution”.</div>
        </div>
      `),`
    <div class="question-body">
      <div class="question-label">${e.questionLabel??""}</div>
      <div class="task-instructions">${e.instructions??""}</div>

      <div class="rule-card">
        <div class="mapping-line">
          <span class="rule-prefix">All points</span>
          <div class="math-expression">
            <span class="rule-math">(</span>${j("x")}<span class="rule-math">,</span> ${j("y")}<span class="rule-math">)</span>
            <span class="rule-arrow">&rarr;</span>
            <span class="rule-math">(</span>
            ${p}
            <span class="rule-math">)</span>
          </div>
        </div>
        ${s&&!o?`<div class="rule-hint">${e.hint??""}</div>`:""}
      </div>

      ${b}
    </div>

    <div class="feedback-area">
      ${m}
    </div>
  `}function ve(e){const t=new Set;return e.filter(n=>{const r=`${n[0]},${n[1]}`;return t.has(r)?!1:(t.add(r),!0)})}function ae(e){const t=[];for(let n=0;n<e.length-1;n++){const[r,s]=e[n],[o,c]=e[n+1];if(s===0&&t.push([r,0]),c===0&&t.push([o,0]),s<0&&c>0||s>0&&c<0){const a=(0-s)/(c-s),i=r+a*(o-r);t.push([Math.round(i*1e3)/1e3,0])}}return ve(t)}function ce(e){const t=[];for(let n=0;n<e.length-1;n++){const[r,s]=e[n],[o,c]=e[n+1];if(r===0&&t.push([0,s]),o===0&&t.push([0,c]),r<0&&o>0||r>0&&o<0){const a=(0-r)/(o-r),i=s+a*(c-s);t.push([0,Math.round(i*1e3)/1e3])}}return ve(t)}function ee(e,t){if(typeof t?.getInvariantPoints=="function")return t.getInvariantPoints(e);const n=e.transform?.type??"",r=e.original?.points??[];if(n==="reflect_x")return ae(r);if(n==="reflect_y")return ce(r);if(n==="scale"){const s=Number(e.transform?.sx??1),o=Number(e.transform?.sy??1);if(s!==1)return ce(r);if(o!==1)return ae(r)}return[]}function ot(e,t,n){if(!e.source)return e.tokens??[];if(e.source==="computed:invariant-points"){const s=ee(t,n).map(o=>({value:`${o[0]},${o[1]}`,type:"point",group:e.group??"point",coords:o,html:K(o)}));if(Array.isArray(e.distractors))for(const o of e.distractors){const c=`${o[0]},${o[1]}`;s.some(a=>a.value===c)||s.push({value:c,type:"point",group:e.group??"point",coords:o,html:K(o)})}return s}return e.tokens??[]}function be(e,t,n,r){if(typeof e=="string"&&e.startsWith("computed:invariant-point")){const s=ee(n,r);return new Set(s.map(c=>`${c[0]},${c[1]}`)).has(t)}return e===t}function it(e,t,n,r){for(const[o,c]of Object.entries(e.correctAnswer)){const a=t.answers[o];if(!a||!be(c,a,n,r))return!1}const s=Object.entries(e.correctAnswer).filter(([,o])=>o==="computed:invariant-point").map(([o])=>o);if(s.length>1){const o=s.map(c=>t.answers[c]);if(new Set(o).size<o.length)return!1}return!0}function at(e,t,n){const r=ee(t,n);let s=0;const o={};for(const[c,a]of Object.entries(e.correctAnswer))if(a==="computed:invariant-point"){const i=r[s++];o[c]=i?`${i[0]},${i[1]}`:null}else o[c]=a;return o}function ct(e){return e.type==="drag-drop-mapping"?e.slots.map(t=>t.id):e.type==="drag-drop-sentences"?e.sentences.flatMap(t=>t.slots.filter(n=>n.id).map(n=>n.id)):[]}function lt(e,t,n,r,s){const o=t.answers??{},c=t.submitted,a=t.correct,i={},u={};if(c){for(const[f,y]of Object.entries(e.correctAnswer)){const g=o[f];i[f]=be(y,g,n,s),u[f]=!a&&!i[f]}const d=Object.entries(e.correctAnswer).filter(([,f])=>f==="computed:invariant-point").map(([f])=>f);if(d.length>1){const f=d.map(g=>o[g]);new Set(f).size<f.length&&d.forEach(g=>{i[g]=!1,a||(u[g]=!0)})}}const p=e.tokenBanks.map(d=>({...d,resolvedTokens:ot(d,n,s)})),b=e.sentences.map(d=>{const f=d.slots.map(y=>{if(y.separator!==void 0)return`<span class="rule-sep">${y.separator}</span>`;const g=o[y.id],L=i[y.id],k=u[y.id];let P="";if(g){for(const A of p){const E=A.resolvedTokens.find(x=>x.value===g);if(E){P=ie(E);break}}P||(P=X(g))}return`
        <div class="drop-zone ${y.group?`${y.group}-slot`:""} ${g?"filled":""} ${L?"correct":""} ${k?"invalid shake":""}"
             data-slot="${y.id}" data-group="${y.group??""}"
             tabindex="0" role="button" aria-label="${y.id} drop zone">
          ${g?`
            <span class="drop-value">${P}</span>
            <button class="drop-clear" data-slot="${y.id}" aria-label="Clear ${y.id}">&times;</button>
          `:'<span class="drop-placeholder">drop</span>'}
        </div>
      `}).join("");return`
      <div class="mapping-line">
        <span class="rule-prefix">${d.prefix??""}</span>
        <div class="math-expression">
          ${f}
        </div>
        ${d.suffix?`<span class="rule-suffix">${d.suffix}</span>`:""}
      </div>
    `}).join(""),l=c&&(a||t.showSolution)?"":`
    <div class="banks-scroll">
      <div class="token-bank">
        ${p.map(d=>`
          <div class="token-group">
            <div class="token-label">${d.label??""}</div>
            <div class="token-row ${d.group==="point"?"points-grid":""}">
              ${d.resolvedTokens.map(f=>{const y=t.selectedToken?.value===f.value&&t.selectedToken?.group===(f.group??d.group);return`
                  <div class="drag-token ${y?"selected":""}"
                       data-value="${f.value}" data-group="${f.group??d.group??"default"}"
                       tabindex="0" role="button" aria-pressed="${y}" draggable="true">
                    ${ie(f)}
                  </div>
                `}).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;let h="";return c&&(a?h=`
        <div class="explanation-box success-reveal status-success ${r?"slide-compact":""}">
          <div class="status-title">Correct — nice work!</div>
          <div class="explanation-inline">
            <span class="status-text">${e.successText??""}</span>
          </div>
          <button id="nextPartBtn" class="next-part-btn">${e.nextLabel??"Continue →"}</button>
        </div>
      `:h=`
        <div class="status-card success-reveal status-error">
          <div class="status-title">Not Correct — try again or click “See Solution”.</div>
        </div>
      `),`
    <div class="q3-panel">
      <div class="question-body">
        <div class="question-label">${e.questionLabel??""}</div>
        <div class="task-instructions">${e.instructions??""}</div>

        <div class="rule-card">
          ${b}
        </div>

        ${l}

        <div class="feedback-area">
          ${h}
        </div>
      </div>
    </div>
  `}function dt(e){if(!e||typeof e!="string")return null;try{const t=e.replace(/\^/g,"**"),n=new Function("x",`with(Math){ return (${t}); }`);return n(0),n}catch{return null}}function J(e,t){const n=dt(t);if(!n)return null;try{const r=Number(n(Number(e)));return Number.isFinite(r)?r:null}catch{return null}}function ut(e,t,n){if(t.submitted&&t.correct)return`
      <div class="explanation-box success-reveal ${n?"slide-compact":""}">
        <div class="status-title">${t.feedback}</div>
        <button id="nextPartBtn" class="next-part-btn">${e.nextLabel??"Continue →"}</button>
      </div>
    `;const r=e.table?.rows??[],s=e.table?.fn??"",o=e.table?.xLabel??"x",c=e.table?.yLabel??"y",a=t.cellValues??{},i=t.cellCorrect??{},u=r.map(p=>{const b=String(p);if(J(Number(p),s)===null)return`
        <tr>
          <td class="tv-td tv-x">${p}</td>
          <td class="tv-td tv-undefined">&#x1F4A3;</td>
        </tr>
      `;const l=a[b]??"",h=i[b]===!0,d=l!==""&&i[b]===!1,f=h?`<span class="tv-value">${l}</span><span class="tv-check">✓</span>`:`<input type="number"
               class="tv-input${d?" tv-input-wrong":""}"
               data-x="${b}"
               value="${l}"
               autocomplete="off" />`;return`
      <tr>
        <td class="tv-td tv-x">${p}</td>
        <td class="tv-td tv-y${h?" tv-correct":""}${d?" tv-wrong":""}">
          ${f}
        </td>
      </tr>
    `}).join("");return`
    <div class="table-input-panel">
      <div class="question-label">${e.questionLabel??""}</div>
      <div class="task-instructions">${e.instructions??""}</div>
      <table class="values-table">
        <thead>
          <tr>
            <th class="tv-th">${o}</th>
            <th class="tv-th">${c}</th>
          </tr>
        </thead>
        <tbody>
          ${u}
        </tbody>
      </table>
    </div>
  `}function le(e,t){if(typeof t?.deriveCurve=="function")return t.deriveCurve(e);const n=e.original?.curve,r=e.transform?.type;if(!n||!r)return null;const{fn:s,domain:o}=n;if(r==="reflect_y")return{fn:s.replace(/\bx\b/g,"(-x)"),domain:[-o[1],-o[0]]};if(r==="reflect_x")return{fn:`-(${s})`,domain:[...o]};if(r==="scale"){const c=Number(e.transform?.sx??1),a=Number(e.transform?.sy??1);let i=c!==1?s.replace(/\bx\b/g,`(x/${c})`):s;return a!==1&&(i=`${a} * (${i})`),{fn:i,domain:[c*o[0],c*o[1]]}}return null}function de(e,t,n){const r=e.config,s=e.activity??null,o=r.original?.points??[],c=e.expectedPoints,a=e.studentPoints??[],i=e.orderedStudentPoints??[],u=e.applet,p=u?.persistedGraph??null,b=!!p?.length,m=([v,$])=>({x:v,y:$}),l=[],h=14;let d=`<svg id="graphSvg" width="${t}" height="${n}" viewBox="${-h} ${-h} ${t+2*h} ${n+2*h}" xmlns="http://www.w3.org/2000/svg">`;d=tt(d,e.view,{width:t,height:n});const f=u&&r.applet?.steps?.[u.currentStep]?.type==="table-input"?r.applet.steps[u.currentStep]:null,y=f?u.steps[f.id]:null,g=f?.plotAsEntered===!0,L=g?new Set((f.table?.rows??[]).map(v=>String(v))):null,k=g&&!y?.graphed,P=v=>Number.isInteger(v)?String(v):parseFloat(v.toFixed(2)).toString(),A=(v,$)=>`(${P(v)}, ${P($)})`,E=u?r.applet?.steps?.[u.currentStep]:null,x=L?o.filter(([v])=>!L.has(String(v))):o,S=r.original?.curve;if(S){if(k||l.push({type:"curve",fn:S.fn,domain:S.domain,style:{stroke:"#2563eb",strokeWidth:2}}),x.length>0){const v=x.map(([$,w])=>A($,w));l.push({type:"points",points:x.map(m),labels:v,style:{fill:"#2563eb",r:6}})}}else if(x.length>0){const v=x.map(m),$=x.map(([w,T])=>A(w,T));l.push({type:"polyline",points:v,style:{stroke:"#2563eb",strokeWidth:2}}),l.push({type:"points",points:v,labels:$,style:{fill:"#2563eb",r:6}})}if(b){const v=le(r,s);if(v)l.push({type:"curve",fn:v.fn,domain:v.domain,style:{stroke:"#16a34a",strokeWidth:3}});else{const w=p.map(m);l.push({type:"polyline",points:w,style:{stroke:"#16a34a",strokeWidth:5}})}const $=p.map(m);l.push({type:"points",points:$,style:{fill:"#16a34a",r:6}})}else{const v=u?u.steps[r.applet?.steps?.[u.currentStep]?.id]:null,$=v?.submitted??e.submitted,w=v?.correct??e.lastSubmitCorrect,T=$?w?"#16a34a":"#dc2626":"#6d28d9",I=$&&w?4:3,B=r.interaction?.mode||"placePoints",N=!!r.original?.curve;if(B==="placePoints"){if(a.length>1){const _=[...a].sort((C,H)=>C[0]-H[0]),M=r.interaction?.studentLineStyle??(N?"smooth-curve":"polyline");l.push({type:M,points:_.map(m),style:{stroke:T,strokeWidth:I,opacity:1}})}if(a.length>0){const _=a.map(([M,C])=>A(M,C));l.push({type:"points",points:a.map(m),labels:_,style:{fill:T,r:6}})}}else{if(a.length>1){const _=[...a].sort((M,C)=>M[0]-C[0]);l.push({type:"polyline",points:_.map(m),style:{stroke:T,strokeWidth:I,opacity:1}})}a.length>0&&l.push({type:"polyline",points:a.map(m),style:{stroke:T,strokeWidth:I,opacity:.25}})}if(!N&&i.length>1){const _=new Set(i.map(H=>`${H[0]},${H[1]}`)),M=c.map(m),C=c.map(H=>_.has(`${H[0]},${H[1]}`));l.push({type:"polyline",points:M,segmentMask:C,style:{stroke:T,strokeWidth:I,opacity:1}})}const F=v?.showSolution??e.showSolution;if(E?.type==="graph-plot"&&($||F)&&c.length>0){const _=le(r,s);_?l.push({type:"curve",fn:_.fn,domain:_.domain,style:{stroke:"#16a34a",strokeWidth:3}}):l.push({type:"polyline",points:c.map(m),style:{stroke:"#16a34a",strokeWidth:5}});const M=c.map(([C,H])=>A(C,H));l.push({type:"points",points:c.map(m),labels:M,style:{fill:"#16a34a",r:6}})}}if(g&&y){const v=w=>Number.isInteger(w)?String(w):parseFloat(w.toFixed(2)).toString(),$=(f.table?.rows??[]).filter(w=>y.cellCorrect?.[String(w)]===!0).map(w=>({x:Number(w),y:parseFloat(y.cellValues?.[String(w)])})).filter(w=>Number.isFinite(w.y));if($.length>0){const w=$.map(T=>`(${v(T.x)}, ${v(T.y)})`);l.push({type:"points",points:$,labels:w,style:{fill:"#2563eb",r:6}})}}return d=nt(d,l,e.view,{width:t,height:n}),d+="</svg>",d}function pt(e,t,n,r){switch(e.type){case"graph-plot":return st(e,t,n.applet,r);case"drag-drop-mapping":return rt(e,t,r);case"drag-drop-sentences":return lt(e,t,n.config,r,n.activity);case"table-input":return ut(e,t,r);default:return`<div class="question-label">Unknown step type: ${e.type}</div>`}}function xe(e,t){return ct(e).every(n=>!!t.answers?.[n])}function ft(e,t){const n=e.type==="drag-drop-mapping"||e.type==="drag-drop-sentences",r=e.type==="table-input",s=t.correct||t.showSolution,o=e.type==="graph-plot"&&s||n&&!xe(e,t)||r&&!t.allCorrect,c=r&&e.graphButtonLabel?e.graphButtonLabel:"Submit";return`
    <div class="graph-toolbar">
      <div class="controls">
        <button id="undoBtn">Undo</button>
        <button id="resetBtn">Reset</button>
        <button id="submitBtn" class="submit-btn" ${o?"disabled":""}>${c}</button>
        ${t.submitted&&!t.correct?`
          <button id="solutionBtn">See Solution</button>
          <button id="tryAgainBtn" style="margin-left:6px;">Try Again</button>
        `:""}
      </div>
    </div>
  `}function Z(e){const t=document.getElementById("app"),n=e?._legacyRenderTarget??t,r=e?._legacyWrap!==void 0?e._legacyWrap:!0;if(!n)return;const s=e.config,o=s?.applet,c=e.uiMode==="slide",a=s?.ui?.layout??{},i=Number(a.graphSize),u=Number.isFinite(i)&&i>0?i:c?520:600;if(!o?.steps?.length){const E=de(e,u,u),x=r?`<div class="slide-scale-root"><div class="slide-scale-inner"><div class="slide-viewport"><div class="slide-safe-area">${E}</div></div></div></div>`:E;n.innerHTML=x,window.dispatchEvent(new Event("applet:rendered"));return}const p=e.applet,b=o.steps,m=p.currentStep,l=b[m],h=p.steps[l.id],d=de(e,u,u),f=pt(l,h,e,c),y=ft(l,h),g=o.graphLabels??{},L=!!(p.persistedGraph?.length||l.type==="graph-plot"&&(h?.correct||h?.showSolution)),k=h.submitted&&(h.correct||h.showSolution)?" step-resolved":"",P=`
    <div class="main-container step-${m+1}${k}">
      <div class="activity-layout">

        <div class="activity-copy left-panel">
          <div class="page-heading">
            ${m===0?`<div class="heading-label">${o.progressLabel??""}</div>`:""}
            <div class="heading-title">${o.heading??""}</div>
          </div>
          <section style="margin-bottom:18px;padding-top:8px;">
            ${f}
          </section>
        </div>

        <div class="graph-column">
          ${y}
          <div class="graph-frame">
            ${d}
            <div class="graph-label">${g.original??"y = f(x)"}</div>
            ${L?`<div class="solution-label">${g.transformed??"y = g(x)"}</div>`:""}
          </div>
        </div>

      </div>
    </div>
  `,A=r?`<div class="slide-scale-root"><div class="slide-scale-inner"><div class="slide-viewport"><div class="slide-safe-area">${P}</div></div></div></div>`:P;n.innerHTML=A,window.dispatchEvent(new Event("applet:rendered")),mt(l,h,e,p,b)}function mt(e,t,n,r,s){const o=()=>Z(n);document.getElementById("undoBtn")?.addEventListener("click",()=>{if(e.type!=="table-input"){if(e.type==="graph-plot")n.undo();else{const a=t.history?.pop();a&&(t.answers=a),t.selectedToken=null,t.submitted=!1,t.correct=null}o()}});const c=()=>{e.type==="table-input"?(t.cellValues={},t.cellCorrect={},t.allCorrect=!1,t.graphed=!1,t.submitted=!1,t.correct=null,t.feedback=""):e.type==="graph-plot"?(n.reset(),t.submitted=!1,t.correct=null,t.showSolution=!1,t.feedback=""):(t.answers={},t.selectedToken=null,t.history=[],t.submitted=!1,t.correct=null,t.showSolution=!1),o()};document.getElementById("resetBtn")?.addEventListener("click",c),document.getElementById("tryAgainBtn")?.addEventListener("click",c),document.getElementById("submitBtn")?.addEventListener("click",()=>{if(e.type==="table-input"){if(!t.allCorrect)return;t.submitted=!0,t.correct=!0,t.graphed=!0,t.feedback=e.successMessage??"CORRECT!",o(),setTimeout(()=>{document.getElementById("nextPartBtn")?.scrollIntoView({behavior:"smooth",block:"center"})},0);return}if(e.type==="graph-plot"){const a=n.config?.activityType??"transformations",i=Ue(a,n,n.config);t.submitted=!0,t.correct=!!i?.isCorrect,n.lastSubmitCorrect=t.correct,t.correct?(t.feedback=e.successMessage??"CORRECT!",r.persistedGraph=n.expectedPoints.map(u=>[u[0],u[1]])):(t.feedback="<strong>Not Correct</strong> — Click “Try Again” or “See Solution”.",n.config.feedback?.showExpectedPointsOnFail&&(n.showSolution=!0)),o();return}xe(e,t)&&(t.submitted=!0,t.correct=it(e,t,n.config,n.activity),o(),setTimeout(()=>{document.querySelector(t.correct?"#nextPartBtn":".status-card")?.scrollIntoView({behavior:"smooth",block:"center"})},0))}),document.getElementById("solutionBtn")?.addEventListener("click",()=>{e.type==="graph-plot"?(n.enableSolution(),t.showSolution=!0,t.correct=!0,r.persistedGraph||(r.persistedGraph=n.expectedPoints.map(a=>[a[0],a[1]]))):(t.answers=at(e,n.config,n.activity),t.submitted=!0,t.correct=!0,t.showSolution=!0),o(),setTimeout(()=>{document.getElementById("nextPartBtn")?.scrollIntoView({behavior:"smooth",block:"center"})},0)}),document.getElementById("nextPartBtn")?.addEventListener("click",()=>{if(e.type==="graph-plot"&&!r.persistedGraph&&(r.persistedGraph=n.expectedPoints.map(i=>[i[0],i[1]])),e.type==="graph-plot"&&(n.studentPoints=[],n.orderedStudentPoints=[],n.submitted=!1,n.lastSubmitCorrect=null,n.feedback="",n.showSolution=!1),r.currentStep>=s.length-1){window.dispatchEvent(new CustomEvent("applet:page-complete"));return}r.currentStep+=1;const a=s[r.currentStep];a&&(r.explanationOpen={...r.explanationOpen,[a.id]:!1}),o()}),document.querySelectorAll(".slide-explanation-toggle").forEach(a=>{a.addEventListener("click",()=>{const i=a.dataset.stepId;r.explanationOpen={...r.explanationOpen,[i]:!r.explanationOpen?.[i]},o()})}),(e.type==="drag-drop-mapping"||e.type==="drag-drop-sentences")&&yt(t,o),e.type==="table-input"&&ht(e,t,o)}function yt(e,t){document.querySelectorAll(".drag-token").forEach(n=>{const r={value:n.dataset.value,group:n.dataset.group};n.addEventListener("click",()=>{const s=e.selectedToken?.value===r.value&&e.selectedToken?.group===r.group;e.selectedToken=s?null:{...r},t()}),n.addEventListener("keydown",s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),n.click())}),n.addEventListener("dragstart",s=>{n.classList.add("dragging"),s.dataTransfer?.setData("text/plain",JSON.stringify(r))}),n.addEventListener("dragend",()=>n.classList.remove("dragging"))}),document.querySelectorAll(".drop-zone[data-slot]").forEach(n=>{const r=s=>{const o=n.dataset.group;o&&s.group!==o||(e.history.push({...e.answers}),e.answers[n.dataset.slot]=s.value,e.selectedToken=null,e.submitted=!1,e.correct=null,t())};n.addEventListener("click",()=>{e.selectedToken&&r(e.selectedToken)}),n.addEventListener("keydown",s=>{(s.key==="Enter"||s.key===" ")&&e.selectedToken&&(s.preventDefault(),r(e.selectedToken))}),n.addEventListener("dragover",s=>s.preventDefault()),n.addEventListener("drop",s=>{s.preventDefault();try{const o=JSON.parse(s.dataTransfer?.getData("text/plain")??"{}");o.value&&r(o)}catch{}})}),document.querySelectorAll(".drop-clear").forEach(n=>{n.addEventListener("click",r=>{r.stopPropagation();const s=n.dataset.slot;s&&(e.history.push({...e.answers}),e.answers[s]=null,e.selectedToken=null,e.submitted=!1,e.correct=null,t())})})}function ht(e,t,n){const r=e.table?.rows??[],s=e.table?.fn??"";document.querySelectorAll(".tv-input").forEach(o=>{const c=()=>{const a=o.dataset.x,i=o.value.trim();if(t.cellValues[a]=i,i!==""){const u=parseFloat(i),p=J(Number(a),s);t.cellCorrect[a]=!Number.isNaN(u)&&p!==null&&Math.abs(u-p)<.001}else t.cellCorrect[a]=!1;t.allCorrect=r.every(u=>J(Number(u),s)===null||t.cellCorrect[String(u)]===!0),n()};o.addEventListener("blur",c),o.addEventListener("keydown",a=>{a.key==="Enter"&&(a.preventDefault(),o.blur())})})}const gt=(e,t,n)=>(e.pageState||(e.pageState={}),e.pageState[t]||(e.pageState[t]=n?n():{}),e.pageState[t]),vt=(e,t)=>e?.id??`page-${t+1}`,$e=({page:e,index:t,total:n,bodyHtml:r,footerHtml:s})=>{const o=vt(e,t),c=e?.title??`Page ${t+1}`,a=e?.subtitle??"",i=n>0?`Page ${t+1} of ${n}`:"",u=e?.showProgress!==!1,p=e?.showTitle!==!1;return`
    <section class="page-shell" data-page-id="${o}">
      <header class="page-header">
        ${u?`<div class="page-progress">${i}</div>`:""}
        ${p?`<h2 class="page-title">${c}</h2>`:""}
        ${p&&a?`<div class="page-subtitle">${a}</div>`:""}
      </header>
      <div class="page-body">
        ${r}
      </div>
      ${s?`<footer class="page-footer">${s}</footer>`:""}
    </section>
  `},Et=e=>e?.prompt?`<div class="page-prompt">${e.prompt}</div>`:"",Lt=e=>!e||e.length===0?"":`<ul class="page-placeholder-list">${e.map(n=>`<li>${n}</li>`).join("")}</ul>`,bt=({page:e,index:t,total:n})=>$e({page:e,index:t,total:n,bodyHtml:`<div class="page-unknown">Unknown page type: ${e?.type??"(missing)"}</div>`,footerHtml:""}),W=e=>{const t=document.getElementById("app");if(!t)return;const n=Array.isArray(e.config?.pages)?e.config.pages:[],r=n.length,s=Math.max(0,Math.min(e.currentPageIndex??0,r-1)),o=n[s]??{type:"unknown"},c=fe(o.type);if(!c){t.innerHTML=bt({page:o,index:s,total:r});return}const a=o.id??`page-${s+1}`,i=gt(e,a,()=>c.initState?.(o)),u=`
    ${c.render({page:o,state:e,pageState:i,index:s,total:r})}
  `,p=o?.showFooter!==!1,b=p?`
    <div class="page-footer-controls">
      <button class="page-nav" data-action="prev" ${s===0?"disabled":""}>Back</button>
      <div class="page-footer-actions">
        <button class="page-reset" data-action="reset">Try Again</button>
        <button class="page-submit" data-action="submit">Submit</button>
        <button class="page-nav" data-action="next" ${s>=r-1?"disabled":""}>Next</button>
      </div>
    </div>
  `:"",l=`
    <div class="slide-scale-root">
      <div class="slide-scale-inner">
        <div class="slide-viewport">
          <div class="slide-safe-area">
            ${$e({page:o,index:s,total:r,bodyHtml:u,footerHtml:b})}
          </div>
        </div>
      </div>
    </div>
  `;t.innerHTML=l,window.dispatchEvent(new Event("applet:rendered"));const h=t.querySelector(".page-shell");c.bind?.({root:h,state:e,pageState:i,page:o,index:s,total:r}),e._pageCompleteHandler&&(window.removeEventListener("applet:page-complete",e._pageCompleteHandler),delete e._pageCompleteHandler);const d=f=>{const y=f==="next"?s+1:s-1;e.currentPageIndex=Math.max(0,Math.min(y,r-1)),W(e)};s<r-1&&(e._pageCompleteHandler=()=>d("next"),window.addEventListener("applet:page-complete",e._pageCompleteHandler,{once:!0})),p&&(h?.querySelector("[data-action='prev']")?.addEventListener("click",()=>d("prev")),h?.querySelector("[data-action='next']")?.addEventListener("click",()=>d("next")),h?.querySelector("[data-action='submit']")?.addEventListener("click",()=>{c.submit?.({root:h,state:e,pageState:i,page:o,index:s,total:r})?.rerender&&W(e)}),h?.querySelector("[data-action='reset']")?.addEventListener("click",()=>{c.reset?.({root:h,state:e,pageState:i,page:o,index:s,total:r})?.rerender&&W(e)}))},xt={placePoints:(e,t,n,r)=>{if(e.applet){const x=e.config?.applet?.steps?.[e.applet.currentStep];if(!x||x.type!=="graph-plot")return}else if(e.currentStep!==1)return;const s=e.expectedPoints.length;if(e.studentPoints.length>=s)return;const o=n.getBoundingClientRect();let c=t.clientX-o.left,a=t.clientY-o.top;const i=e.view.xmin,u=e.view.xmax,p=e.view.ymin,b=e.view.ymax;let m=o.width,l=o.height;if(n.createSVGPoint&&n.getScreenCTM){const x=n.getScreenCTM();if(x){const S=n.createSVGPoint();S.x=t.clientX,S.y=t.clientY;const v=S.matrixTransform(x.inverse());c=v.x,a=v.y;const $=n.viewBox?.baseVal;$&&$.width&&$.height&&(m=$.width+2*$.x,l=$.height+2*$.y)}}const h=i+c/m*(u-i),d=b-a/l*(b-p),f=e.config.interaction?.snapStep??1,y=[Math.round(h/f)*f,Math.round(d/f)*f],g=e.config.interaction?.hitRadiusPx??18,L=(y[0]-i)/(u-i)*m,k=(b-y[1])/(b-p)*l,P=L-c,A=k-a;Math.sqrt(P*P+A*A)>g||e.studentPoints.some(x=>x[0]===y[0]&&x[1]===y[1])||(e.studentPoints.push(y),e.orderedStudentPoints=ge(e.expectedPoints,e.studentPoints),r())},drawPolyline:()=>{},dragHandles:()=>{},selectInterval:()=>{}};function $t(e,t){document.addEventListener("pointerdown",function(n){const r=document.getElementById("graphSvg");if(!r||!r.contains(n.target))return;const s=e.config.interaction?.mode||"placePoints",o=e.activityHandlers??{},c={...xt,...o};c[s]&&c[s](e,n,r,t)}),console.log("Interaction attached")}async function wt(e){const t=new URLSearchParams(window.location.search),n=t.get("mode"),r=t.get("embed"),s=r==="1"||r==="true",o=r==="0"||r==="false",c=t.get("legacy")==="1"||n==="legacy",a=e?.ui?.mode??e?.mode,i=e?.ui?.publishMode===!0,u=n==="slide"||e?.slideMode===!0||a==="slide";let p=!1;try{p=window.self!==window.top}catch{p=!0}const b=!o&&(i||s||u||p);return u&&(document.documentElement.classList.add("slide-mode"),document.body.classList.add("slide-mode")),i&&(document.documentElement.classList.add("publish-mode"),document.body.classList.add("publish-mode")),b&&(document.documentElement.classList.add("embed-mode"),document.body.classList.add("embed-mode"),document.querySelector(".wrap")?.classList.add("embed-viewport")),{forceLegacy:c,isSlideMode:u,publishMode:i,isEmbedMode:b}}const ue=(e,t)=>{const n=Number.parseFloat(String(e).trim());return Number.isFinite(n)?n:t},pe={ppt1080p:{slideWidth:"1280px",slideHeight:"720px",safePadding:"24px",contentWidth:"1200px",contentPadding:"24px",graphSize:"520px"},ppt720p:{slideWidth:"960px",slideHeight:"540px",safePadding:"18px",contentWidth:"900px",contentPadding:"18px",graphSize:"480px"},ppt4x3:{slideWidth:"1024px",slideHeight:"768px",safePadding:"20px",contentWidth:"960px",contentPadding:"20px",graphSize:"520px"}};async function Pt(e,t,n){const r=document.getElementById("app"),s=e?.ui?.layout??{},o=s.preset,c=o&&pe[o]?pe[o]:null,a=c?{...c,...s}:s;r&&(r.dataset.publishMode=t?"1":"0",r.dataset.embedMode=n?"1":"0"),n&&(a.overflowPolicy="clamp"),r&&a&&(a.slideWidth&&r.style.setProperty("--slide-width",String(a.slideWidth)),a.slideHeight&&r.style.setProperty("--slide-height",String(a.slideHeight)),a.safePadding&&r.style.setProperty("--safe-padding",String(a.safePadding)),a.contentWidth&&r.style.setProperty("--content-width",String(a.contentWidth)),a.contentPadding&&r.style.setProperty("--content-padding",String(a.contentPadding)),a.graphSize&&r.style.setProperty("--graph-size",String(a.graphSize)),a.overflowPolicy&&(r.dataset.overflowPolicy=String(a.overflowPolicy)))}const kt=(e,t)=>{if(!e)return;e.querySelectorAll(".page-body, .activity-copy > section, .explanation-box").forEach(r=>{r.classList.add("collapsible-section"),t?r.classList.add("collapsed"):r.classList.remove("collapsed");let s=null;const o=r.nextElementSibling;o&&o.classList.contains("collapse-toggle")&&(s=o),s||(s=document.createElement("button"),s.type="button",s.className="collapse-toggle",s.addEventListener("click",()=>{const c=r.classList.toggle("collapsed");s.textContent=c?"Show more":"Show less"}),r.insertAdjacentElement("afterend",s)),s.textContent=r.classList.contains("collapsed")?"Show more":"Show less",s.style.display=t?"inline-flex":"none"})},G=()=>{const e=document.getElementById("app");if(!e)return;const t=e.querySelector(".slide-scale-inner");if(!t)return;const n=getComputedStyle(e),r=ue(n.getPropertyValue("--slide-width"),1280),s=ue(n.getPropertyValue("--slide-height"),720),o=e.clientWidth||window.innerWidth,c=e.clientHeight||window.innerHeight,a=Math.min(o/r,c/s,1);t.style.setProperty("--slide-scale",String(a));const i=e.querySelector(".slide-safe-area");if(i){const u=i.scrollHeight>i.clientHeight||i.scrollWidth>i.clientWidth;i.classList.toggle("overflow-warning",u);const p=e.dataset.overflowPolicy;i.classList.toggle("overflow-clamp",p==="clamp"),kt(i,p==="collapse"&&u)}};async function At(){try{const{config:e,src:t}=await Ye(),{forceLegacy:n,isSlideMode:r,publishMode:s,isEmbedMode:o}=wt(e);Pt(e,s,o);const c=et({config:e,src:t});c.uiMode=r?"slide":"browser";const a=Array.isArray(e?.pages)&&e.pages.length>0&&!n;a?W(c):Z(c),G(),window.addEventListener("resize",G),window.addEventListener("applet:rendered",()=>{requestAnimationFrame(G)}),a||$t(c,()=>{Z(c)})}catch(e){console.error(e);const t=document.getElementById("app");t&&(t.innerHTML=`<pre style="color:red;">${e.message}</pre>`)}}At();export{$t as a,Et as b,Lt as c,et as d,Z as r};
