import { loadConfigFromSrc } from "../engine/core/configLoader.js";
import { createAppState } from "../engine/core/state.js";
import { render } from "../engine/renderers/renderer.js";
import { renderPageApp } from "../engine/renderers/pageRenderer.js";
import { attachGraphInteraction } from "../engine/core/interaction.js";
import { initUrlSearchParams } from "../engine/core/initURLSearchParams.js";
import {
  initLayout,
  applyLayoutConstraints,
} from "../engine/core/initLayout.js";

async function main() {
  try {
    const { config, src } = await loadConfigFromSrc();
    const { forceLegacy, isSlideMode, publishMode, isEmbedMode } =
      initUrlSearchParams(config);
    initLayout(config, publishMode, isEmbedMode);

    const state = createAppState({ config, src });
    state.uiMode = isSlideMode ? "slide" : "browser";

    const hasPages =
      Array.isArray(config?.pages) && config.pages.length > 0 && !forceLegacy;

    // Render once initially
    if (hasPages) {
      renderPageApp(state);
    } else {
      render(state);
    }

    applyLayoutConstraints();
    window.addEventListener("resize", applyLayoutConstraints);
    window.addEventListener("applet:rendered", () => {
      requestAnimationFrame(applyLayoutConstraints);
    });

    // Attach interaction (no-op for now)
    if (!hasPages) {
      attachGraphInteraction(state, () => {
        render(state);
      });
    }
  } catch (err) {
    console.error(err);
    const el = document.getElementById("app");
    if (!el) return;
    if (err.code === "NOT_FOUND") {
      el.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;min-height:200px;font-family:sans-serif;color:#dc2626;font-size:1rem;">The applet was not found.</div>`;
    } else {
      el.innerHTML = `<div style="padding:24px;font-family:sans-serif;color:#dc2626;font-size:0.875rem;"><strong>The applet could not be loaded.</strong><pre style="margin-top:12px;white-space:pre-wrap;font-size:0.8rem;">${err.message}</pre></div>`;
    }
  }
}

main();
