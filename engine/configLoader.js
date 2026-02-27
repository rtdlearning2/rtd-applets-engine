// engine/state.js
export function createAppState({ config, src }) {
  return {
    config,
    src,
    studentPoints: [],
    showSolution: false,
    feedback: ""
  };
}