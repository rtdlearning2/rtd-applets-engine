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
    if (el) el.innerHTML = `<pre style="color:red;">${err.message}</pre>`;
  }
}

main();
