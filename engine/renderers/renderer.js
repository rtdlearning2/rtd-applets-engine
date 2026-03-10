// engine/renderers/renderer.js
// Orchestrator: delegates SVG building to svgBuilder.js, dispatches step panels,
// renders the toolbar, and owns all event-handler attachment.
// Supports targeted partial re-renders (graph / panel / toolbar) to avoid
// rebuilding the full DOM on every minor state change.

import { validate }                      from "../core/validatorRegistry.js";
import { buildSvg }                      from "./svgBuilder.js";
import { renderGraphPlotPanel }          from "./steps/graphPlotStep.js";
import { renderDragDropMappingPanel }    from "./steps/dragDropMappingStep.js";
import { renderDragDropSentencesPanel }  from "./steps/dragDropSentencesStep.js";
import { renderTableInputPanel, evaluateTableFn } from "./steps/tableInputStep.js";
import {
  validateDragDropAnswers,
  resolveSolutionAnswers,
  getStepSlotIds
} from "../core/computedTokens.js";

// ─── Utility helpers ──────────────────────────────────────────────────────────

function getSize(state) {
  const isSlideMode = state.uiMode === "slide";
  const graphSize   = Number(state.config?.ui?.layout?.graphSize);
  return Number.isFinite(graphSize) && graphSize > 0 ? graphSize : (isSlideMode ? 520 : 600);
}

function wrapInSlide(html) {
  return `<div class="slide-scale-root"><div class="slide-scale-inner"><div class="slide-viewport"><div class="slide-safe-area">${html}</div></div></div></div>`;
}

// ─── Step panel dispatcher ────────────────────────────────────────────────────

