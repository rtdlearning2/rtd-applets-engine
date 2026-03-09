// engine/renderers/steps/dragDropMappingStep.js
// Renders the "mapping rule" drag-drop step:
//   All points (x, y) → (NEW_X, NEW_Y)
// where each slot is filled by dragging/clicking tokens.

import { renderMathVar } from "../mathRenderer.js";

/**
 * @param {object} step       - Step config (slots, tokenBanks, correctAnswer, etc.)
 * @param {object} stepState  - state.applet.steps[step.id]
 * @param {boolean} isSlideMode
 */
export function renderDragDropMappingPanel(step, stepState, isSlideMode) {
  const answers      = stepState.answers ?? {};
  const submitted    = stepState.submitted;
  const correct      = stepState.correct;
  const showSolution = stepState.showSolution;
  const resolved     = (submitted || showSolution);

  // Compute per-slot correctness / invalidity after submission
  const slotCorrect  = {};
  const slotInvalid  = {};
  if (submitted) {
    for (const slot of step.slots) {
      const answer   = answers[slot.id];
      const expected = step.correctAnswer[slot.id];
      slotCorrect[slot.id]  = answer === expected;
      slotInvalid[slot.id]  = !correct && answer !== expected;
    }
  }

  // Drop zones
  const zonesHtml = step.slots.map((slot, i) => {
    const answer = answers[slot.id];
    const isCorr  = slotCorrect[slot.id];
    const isInv   = slotInvalid[slot.id];
    const zone = `
      <div class="drop-stack">
        <div class="drop-label">${slot.label ?? slot.id.toUpperCase()}</div>
        <div class="drop-zone ${answer ? "filled" : ""} ${isCorr ? "correct" : ""} ${isInv ? "invalid shake" : ""}"
             data-slot="${slot.id}" tabindex="0" role="button"
             aria-label="${slot.label ?? slot.id} drop zone">
          ${answer ? `
            <span class="drop-value">${renderMathVar(answer)}</span>
            <button class="drop-clear" data-slot="${slot.id}" aria-label="Clear ${slot.label ?? slot.id}">&times;</button>
          ` : `<span class="drop-placeholder">drop</span>`}
        </div>
      </div>
    `;
    // Add comma separator between slots
    return i < step.slots.length - 1 ? zone + `<span class="rule-sep">,</span>` : zone;
  }).join("");

  // Token banks (hidden once solved)
  const bankHtml = (resolved && (correct || showSolution)) ? "" : `
    <div class="token-bank">
      ${step.tokenBanks.map(bank => `
        <div class="token-group">
          <div class="token-label">${bank.label}</div>
          <div class="token-row">
            ${(bank.tokens ?? []).map(t => {
              const sel = stepState.selectedToken?.value === t.value;
              return `
                <div class="drag-token ${sel ? "selected" : ""}"
                     data-value="${t.value}" data-group="${bank.group ?? "default"}"
                     tabindex="0" role="button" aria-pressed="${sel}" draggable="true">
                  ${renderMathVar(t.value)}
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `).join("")}
    </div>
  `;

  // Feedback area
  let feedbackHtml = "";
  if (submitted) {
    if (correct) {
      feedbackHtml = `
        <div class="status-card success-reveal status-success ${isSlideMode ? "slide-compact" : ""}">
          <div class="status-title">Correct \u2014 nice work!</div>
          <div class="status-text">${step.successText ?? ""}</div>
          <button id="nextPartBtn" class="next-part-btn">${step.nextLabel ?? "Continue \u2192"}</button>
        </div>
      `;
    } else {
      feedbackHtml = `
        <div class="status-card success-reveal status-error ${isSlideMode ? "slide-compact" : ""}">
          <div class="status-title">Not Correct \u2014 try again or click \u201CSee Solution\u201D.</div>
        </div>
      `;
    }
  }

  return `
    <div class="question-body">
      <div class="question-label">${step.questionLabel ?? ""}</div>
      <div class="task-instructions">${step.instructions ?? ""}</div>

      <div class="rule-card">
        <div class="mapping-line">
          <span class="rule-prefix">All points</span>
          <div class="math-expression">
            <span class="rule-math">(</span>${renderMathVar("x")}<span class="rule-math">,</span> ${renderMathVar("y")}<span class="rule-math">)</span>
            <span class="rule-arrow">&rarr;</span>
            <span class="rule-math">(</span>
            ${zonesHtml}
            <span class="rule-math">)</span>
          </div>
        </div>
        ${submitted && !correct ? `<div class="rule-hint">${step.hint ?? ""}</div>` : ""}
      </div>

      ${bankHtml}
    </div>

    <div class="feedback-area">
      ${feedbackHtml}
    </div>
  `;
}
