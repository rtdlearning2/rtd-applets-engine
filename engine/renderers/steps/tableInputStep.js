// engine/renderers/steps/tableInputStep.js
// Renders a "fill-in-the-table" step.
// Student types y-values; each cell is validated against table.fn.
// The submit ("Graph") button enables when every cell is correct.

// ─── Expression evaluator ─────────────────────────────────────────────────────

function compileExpr(expr) {
  if (!expr || typeof expr !== "string") return null;
  try {
    // Replace ^ with ** so "x^2" is treated as exponentiation, not XOR
    const jsExpr = expr.replace(/\^/g, "**");
    // eslint-disable-next-line no-new-func
    const fn = new Function("x", `with(Math){ return (${jsExpr}); }`);
    fn(0); // smoke-test
    return fn;
  } catch {
    return null;
  }
}

/**
 * Evaluates table.fn at a given x.
 * Returns the numeric result, or null on error.
 */
export function evaluateTableFn(x, expr) {
  const fn = compileExpr(expr);
  if (!fn) return null;
  try {
    const y = Number(fn(Number(x)));
    return Number.isFinite(y) ? y : null;
  } catch {
    return null;
  }
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

/**
 * @param {object}  step       - Step config (table, instructions, successMessage, …)
 * @param {object}  stepState  - state.applet.steps[step.id]
 * @param {boolean} isSlideMode
 */
export function renderTableInputPanel(step, stepState, isSlideMode) {
  // ── Completed state ────────────────────────────────────────────────────────
  if (stepState.submitted && stepState.correct) {
    return `
      <div class="explanation-box success-reveal ${isSlideMode ? "slide-compact" : ""}">
        <div class="status-title">${stepState.feedback}</div>
        <button id="nextPartBtn" class="next-part-btn">${step.nextLabel ?? "Continue \u2192"}</button>
      </div>
    `;
  }

  // ── Active state ───────────────────────────────────────────────────────────
  const rows       = step.table?.rows    ?? [];
  const fnExpr     = step.table?.fn      ?? "";
  const xLabel     = step.table?.xLabel  ?? "x";
  const yLabel     = step.table?.yLabel  ?? "y";
  const cellValues  = stepState.cellValues  ?? {};
  const cellCorrect = stepState.cellCorrect ?? {};

  const rowsHtml = rows.map(x => {
    const xStr       = String(x);
    const expectedVal = evaluateTableFn(Number(x), fnExpr);

    // Undefined row — fn has no value at this x (e.g. 1/0)
    if (expectedVal === null) {
      return `
        <tr>
          <td class="tv-td tv-x">${x}</td>
          <td class="tv-td tv-undefined">&#x1F4A3;</td>
        </tr>
      `;
    }

    const val     = cellValues[xStr]  ?? "";
    const correct = cellCorrect[xStr] === true;
    const wrong   = val !== "" && cellCorrect[xStr] === false;

    const cellContent = correct
      ? `<span class="tv-value">${val}</span><span class="tv-check">\u2713</span>`
      : `<input type="number"
               class="tv-input${wrong ? " tv-input-wrong" : ""}"
               data-x="${xStr}"
               value="${val}"
               autocomplete="off" />`;

    return `
      <tr>
        <td class="tv-td tv-x">${x}</td>
        <td class="tv-td tv-y${correct ? " tv-correct" : ""}${wrong ? " tv-wrong" : ""}">
          ${cellContent}
        </td>
      </tr>
    `;
  }).join("");

  return `
    <div class="table-input-panel">
      <div class="question-label">${step.questionLabel ?? ""}</div>
      <div class="task-instructions">${step.instructions ?? ""}</div>
      <table class="values-table">
        <thead>
          <tr>
            <th class="tv-th">${xLabel}</th>
            <th class="tv-th">${yLabel}</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}