function renderStepPanel(step, stepState, state, isSlideMode) {
  switch (step.type) {
    case "graph-plot":
      return renderGraphPlotPanel(step, stepState, state.applet, isSlideMode);
    case "drag-drop-mapping":
      return renderDragDropMappingPanel(step, stepState, isSlideMode);
    case "drag-drop-sentences":
      return renderDragDropSentencesPanel(step, stepState, state.config, isSlideMode, state.activity);
    case "table-input":
      return renderTableInputPanel(step, stepState, isSlideMode);
    default:
      return `<div class="question-label">Unknown step type: ${step.type}</div>`;
  }
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function allSlotsFilled(step, stepState) {
  return getStepSlotIds(step).every(id => Boolean(stepState.answers?.[id]));
}

/** Returns the toolbar's inner content (the .graph-toolbar wrapper lives in the shell). */
function renderToolbarContent(step, stepState) {
  const isDragDrop    = step.type === "drag-drop-mapping" || step.type === "drag-drop-sentences";
  const isTableInput  = step.type === "table-input";
  // Phase 3a: hide Undo for table-input (cells are edited directly; no undo stack)
  const showUndo      = step.type !== "table-input";
  const showingResult = stepState.correct || stepState.showSolution;

  const submitDisabled =
    (step.type === "graph-plot" && showingResult) ||
    (isDragDrop   && !allSlotsFilled(step, stepState)) ||
    (isTableInput && !stepState.allCorrect);

  const submitLabel = (isTableInput && step.graphButtonLabel) ? step.graphButtonLabel : "Submit";

  return `
    <div class="controls">
      ${showUndo ? `<button id="undoBtn">Undo</button>` : ""}
      <button id="resetBtn">Reset</button>
      <button id="submitBtn" class="submit-btn" ${submitDisabled ? "disabled" : ""}>${submitLabel}</button>
      ${stepState.submitted && !stepState.correct ? `
        <button id="solutionBtn">See Solution</button>
        <button id="tryAgainBtn" style="margin-left:6px;">Try Again</button>
      ` : ""}
    </div>
  `;
}

// ─── Graph frame inner HTML ───────────────────────────────────────────────────

function renderGraphContent(state, size) {
  const appletConfig   = state.config?.applet;
  const applet         = state.applet;
  const step           = appletConfig?.steps?.[applet?.currentStep ?? 0];
  const stepState      = applet?.steps?.[step?.id] ?? {};
  const graphLabels    = appletConfig?.graphLabels ?? {};
  const showTransLabel = Boolean(
    applet?.persistedGraph?.length ||
    (step?.type === "graph-plot" && (stepState?.correct || stepState?.showSolution))
  );

  return buildSvg(state, size, size)
    + `<div class="graph-label">${graphLabels.original ?? "y = f(x)"}</div>`
    + (showTransLabel ? `<div class="solution-label">${graphLabels.transformed ?? "y = g(x)"}</div>` : "");
}

// ─── Partial re-render ────────────────────────────────────────────────────────

/**
 * Targeted update: replaces only the requested sub-trees within an already-rendered applet.
 * @param {object}   state
 * @param {string[]} parts  — any combination of "graph" | "panel" | "toolbar"
 * @param {object}   options — same options passed to render()
 */
function patchRender(state, parts, options) {
  const target      = options.target ?? document.getElementById("app");
  const applet      = state.applet;
  const config      = state.config;
  const steps       = config?.applet?.steps ?? [];
  const stepIdx     = applet?.currentStep ?? 0;
  const step        = steps[stepIdx];
  const stepState   = applet?.steps?.[step?.id] ?? {};
  const isSlideMode = state.uiMode === "slide";
  const size        = getSize(state);

  if (parts.includes("graph")) {
    const el = target.querySelector("#applet-graph");
    if (el) el.innerHTML = renderGraphContent(state, size);
  }

  if (parts.includes("panel") && step) {
    const el = target.querySelector("#applet-panel");
    if (el) {
      el.innerHTML = renderStepPanel(step, stepState, state, isSlideMode);
      attachPanelHandlers(step, stepState, state, applet, steps, options);
    }
  }

  if (parts.includes("toolbar") && step) {
    const el = target.querySelector("#applet-toolbar");
    if (el) {
      el.innerHTML = renderToolbarContent(step, stepState);
      attachToolbarHandlers(step, stepState, state, applet, steps, options);
    }
  }
}

// ─── Main render entry point ──────────────────────────────────────────────────

/**
 * Full render. Replaces the target's entire innerHTML.
 * @param {object} state
 * @param {object} [options]
 * @param {Element} [options.target]  — mount element; defaults to #app
 * @param {boolean} [options.wrap]    — wrap in slide-scale shell; defaults to true
 */
export function render(state, options = {}) {
  const target      = options.target ?? document.getElementById("app");
  const wrap        = options.wrap   ?? true;
  if (!target) return;

  const config       = state.config;
  const appletConfig = config?.applet;
  const isSlideMode  = state.uiMode === "slide";
  const size         = getSize(state);

  // ── Non-applet fallback: render the SVG graph only ───────────────────────
  if (!appletConfig?.steps?.length) {
    const svgHtml = buildSvg(state, size, size);
    target.innerHTML = wrap ? wrapInSlide(svgHtml) : svgHtml;
    window.dispatchEvent(new Event("applet:rendered"));
    return;
  }

  // ── Applet mode ───────────────────────────────────────────────────────────
  const applet    = state.applet;
  const steps     = appletConfig.steps;
  const stepIdx   = applet.currentStep;
  const step      = steps[stepIdx];
  const stepState = applet.steps[step.id];

  const stepPanelHtml  = renderStepPanel(step, stepState, state, isSlideMode);
  const toolbarContent = renderToolbarContent(step, stepState);
  const graphContent   = renderGraphContent(state, size);

  const resolvedClass = stepState.submitted && (stepState.correct || stepState.showSolution)
    ? " step-resolved" : "";

  const contentHtml = `
    <div class="main-container step-${stepIdx + 1}${resolvedClass}">
      <div class="activity-layout">

        <div class="activity-copy left-panel">
          <div class="page-heading">
            ${stepIdx === 0 ? `<div class="heading-label">${appletConfig.progressLabel ?? ""}</div>` : ""}
            <div class="heading-title">${appletConfig.heading ?? ""}</div>
          </div>
          <section id="applet-panel" style="margin-bottom:18px;padding-top:8px;">
            ${stepPanelHtml}
          </section>
        </div>

        <div class="graph-column">
          <div class="graph-toolbar" id="applet-toolbar">
            ${toolbarContent}
          </div>
          <div class="graph-frame" id="applet-graph">
            ${graphContent}
          </div>
        </div>

      </div>
    </div>
  `;

  target.innerHTML = wrap ? wrapInSlide(contentHtml) : contentHtml;
  window.dispatchEvent(new Event("applet:rendered"));

  attachToolbarHandlers(step, stepState, state, applet, steps, options);
  attachPanelHandlers(step, stepState, state, applet, steps, options);
}

// ─── Toolbar event handlers ───────────────────────────────────────────────────

function attachToolbarHandlers(step, stepState, state, applet, steps, options) {
  const PT  = () => patchRender(state, ["panel", "toolbar"], options);
  const GPT = () => patchRender(state, ["graph", "panel", "toolbar"], options);
  const GT  = () => patchRender(state, ["graph", "toolbar"], options);

  // Undo — graph-plot undoes last placed point; drag-drop pops history
  document.getElementById("undoBtn")?.addEventListener("click", () => {
    if (step.type === "graph-plot") {
      state.undo();
      GT();
    } else {
      const prev = stepState.history?.pop();
      if (prev) stepState.answers = prev;
      stepState.selectedToken = null;
      stepState.submitted     = false;
      stepState.correct       = null;
      PT();
    }
  });

  // Reset + Try Again share the same logic
  const doReset = () => {
    if (step.type === "table-input") {
      stepState.cellValues  = {};
      stepState.cellCorrect = {};
      stepState.allCorrect  = false;
      stepState.graphed     = false;
      stepState.submitted   = false;
      stepState.correct     = null;
      stepState.feedback    = "";
      GPT();
    } else if (step.type === "graph-plot") {
      state.reset();
      stepState.submitted    = false;
      stepState.correct      = null;
      stepState.showSolution = false;
      stepState.feedback     = "";
      GT();
    } else {
      stepState.answers       = {};
      stepState.selectedToken = null;
      stepState.history       = [];
      stepState.submitted     = false;
      stepState.correct       = null;
      stepState.showSolution  = false;
      PT();
    }
  };
  document.getElementById("resetBtn")?.addEventListener("click",    doReset);
  document.getElementById("tryAgainBtn")?.addEventListener("click", doReset);

  // Submit
  document.getElementById("submitBtn")?.addEventListener("click", () => {
    if (step.type === "table-input") {
      if (!stepState.allCorrect) return;
      stepState.submitted = true;
      stepState.correct   = true;
      stepState.graphed   = true;
      stepState.feedback  = step.successMessage ?? "CORRECT!";
      GPT();
      requestAnimationFrame(() => {
        document.getElementById("nextPartBtn")?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      return;
    }

    if (step.type === "graph-plot") {
      const activityType = state.config?.activityType ?? "transformations";
      const result       = validate(activityType, state, state.config);
      stepState.submitted     = true;
      stepState.correct       = Boolean(result?.isCorrect);
      state.lastSubmitCorrect = stepState.correct;
      if (stepState.correct) {
        stepState.feedback    = step.successMessage ?? "CORRECT!";
        applet.persistedGraph = state.expectedPoints.map(p => [p[0], p[1]]);
      } else {
        stepState.feedback = `<strong>Not Correct</strong> \u2014 Click \u201CTry Again\u201D or \u201CSee Solution\u201D.`;
        if (state.config.feedback?.showExpectedPointsOnFail) state.showSolution = true;
      }
      GPT();
      return;
    }

    // Drag-drop steps
    if (!allSlotsFilled(step, stepState)) return;
    stepState.submitted = true;
    stepState.correct   = validateDragDropAnswers(step, stepState, state.config, state.activity);
    PT();
    requestAnimationFrame(() => {
      const target = document.querySelector(stepState.correct ? "#nextPartBtn" : ".status-card");
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // See Solution
  document.getElementById("solutionBtn")?.addEventListener("click", () => {
    if (step.type === "graph-plot") {
      state.enableSolution();
      stepState.showSolution = true;
      stepState.correct      = true;
      if (!applet.persistedGraph) {
        applet.persistedGraph = state.expectedPoints.map(p => [p[0], p[1]]);
      }
    } else {
      stepState.answers      = resolveSolutionAnswers(step, state.config, state.activity);
      stepState.submitted    = true;
      stepState.correct      = true;
      stepState.showSolution = true;
    }
    GPT();
    requestAnimationFrame(() => {
      document.getElementById("nextPartBtn")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

// ─── Panel event handlers ─────────────────────────────────────────────────────

function attachPanelHandlers(step, stepState, state, applet, steps, options) {
  // Next Part / next page
  document.getElementById("nextPartBtn")?.addEventListener("click", () => {
    if (step.type === "graph-plot" && !applet.persistedGraph) {
      applet.persistedGraph = state.expectedPoints.map(p => [p[0], p[1]]);
    }
    if (step.type === "graph-plot") {
      state.studentPoints        = [];
      state.orderedStudentPoints = [];
      state.submitted            = false;
      state.lastSubmitCorrect    = null;
      state.feedback             = "";
      state.showSolution         = false;
    }
    // Last step — signal the outer page system to advance
    if (applet.currentStep >= steps.length - 1) {
      window.dispatchEvent(new CustomEvent("applet:page-complete"));
      return;
    }
    applet.currentStep += 1;
    const nextStep = steps[applet.currentStep];
    if (nextStep) applet.explanationOpen = { ...applet.explanationOpen, [nextStep.id]: false };
    render(state, options); // full re-render on step change
  });

  // Slide explanation toggles
  document.querySelectorAll(".slide-explanation-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const sid = btn.dataset.stepId;
      applet.explanationOpen = { ...applet.explanationOpen, [sid]: !applet.explanationOpen?.[sid] };
      patchRender(state, ["panel"], options);
    });
  });

  // Drag-drop interaction
  if (step.type === "drag-drop-mapping" || step.type === "drag-drop-sentences") {
    attachDragDropHandlers(stepState, () => patchRender(state, ["panel", "toolbar"], options));
  }

  // Table-input cell interaction (graph also updates as dots appear)
  if (step.type === "table-input") {
    attachTableInputHandlers(step, stepState, () => patchRender(state, ["graph", "panel", "toolbar"], options));
  }
}

// ─── Generic drag-drop token/zone interaction ─────────────────────────────────

function attachDragDropHandlers(stepState, renderFn) {
  document.querySelectorAll(".drag-token").forEach(token => {
    const tokenData = { value: token.dataset.value, group: token.dataset.group };

    token.addEventListener("click", () => {
      const alreadySelected =
        stepState.selectedToken?.value === tokenData.value &&
        stepState.selectedToken?.group === tokenData.group;
      stepState.selectedToken = alreadySelected ? null : { ...tokenData };
      renderFn();
    });

    token.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); token.click(); }
    });

    token.addEventListener("dragstart", e => {
      token.classList.add("dragging");
      e.dataTransfer?.setData("text/plain", JSON.stringify(tokenData));
    });
    token.addEventListener("dragend", () => token.classList.remove("dragging"));
  });

  document.querySelectorAll(".drop-zone[data-slot]").forEach(zone => {
    const placeToken = tokenData => {
      const zoneGroup = zone.dataset.group;
      if (zoneGroup && tokenData.group !== zoneGroup) return;
      stepState.history.push({ ...stepState.answers });
      stepState.answers[zone.dataset.slot] = tokenData.value;
      stepState.selectedToken = null;
      stepState.submitted     = false;
      stepState.correct       = null;
      renderFn();
    };

    zone.addEventListener("click", () => {
      if (stepState.selectedToken) placeToken(stepState.selectedToken);
    });
    zone.addEventListener("keydown", e => {
      if ((e.key === "Enter" || e.key === " ") && stepState.selectedToken) {
        e.preventDefault();
        placeToken(stepState.selectedToken);
      }
    });
    zone.addEventListener("dragover", e => e.preventDefault());
    zone.addEventListener("drop", e => {
      e.preventDefault();
      try {
        const data = JSON.parse(e.dataTransfer?.getData("text/plain") ?? "{}");
        if (data.value) placeToken(data);
      } catch { /* ignore malformed drag data */ }
    });
  });

  document.querySelectorAll(".drop-clear").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const slot = btn.dataset.slot;
      if (!slot) return;
      stepState.history.push({ ...stepState.answers });
      stepState.answers[slot] = null;
      stepState.selectedToken = null;
      stepState.submitted     = false;
      stepState.correct       = null;
      renderFn();
    });
  });
}

// ─── Table-input cell interaction ─────────────────────────────────────────────

function attachTableInputHandlers(step, stepState, renderFn) {
  const rows   = step.table?.rows ?? [];
  const fnExpr = step.table?.fn   ?? "";

  document.querySelectorAll(".tv-input").forEach(input => {
    const validateCell = () => {
      const xStr  = input.dataset.x;
      const raw   = input.value.trim();
      stepState.cellValues[xStr] = raw;

      if (raw !== "") {
        const student  = parseFloat(raw);
        const expected = evaluateTableFn(Number(xStr), fnExpr);
        stepState.cellCorrect[xStr] =
          !Number.isNaN(student) &&
          expected !== null &&
          Math.abs(student - expected) < 0.001;
      } else {
        stepState.cellCorrect[xStr] = false;
      }

      stepState.allCorrect = rows.every(x =>
        evaluateTableFn(Number(x), fnExpr) === null || stepState.cellCorrect[String(x)] === true
      );
      renderFn();
    };

    input.addEventListener("blur",    validateCell);
    input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); input.blur(); } });
  });
}
