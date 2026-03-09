import{P as e}from"./pageTypes-s5bfgjb6.js";import{r as a,a as p,b as n}from"../index.js";import"./transformEngine-DHgD_C_F.js";const g={type:e.GRAPH_PLOT,initState:()=>({submitted:!1}),render:({page:o})=>`
      <div class="page-graph-plot">
        ${o?.showPrompt?n(o):""}
        <div class="legacy-graph-root"></div>
      </div>
    `,bind:({root:o,state:r})=>{const t=o.querySelector(".legacy-graph-root");t&&(r._legacyRenderTarget=t,r._legacyWrap=!1,a(r),r._graphPlotInteractionBound||(p(r,()=>{a(r)}),r._graphPlotInteractionBound=!0))}};export{g as graphPlotPage};
