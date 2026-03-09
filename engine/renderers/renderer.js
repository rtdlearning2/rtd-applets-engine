// engine/renderers/renderer.js
// Config-driven coordinator: reads config.applet.steps, delegates rendering
// to per-step modules, and owns all event-handler attachment.

import { validate }                      from "../core/validatorRegistry.js";
import { renderGrid }                    from "./gridRenderer.js";
import { renderSeries }                  from "./seriesRenderer.js";
import { renderGraphPlotPanel }          from "./steps/graphPlotStep.js";
import { renderDragDropMappingPanel }    from "./steps/dragDropMappingStep.js";
import { renderDragDropSentencesPanel }  from "./steps/dragDropSentencesStep.js";
import { renderTableInputPanel, evaluateTableFn } from "./steps/tableInputStep.js";
import {
  validateDragDropAnswers,
  resolveSolutionAnswers,
  getStepSlotIds
} from "../core/computedTokens.js";

// ─── SVG builder ─────────────────────────────────────────────────────────────

/**
 * Derives the transformed curve config from original.curve + transform.
 * If the activity module exports deriveCurve, that is called first.
 * Returns { fn, domain } or null if not applicable.
 */
function deriveReflectedCurve(config, activity) {
  // Activity hook takes priority — new transforms live entirely in the activity module
  if (typeof activity?.deriveCurve === "function") {
    return activity.deriveCurve(config);
  }
  // Built-in fallback for known transform types
  const curve     = config.original?.curve;
  const transform = config.transform?.type;
  if (!curve || !transform) return null;
  const { fn, domain } = curve;
  if (transform === "reflect_y") {
    return { fn: fn.replace(/\bx\b/g, "(-x)"), domain: [-domain[1], -domain[0]] };
  }
  if (transform === "reflect_x") {
    return { fn: `-(${fn})`, domain: [...domain] };
  }
  if (transform === "scale") {
    const sx = Number(config.transform?.sx ?? 1);
    const sy = Number(config.transform?.sy ?? 1);
    let derivedFn = sx !== 1 ? fn.replace(/\bx\b/g, `(x/${sx})`) : fn;
    if (sy !== 1) derivedFn = `${sy} * (${derivedFn})`;
    return { fn: derivedFn, domain: [sx * domain[0], sx * domain[1]] };
  }
  return null;
}

