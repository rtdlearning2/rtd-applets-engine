// engine/renderers/steps/dragDropSentencesStep.js
// Renders a "fill-in-the-blank sentences" drag-drop step.
// Each sentence is made of prefixes, drop-zone slots, separators, and a suffix.
// Token banks can be explicit or computed (via resolveTokenBank).

import { renderMathNum, renderTokenHtml } from "../mathRenderer.js";
import { resolveTokenBank, isCorrectSlotValue } from "../../core/computedTokens.js";

/**
 * @param {object}  step       - Step config (sentences, tokenBanks, correctAnswer)
 * @param {object}  stepState  - state.applet.steps[step.id]
 * @param {object}  config     - Full app config (needed for computed tokens)
 * @param {boolean} isSlideMode
 * @param {object}  [activity] - Loaded activity module (for computed-token hooks)
 */
export function renderDragDropSentencesPanel(step, stepState, config, isSlideMode, activity) {
  const answers      = stepState.answers ?? {};
  const submitted    = stepState.submitted;
  const correct      = stepState.correct;

  // Per-slot correctness flags
  const slotCorrect = {};
  const slotInvalid = {};
  if (submitted) {
    for (const [slotId, correctValue] of Object.entries(step.correctAnswer)) {
      const answer = answers[slotId];
      slotCorrect[slotId] = isCorrectSlotValue(correctValue, answer, config, activity);
      slotInvalid[slotId] = !correct && !slotCorrect[slotId];
    }
    // Cross-slot: duplicate invariant-point answers are invalid
    const invariantSlots = Object.entries(step.correctAnswer)
      .filter(([, v]) => v === "computed:invariant-point")
      .map(([k]) => k);
    if (invariantSlots.length > 1) {
      const vals = invariantSlots.map(k => answers[k]);
      const hasDup = new Set(vals).size < vals.length;
      if (hasDup) {
        invariantSlots.forEach(k => {
          slotCorrect[k] = false;
          if (!correct) slotInvalid[k] = true;
        });
      }
    }
  }

  // Resolved token banks (handles "source: computed:invariant-points")
  const resolvedBanks = step.tokenBanks.map(bank => ({
    ...bank,
    resolvedTokens: resolveTokenBank(bank, config, activity)
  }));

  // Build sentences HTML
  const sentencesHtml = step.sentences.map(sentence => {
    const partsHtml = sentence.slots.map(part => {
      if (part.separator !== undefined) {
        return `<span class="rule-sep">${part.separator}</span>`;
      }
      const answer  = answers[part.id];
      const isCorr  = slotCorrect[part.id];
      const isInv   = slotInvalid[part.id];

      // Resolve display html for the placed token
      let valueHtml = "";
      if (answer) {
        // Find token in banks to get its html
        for (const bank of resolvedBanks) {
          const token = bank.resolvedTokens.find(t => t.value === answer);
          if (token) { valueHtml = renderTokenHtml(token); break; }
        }
        if (!valueHtml) valueHtml = renderMathNum(answer);
      }

      return `
        <div class="drop-zone ${part.group ? `${part.group}-slot` : ""} ${answer ? "filled" : ""} ${isCorr ? "correct" : ""} ${isInv ? "invalid shake" : ""}"
             data-slot="${part.id}" data-group="${part.group ?? ""}"
             tabindex="0" role="button" aria-label="${part.id} drop zone">
          ${answer ? `
            <span class="drop-value">${valueHtml}</span>
            <button class="drop-clear" data-slot="${part.id}" aria-label="Clear ${part.id}">&times;</button>
          ` : `<span class="drop-placeholder">drop</span>`}
        </div>
      `;
    }).join("");

    return `
      <div class="mapping-line">
        <span class="rule-prefix">${sentence.prefix ?? ""}</span>
        <div class="math-expression">
          ${partsHtml}
        </div>
        ${sentence.suffix ? `<span class="rule-suffix">${sentence.suffix}</span>` : ""}
      </div>
    `;
  }).join("");

  // Token banks (hidden once solved)
  const resolved = submitted && (correct || stepState.showSolution);
  const banksHtml = resolved ? "" : `
    <div class="banks-scroll">
      <div class="token-bank">
        ${resolvedBanks.map(bank => `
          <div class="token-group">
            <div class="token-label">${bank.label ?? ""}</div>
            <div class="token-row ${bank.group === "point" ? "points-grid" : ""}">
              ${bank.resolvedTokens.map(t => {
                const sel = stepState.selectedToken?.value === t.value
                         && stepState.selectedToken?.group === (t.group ?? bank.group);
                return `
                  <div class="drag-token ${sel ? "selected" : ""}"
                       data-value="${t.value}" data-group="${t.group ?? bank.group ?? "default"}"
                       tabindex="0" role="button" aria-pressed="${sel}" draggable="true">
                    ${renderTokenHtml(t)}
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  // Feedback area
  let feedbackHtml = "";
  if (submitted) {
    if (correct) {
      feedbackHtml = `
        <div class="explanation-box success-reveal status-success ${isSlideMode ? "slide-compact" : ""}">
          <div class="status-title">Correct \u2014 nice work!</div>
          <div class="explanation-inline">
            <span class="status-text">${step.successText ?? ""}</span>
          </div>
          <button id="nextPartBtn" class="next-part-btn">${step.nextLabel ?? "Continue \u2192"}</button>
        </div>
      `;
    } else {
      feedbackHtml = `
        <div class="status-card success-reveal status-error">
          <div class="status-title">Not Correct \u2014 try again or click \u201CSee Solution\u201D.</div>
        </div>
      `;
    }
  }

  return `
    <div class="q3-panel">
      <div class="question-body">
        <div class="question-label">${step.questionLabel ?? ""}</div>
        <div class="task-instructions">${step.instructions ?? ""}</div>

        <div class="rule-card">
          ${sentencesHtml}
        </div>

        ${banksHtml}

        <div class="feedback-area">
          ${feedbackHtml}
        </div>
      </div>
    </div>
  `;
}
