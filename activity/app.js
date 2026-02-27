import { loadConfigFromSrc } from "../engine/configLoader.js";
import { createAppState } from "../engine/state.js";
import { render } from "../engine/renderer.js";
import { attachGraphInteraction } from "../engine/interaction.js";

async function main() {
  try {
    const { config, src } = await loadConfigFromSrc();
    const state = createAppState({ config, src });

    // Render once initially
    render(state);

    // Attach interaction (no-op for now)
    attachGraphInteraction(state, () => {
      render(state);
    });
  } catch (err) {
    console.error(err);
    const el = document.getElementById("app");
    if (el) el.innerHTML = `<pre style="color:red;">${err.message}</pre>`;
  }
}

main();