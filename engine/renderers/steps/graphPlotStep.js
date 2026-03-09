// engine/renderers/steps/graphPlotStep.js
// Renders the left-panel content for the graph-plot step.

/**
 * Returns the HTML for the graph-plot step's left panel.
 *
 * @param {object} step        - The step config (from config.applet.steps)
 * @param {object} stepState   - state.applet.steps[step.id]
 * @param {object} applet      - state.applet
 * @param {boolean} isSlideMode
 */
export function renderGraphPlotPanel(step, stepState, applet, isSlideMode) {
  const showingResult = stepState.correct || stepState.showSolution;
  const explanationOpen = Boolean(applet.explanationOpen?.[step.id]);
  const feedbackClass = stepState.correct === true
    ? "feedback-success"
    : (stepState.submitted && stepState.correct === false ? "feedback-error" : "");

  if (!showingResult) {
    return `
      <div class="question-label">${step.questionLabel ?? ""}</div>
      <div class="task-instructions">${step.instructions ?? ""}</div>
      ${stepState.feedback && stepState.submitted && !stepState.correct ? `
        <div id="feedback" class="graph-feedback ${feedbackClass}">${stepState.feedback}</div>
      ` : ""}
    `;
  }

  // Correct or showing solution: display explanation + next button
  const explanationHtml = step.explanation ?? "";
  const showSlideToggle = isSlideMode && !stepState.showSolution;

  return `
    <div id="explanation"
         class="explanation-box success-reveal ${isSlideMode ? "slide-compact" : ""} ${stepState.showSolution ? "show-solution" : ""}">
      ${stepState.correct ? `<div class="status-title">${stepState.feedback}</div>` : ""}
      <div class="explanation-inline">
        ${showSlideToggle ? `
          <button class="slide-explanation-toggle inline" data-step-id="${step.id}">
            ${explanationOpen ? "Hide explanation" : "Show explanation"}
          </button>
        ` : ""}
      </div>
      <div class="slide-explanation-text ${(!showSlideToggle || explanationOpen) ? "open" : ""}">
        ${explanationHtml}
      </div>
      <button id="nextPartBtn" class="next-part-btn">${step.nextLabel ?? "Continue \u2192"}</button>
    </div>
  `;
}
