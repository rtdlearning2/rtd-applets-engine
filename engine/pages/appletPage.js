// engine/pages/appletPage.js
// Page type "applet" — renders a full multi-step transformation applet
// (graph-plot + drag-drop steps) as a self-contained page within the pages system.

import { createAppState }        from "../core/state.js";
import { render }                from "../renderers/renderer.js";
import { attachGraphInteraction } from "../core/interaction.js";

/**
 * Strip page-system metadata from a page object to produce a standalone config
 * suitable for createAppState().
 */
function pageToConfig(page) {
  const { type, id, showFooter, showProgress, showTitle, ...config } = page;
  return config;
}

export const appletPage = {
  initState() {
    return { subState: null, interactionAttached: false, interactionCleanup: null };
  },

  render() {
    // The applet mounts itself into this div during bind().
    // showProgress/showTitle/showFooter should be false on the page so the
    // outer shell stays invisible (empty header, no footer).
    return `<div class="applet-page-mount"></div>`;
  },

  bind({ root, state, pageState, page }) {
    const mountEl = root.querySelector(".applet-page-mount");
    if (!mountEl) return;

    // Create the applet sub-state once per page instance (persists across re-renders).
    if (!pageState.subState) {
      const config = pageToConfig(page);
      pageState.subState = createAppState({ config, src: state.src });
      pageState.subState.uiMode = state.uiMode ?? "browser";
    }

    const subState = pageState.subState;
    const options  = { target: mountEl, wrap: false };

    render(subState, options);

    // Attach pointer/graph interaction only once (survives page re-renders).
    // Clean up any previous listener before re-attaching (guards against rebind).
    if (!pageState.interactionAttached) {
      pageState.interactionCleanup = attachGraphInteraction(subState, () => render(subState, options));
      pageState.interactionAttached = true;
    }
  }
};