function buildSvg(state, width, height) {
  const config               = state.config;
  const activity             = state.activity ?? null;
  const originalPoints       = config.original?.points ?? [];
  const expectedPoints       = state.expectedPoints;
  const rawStudentPoints     = state.studentPoints       ?? [];
  const orderedStudentPoints = state.orderedStudentPoints ?? [];

  const applet         = state.applet;
  const persistedGraph = applet?.persistedGraph ?? null;
  const showPersisted  = Boolean(persistedGraph?.length);

  const toObj      = ([x, y]) => ({ x, y });
  const seriesList = [];

  const svgPad = 14; // extra pixels on each side so edge dots aren't clipped
  let svg = `<svg id="graphSvg" width="${width}" height="${height}" viewBox="${-svgPad} ${-svgPad} ${width + 2 * svgPad} ${height + 2 * svgPad}" xmlns="http://www.w3.org/2000/svg">`;
  svg = renderGrid(svg, state.view, { width, height });

  // Resolve the active table-input step (if any) early — used by both the
  // original-series suppression logic and the plotAsEntered block below.
  const tableStepCfg = (applet && config.applet?.steps?.[applet.currentStep]?.type === "table-input")
    ? config.applet.steps[applet.currentStep]
    : null;
  const tableStepState = tableStepCfg ? applet.steps[tableStepCfg.id] : null;
  const isPlotAsEntered = tableStepCfg?.plotAsEntered === true;
  // During a plotAsEntered step, suppress only original points whose x is a table row
  // (those are managed by the plotAsEntered block). Non-table points stay visible.
  const tableRowSet = isPlotAsEntered
    ? new Set((tableStepCfg.table?.rows ?? []).map(r => String(r)))
    : null;
  const hideOriginalCurve = isPlotAsEntered && !tableStepState?.graphed;

  // Coordinate label formatter — integers clean, decimals up to 2dp with no trailing zeros
  const fmtCoord = n => Number.isInteger(n) ? String(n) : parseFloat(n.toFixed(2)).toString();
  const ptLabel  = (x, y) => `(${fmtCoord(x)}, ${fmtCoord(y)})`;

  // Current step config — used by the solution overlay guard below
  const currentStepCfg = applet ? config.applet?.steps?.[applet.currentStep] : null;

  // Filter original points: during plotAsEntered, suppress only the table-row x-values
  // (those appear via the plotAsEntered block as typed). Non-table points stay visible.
  const visibleOriginalPoints = tableRowSet
    ? originalPoints.filter(([x]) => !tableRowSet.has(String(x)))
    : originalPoints;

  const originalCurve = config.original?.curve;
  if (originalCurve) {
    // Continuous curve + discrete key points (e.g. Applet 6: √x − 2)
    if (!hideOriginalCurve) {
      seriesList.push({ type: "curve", fn: originalCurve.fn, domain: originalCurve.domain, style: { stroke: "#2563eb", strokeWidth: 2 } });
    }
    if (visibleOriginalPoints.length > 0) {
      const origLabels = visibleOriginalPoints.map(([x, y]) => ptLabel(x, y));
      seriesList.push({ type: "points", points: visibleOriginalPoints.map(toObj), labels: origLabels, style: { fill: "#2563eb", r: 6 } });
    }
  } else if (visibleOriginalPoints.length > 0) {
    const pts      = visibleOriginalPoints.map(toObj);
    const ptLabels = visibleOriginalPoints.map(([x, y]) => ptLabel(x, y));
    seriesList.push({ type: "polyline", points: pts, style: { stroke: "#2563eb", strokeWidth: 2 } });
    seriesList.push({ type: "points",   points: pts, labels: ptLabels, style: { fill: "#2563eb", r: 6 } });
  }

  if (showPersisted) {
    // Persisted graph from a completed graph-plot step
    const reflectedCurve = deriveReflectedCurve(config, activity);
    if (reflectedCurve) {
      seriesList.push({ type: "curve", fn: reflectedCurve.fn, domain: reflectedCurve.domain, style: { stroke: "#16a34a", strokeWidth: 3 } });
    } else {
      const pts = persistedGraph.map(toObj);
      seriesList.push({ type: "polyline", points: pts, style: { stroke: "#16a34a", strokeWidth: 5 } });
    }
    const pts = persistedGraph.map(toObj);
    seriesList.push({ type: "points", points: pts, style: { fill: "#16a34a", r: 6 } });
  } else {
    // Active graph-plot step: live student attempt
    const stepState = applet
      ? applet.steps[config.applet?.steps?.[applet.currentStep]?.id]
      : null;
    const submitted = stepState?.submitted ?? state.submitted;
    const correct   = stepState?.correct   ?? state.lastSubmitCorrect;

    const studentColor = !submitted ? "#6d28d9" : (correct ? "#16a34a" : "#dc2626");
    const strokeWidth  = !submitted ? 3 : (correct ? 4 : 3);
    const mode = config.interaction?.mode || "placePoints";

    const isCurveApplet = Boolean(config.original?.curve);

    if (mode === "placePoints") {
      // Connecting line through placed points (sorted left-to-right by x).
      // Curve applets use a Catmull-Rom spline for a smooth preview.
      if (rawStudentPoints.length > 1) {
        const sorted     = [...rawStudentPoints].sort((a, b) => a[0] - b[0]);
        const lineType   = isCurveApplet ? "smooth-curve" : "polyline";
        seriesList.push({ type: lineType, points: sorted.map(toObj), style: { stroke: studentColor, strokeWidth, opacity: 1 } });
      }
      if (rawStudentPoints.length > 0) {
        const stuLabels = rawStudentPoints.map(([x, y]) => ptLabel(x, y));
        seriesList.push({ type: "points", points: rawStudentPoints.map(toObj), labels: stuLabels, style: { fill: studentColor, r: 6 } });
      }
    } else {
      if (rawStudentPoints.length > 1) {
        const sorted = [...rawStudentPoints].sort((a, b) => a[0] - b[0]);
        seriesList.push({ type: "polyline", points: sorted.map(toObj), style: { stroke: studentColor, strokeWidth, opacity: 1 } });
      }
      if (rawStudentPoints.length > 0) {
        seriesList.push({ type: "polyline", points: rawStudentPoints.map(toObj), style: { stroke: studentColor, strokeWidth, opacity: 0.25 } });
      }
    }

    // Clean ordered polyline (masked to matched vertices) — linear applets only
    if (!isCurveApplet && orderedStudentPoints.length > 1) {
      const matchedLookup = new Set(orderedStudentPoints.map(p => `${p[0]},${p[1]}`));
      const cleanPts  = expectedPoints.map(toObj);
      const cleanMask = expectedPoints.map(p => matchedLookup.has(`${p[0]},${p[1]}`));
      seriesList.push({ type: "polyline", points: cleanPts, segmentMask: cleanMask, style: { stroke: studentColor, strokeWidth, opacity: 1 } });
    }

    // Solution overlay: only for graph-plot steps (table-input/drag-drop must not trigger this)
    const showSolution = stepState?.showSolution ?? state.showSolution;
    if (currentStepCfg?.type === "graph-plot" && (submitted || showSolution) && expectedPoints.length > 0) {
      const reflectedCurve = deriveReflectedCurve(config, activity);
      if (reflectedCurve) {
        seriesList.push({ type: "curve", fn: reflectedCurve.fn, domain: reflectedCurve.domain, style: { stroke: "#16a34a", strokeWidth: 3 } });
      } else {
        seriesList.push({ type: "polyline", points: expectedPoints.map(toObj), style: { stroke: "#16a34a", strokeWidth: 5 } });
      }
      const solLabels = expectedPoints.map(([x, y]) => ptLabel(x, y));
      seriesList.push({ type: "points", points: expectedPoints.map(toObj), labels: solLabels, style: { fill: "#16a34a", r: 6 } });
    }
  }

  // Table-input: plot correctly entered values on the graph as they're filled in
  if (isPlotAsEntered && tableStepState) {
    const fmtN = n => Number.isInteger(n) ? String(n) : parseFloat(n.toFixed(2)).toString();
    const tablePts = (tableStepCfg.table?.rows ?? [])
      .filter(x => tableStepState.cellCorrect?.[String(x)] === true)
      .map(x => ({ x: Number(x), y: parseFloat(tableStepState.cellValues?.[String(x)]) }))
      .filter(p => Number.isFinite(p.y));
    if (tablePts.length > 0) {
      const labels = tablePts.map(p => `(${fmtN(p.x)}, ${fmtN(p.y)})`);
      seriesList.push({ type: "points", points: tablePts, labels, style: { fill: "#2563eb", r: 6 } });
    }
  }

  svg = renderSeries(svg, seriesList, state.view, { width, height });
  svg += "</svg>";
  return svg;
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

function renderToolbar(step, stepState) {
  const isDragDrop    = step.type === "drag-drop-mapping" || step.type === "drag-drop-sentences";
  const isTableInput  = step.type === "table-input";
  const showingResult = stepState.correct || stepState.showSolution;
  const submitDisabled =
    (step.type === "graph-plot" && showingResult) ||
    (isDragDrop   && !allSlotsFilled(step, stepState)) ||
    (isTableInput && !stepState.allCorrect);

  const submitLabel = (isTableInput && step.graphButtonLabel) ? step.graphButtonLabel : "Submit";

  return `
    <div class="graph-toolbar">
      <div class="controls">
        <button id="undoBtn">Undo</button>
        <button id="resetBtn">Reset</button>
        <button id="submitBtn" class="submit-btn" ${submitDisabled ? "disabled" : ""}>${submitLabel}</button>
        ${stepState.submitted && !stepState.correct ? `
          <button id="solutionBtn">See Solution</button>
          <button id="tryAgainBtn" style="margin-left:6px;">Try Again</button>
        ` : ""}
      </div>
    </div>
  `;
}

// ─── Main render entry point ──────────────────────────────────────────────────

export function render(state) {
  const container    = document.getElementById("app");
  const renderTarget = state?._legacyRenderTarget ?? container;
  const wrapLegacy   = state?._legacyWrap !== undefined ? state._legacyWrap : true;
  if (!renderTarget) return;

  const config       = state.config;
  const appletConfig = config?.applet;
  const isSlideMode  = state.uiMode === "slide";
  const layout       = config?.ui?.layout ?? {};
  const graphSize    = Number(layout.graphSize);
  const size = Number.isFinite(graphSize) && graphSize > 0
    ? graphSize : (isSlideMode ? 520 : 600);

  // ── Non-applet fallback: just render the SVG graph ───────────────────────
  if (!appletConfig?.steps?.length) {
    const svgHtml = buildSvg(state, size, size);
    const html = wrapLegacy
      ? `<div class="slide-scale-root"><div class="slide-scale-inner"><div class="slide-viewport"><div class="slide-safe-area">${svgHtml}</div></div></div></div>`
      : svgHtml;
    renderTarget.innerHTML = html;
    window.dispatchEvent(new Event("applet:rendered"));
    return;
  }

  // ── Applet mode ───────────────────────────────────────────────────────────
  const applet    = state.applet;
  const steps     = appletConfig.steps;
  const stepIdx   = applet.currentStep;
  const step      = steps[stepIdx];
  const stepState = applet.steps[step.id];

  const svgHtml       = buildSvg(state, size, size);
  const stepPanelHtml = renderStepPanel(step, stepState, state, isSlideMode);
  const toolbarHtml   = renderToolbar(step, stepState);

  const graphLabels    = appletConfig.graphLabels ?? {};
  const showTransLabel = Boolean(
    applet.persistedGraph?.length ||
    (step.type === "graph-plot" && (stepState?.correct || stepState?.showSolution))
  );

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
          <section style="margin-bottom:18px;padding-top:8px;">
            ${stepPanelHtml}
          </section>
        </div>

        <div class="graph-column">
          ${toolbarHtml}
          <div class="graph-frame">
            ${svgHtml}
            <div class="graph-label">${graphLabels.original ?? "y = f(x)"}</div>
            ${showTransLabel ? `<div class="solution-label">${graphLabels.transformed ?? "y = g(x)"}</div>` : ""}
          </div>
        </div>

      </div>
    </div>
  `;

  const wrappedHtml = wrapLegacy
    ? `<div class="slide-scale-root"><div class="slide-scale-inner"><div class="slide-viewport"><div class="slide-safe-area">${contentHtml}</div></div></div></div>`
    : contentHtml;

  renderTarget.innerHTML = wrappedHtml;
  window.dispatchEvent(new Event("applet:rendered"));

  attachHandlers(step, stepState, state, applet, steps);
}

// ─── Event handler attachment ─────────────────────────────────────────────────

function attachHandlers(step, stepState, state, applet, steps) {
  const renderFn = () => render(state);

  // Undo
  document.getElementById("undoBtn")?.addEventListener("click", () => {
    if (step.type === "table-input") return; // cells are edited directly; no undo stack
    if (step.type === "graph-plot") {
      state.undo();
    } else {
      const prev = stepState.history?.pop();
      if (prev) stepState.answers = prev;
      stepState.selectedToken = null;
      stepState.submitted     = false;
      stepState.correct       = null;
    }
    renderFn();
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
    } else if (step.type === "graph-plot") {
      state.reset();
      stepState.submitted    = false;
      stepState.correct      = null;
      stepState.showSolution = false;
      stepState.feedback     = "";
    } else {
      stepState.answers       = {};
      stepState.selectedToken = null;
      stepState.history       = [];
      stepState.submitted     = false;
      stepState.correct       = null;
      stepState.showSolution  = false;
    }
    renderFn();
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
      renderFn();
      setTimeout(() => {
        document.getElementById("nextPartBtn")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
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
      renderFn();
      return;
    }

    if (!allSlotsFilled(step, stepState)) return;
    stepState.submitted = true;
    stepState.correct   = validateDragDropAnswers(step, stepState, state.config, state.activity);
    renderFn();
    setTimeout(() => {
      const target = document.querySelector(stepState.correct ? "#nextPartBtn" : ".status-card");
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
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
    renderFn();
    setTimeout(() => {
      document.getElementById("nextPartBtn")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  });

  // Next Part
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
    applet.currentStep = Math.min(applet.currentStep + 1, steps.length - 1);
    const nextStep = steps[applet.currentStep];
    if (nextStep) applet.explanationOpen = { ...applet.explanationOpen, [nextStep.id]: false };
    renderFn();
  });

  // Slide explanation toggle
  document.querySelectorAll(".slide-explanation-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const sid = btn.dataset.stepId;
      applet.explanationOpen = { ...applet.explanationOpen, [sid]: !applet.explanationOpen?.[sid] };
      renderFn();
    });
  });

  // Drag-drop interaction (shared by mapping + sentences steps)
  if (step.type === "drag-drop-mapping" || step.type === "drag-drop-sentences") {
    attachDragDropHandlers(stepState, renderFn);
  }

  // Table-input cell interaction
  if (step.type === "table-input") {
    attachTableInputHandlers(step, stepState, renderFn);
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
    // Validate on blur or Enter — avoids re-rendering on every keystroke
    const validate = () => {
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

    input.addEventListener("blur",    validate);
    input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); input.blur(); } });
  });
}
