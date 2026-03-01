import { PAGE_TYPES } from "./pageTypes.js";
import { renderPrompt } from "./basePage.js";
import { render } from "../renderer.js";
import { attachGraphInteraction } from "../interaction.js";

export const graphPlotPage = {
  type: PAGE_TYPES.GRAPH_PLOT,
  initState: () => ({ submitted: false }),
  render: ({ page }) => {
    const promptHtml = page?.showPrompt ? renderPrompt(page) : "";
    return `
      <div class="page-graph-plot">
        ${promptHtml}
        <div class="legacy-graph-root"></div>
      </div>
    `;
  },
  bind: ({ root, state }) => {
    const target = root.querySelector(".legacy-graph-root");
    if (!target) return;
    state._legacyRenderTarget = target;
    state._legacyWrap = false;
    render(state);
    if (!state._graphPlotInteractionBound) {
      attachGraphInteraction(state, () => {
        render(state);
      });
      state._graphPlotInteractionBound = true;
    }
  }
};
