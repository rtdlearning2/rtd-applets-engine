import{P as e}from"./pageTypes-s5bfgjb6.js";import{r as a,a as n,b as p}from"./index-jMcgm5iu.js";const c={type:e.GRAPH_PLOT,initState:()=>({submitted:!1}),render:({page:o})=>`
      <div class="page-graph-plot">
        ${o?.showPrompt?p(o):""}
        <div class="legacy-graph-root"></div>
      </div>
    `,bind:({root:o,state:r})=>{const t=o.querySelector(".legacy-graph-root");t&&(r._legacyRenderTarget=t,r._legacyWrap=!1,a(r),r._graphPlotInteractionBound||(n(r,()=>{a(r)}),r._graphPlotInteractionBound=!0))}};export{c as graphPlotPage};
