// engine/core/appletState.js
// Initialises state.applet from config.applet.steps.
// Each step gets its own isolated state object keyed by step.id.

/**
 * Builds the applet runtime state from config.
 * Returns null if the config has no applet steps defined.
 */
export function initAppletState(config) {
  const steps = config?.applet?.steps;
  if (!Array.isArray(steps) || steps.length === 0) return null;

  const stepStates = {};
  for (const step of steps) {
    stepStates[step.id] = createStepState(step);
  }

  return {
    currentStep: 0,       // 0-based index into config.applet.steps
    persistedGraph: null, // [[x,y]…] saved after graph-plot step completes
    explanationOpen: {},  // { [stepId]: bool } for slide-mode expand/collapse
    steps: stepStates
  };
}

function createStepState(step) {
  switch (step.type) {
    case "graph-plot":
      return {
        submitted: false,
        correct: null,
        showSolution: false,
        feedback: ""
      };

    case "drag-drop-mapping":
    case "drag-drop-sentences":
      return {
        answers: {},          // { [slotId]: value }
        selectedToken: null,  // { value, group } — token awaiting placement
        history: [],          // stack of previous answers snapshots for undo
        submitted: false,
        correct: null,
        showSolution: false,
        feedback: ""
      };

    case "table-input": {
      const cellValues  = {};
      const cellCorrect = {};
      for (const [xStr, val] of Object.entries(step.preFilledRows ?? {})) {
        cellValues[xStr]  = String(val);
        cellCorrect[xStr] = true;
      }
      return {
        cellValues,
        cellCorrect,
        allCorrect:  false, // true when every fillable row has a correct value
        submitted:   false,
        correct:     null,
        feedback:    ""
      };
    }

    default:
      return {};
  }
}
