// engine/interaction.js
export function attachGraphInteraction(state, onStateChange) {
  // Step 1: no interaction yet, just proof that this wires correctly.
  // Later we'll attach SVG click handlers here.
  console.log("Interaction attached", { title: state.config?.title });
}