// engine/renderer.js

import { validate } from "../core/validatorRegistry.js";
import { renderGrid } from "./gridRenderer.js";
import { renderSeries } from "./seriesRenderer.js";

export function render(state) {
  const container = document.getElementById("app");
  const renderTarget = state?._legacyRenderTarget ?? container;
  const wrapLegacy = state?._legacyWrap !== undefined ? state._legacyWrap : true;
  if (!renderTarget) return;

  const config = state.config;
  const originalPoints = config.original.points;
  const expectedPoints = state.expectedPoints;

  // Raw clicks (for counters / attempts)
  const rawStudentPoints = state.studentPoints ?? [];

  // Safeguard: orderedStudentPoints may not exist yet
  const orderedStudentPoints = state.orderedStudentPoints ?? [];

  const isSlideMode = state.uiMode === "slide";
  const layout = config?.ui?.layout ?? {};
  const graphSize = Number(layout.graphSize);
  const width = Number.isFinite(graphSize) && graphSize > 0
    ? graphSize
    : (isSlideMode ? 520 : 600);
  const height = Number.isFinite(graphSize) && graphSize > 0
    ? graphSize
    : (isSlideMode ? 520 : 600);
  const explanationHtml = "<p>Notice how the y-coordinate of all points on the transformed graph g(x) are the <i>negative</i> of the y-coordinate on the f(x).</p><p>This is a <b>vertical reflection</b> about the x-axis.</p>";
  const feedbackClass = state.lastSubmitCorrect
    ? "feedback-success"
    : (state.submitted && state.lastSubmitCorrect === false ? "feedback-error" : "");
  const progressLabel = config.activity?.progressLabel ?? "Exploration 2 of 8";
  const slideOpen = Boolean(state.slideExplanationOpen?.[state.currentStep]);
  const persistedReference = Array.isArray(state.persistedReferenceGraph)
    ? state.persistedReferenceGraph
    : (Array.isArray(state.persistedGraphPoints) ? state.persistedGraphPoints : null);

  const getGraphDisplayState = (activeQuestion, appState) => {
    if (activeQuestion === 1) return null;
    return Array.isArray(appState.persistedReferenceGraph) && appState.persistedReferenceGraph.length > 0
      ? appState.persistedReferenceGraph
      : (Array.isArray(appState.persistedGraphPoints) ? appState.persistedGraphPoints : null);
  };

  const displayReferencePoints = getGraphDisplayState(state.currentStep, state);
  const showPersistedGraph = state.currentStep >= 2 && displayReferencePoints && displayReferencePoints.length > 0;
  const minusSign = "\u2212";
  const part2Expected = { x: "x", y: `${minusSign}y` };
  const part2Answer = state.part2Answer ?? { x: null, y: null };
  const part2Ready = Boolean(part2Answer.x && part2Answer.y);
  const part2Correct = Boolean(state.part2Correct);
  const part2Submitted = Boolean(state.part2Submitted);
  const part2SlotCorrect = part2Submitted ? {
    x: part2Answer.x === part2Expected.x,
    y: part2Answer.y === part2Expected.y
  } : { x: false, y: false };
  const part2Invalid = part2Submitted && !part2Correct ? {
    x: part2Answer.x !== part2Expected.x,
    y: part2Answer.y !== part2Expected.y
  } : { x: false, y: false };
  const renderMathVar = (value) => {
    if (!value) return "";
    if (value.startsWith(minusSign)) {
      const v = value.slice(minusSign.length);
      return `<span class="math-minus">${minusSign}</span><span class="math-var">${v}</span>`;
    }
    return `<span class="math-var">${value}</span>`;
  };

  const renderMathNum = (value) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.startsWith("-")) {
      return `<span class="math-minus">${minusSign}</span><span class="math-num">${str.slice(1)}</span>`;
    }
    if (str.startsWith(minusSign)) {
      return `<span class="math-minus">${minusSign}</span><span class="math-num">${str.slice(minusSign.length)}</span>`;
    }
    return `<span class="math-num">${str}</span>`;
  };

  const renderPointHtml = (point) => {
    const [x, y] = point;
    return `<span class="rule-math">(</span>${renderMathNum(x)}<span class="rule-math">,</span> ${renderMathNum(y)}<span class="rule-math">)</span>`;
  };

  const part2Tokens = [
    { value: "x", html: renderMathVar("x"), group: "x" },
    { value: `${minusSign}x`, html: renderMathVar(`${minusSign}x`), group: "x" },
    { value: "y", html: renderMathVar("y"), group: "y" },
    { value: `${minusSign}y`, html: renderMathVar(`${minusSign}y`), group: "y" }
  ];

  const computeXIntercepts = (points) => {
    const intercepts = [];
    for (let i = 0; i < points.length - 1; i++) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      if (y1 === 0) intercepts.push([x1, 0]);
      if (y2 === 0) intercepts.push([x2, 0]);
      if ((y1 < 0 && y2 > 0) || (y1 > 0 && y2 < 0)) {
        const t = (0 - y1) / (y2 - y1);
        const x = x1 + t * (x2 - x1);
        const xRounded = Math.round(x * 1000) / 1000;
        intercepts.push([xRounded, 0]);
      }
    }
    const seen = new Set();
    return intercepts.filter(p => {
      const key = `${p[0]},${p[1]}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const part3ExpectedPoints = computeXIntercepts(originalPoints);
  const part3ExpectedKeys = part3ExpectedPoints.map(p => `${p[0]},${p[1]}`);
  const part3Answer = state.part3Answer ?? { p1: null, p2: null, coordType: null, value: null };
  const part3Ready = Boolean(part3Answer.p1 && part3Answer.p2 && part3Answer.coordType && part3Answer.value);
  const part3Correct = Boolean(state.part3Correct);
  const part3Submitted = Boolean(state.part3Submitted);
  const part3Resolved = part3Submitted && part3Correct;
  const showSolutionAfterIncorrect = state.showSolution && state.lastSubmitCorrect === false;
  const showSolutionAfterCorrect = state.lastSubmitCorrect === true;
  const hideQ1Intro = showSolutionAfterIncorrect || showSolutionAfterCorrect;
  const part3ExpectedSet = new Set(part3ExpectedKeys);
  const part3SamePoint = part3Answer.p1 && part3Answer.p2 && part3Answer.p1 === part3Answer.p2;
  const part3Invalid = part3Submitted && !part3Correct ? {
    p1: !part3Answer.p1 || !part3ExpectedSet.has(part3Answer.p1) || part3SamePoint,
    p2: !part3Answer.p2 || !part3ExpectedSet.has(part3Answer.p2) || part3SamePoint,
    coordType: part3Answer.coordType !== "y-coordinate",
    value: part3Answer.value !== "0"
  } : { p1: false, p2: false, coordType: false, value: false };
  const part3SlotCorrect = part3Submitted ? {
    p1: Boolean(part3Answer.p1 && part3ExpectedSet.has(part3Answer.p1) && !part3SamePoint),
    p2: Boolean(part3Answer.p2 && part3ExpectedSet.has(part3Answer.p2) && !part3SamePoint),
    coordType: part3Answer.coordType === "y-coordinate",
    value: part3Answer.value === "0"
  } : { p1: false, p2: false, coordType: false, value: false };

  const part3PointOptions = [];
  const part3PointHtml = new Map();
  const addPointOption = (p) => {
    const key = `${p[0]},${p[1]}`;
    if (part3PointHtml.has(key)) return;
    part3PointHtml.set(key, renderPointHtml(p));
    part3PointOptions.push({ key, point: p });
  };

  part3ExpectedPoints.forEach(addPointOption);
  originalPoints.forEach(addPointOption);
  expectedPoints.forEach(p => addPointOption([p[0], p[1]]));

  const part3AllowedPointKeys = [
    "0,-1",
    "1,0",
    "0,1",
    "4,0"
  ];

  const part3PointTiles = part3AllowedPointKeys
    .filter(key => part3PointHtml.has(key))
    .map(key => ({
      type: "point",
      value: key,
      html: part3PointHtml.get(key)
    }));

  const part3CoordTiles = [
    { type: "coordType", value: "x-coordinate", html: "x-coordinate" },
    { type: "coordType", value: "y-coordinate", html: "y-coordinate" }
  ];

  const part3ValueTiles = [
    { type: "value", value: "0", html: renderMathNum("0") },
    { type: "value", value: `${minusSign}1`, html: renderMathNum(`${minusSign}1`) }
  ];

  const part3SuccessBlock = `
    <div class="explanation-box success-reveal status-success ${isSlideMode ? "slide-compact" : ""}">
      <div class="status-title">Correct — nice work!</div>
      <div class="explanation-inline">
        <span class="status-text">Notice how each y-coordinate is replaced by its opposite value.</span>
        ${isSlideMode ? `
          <button class="slide-explanation-toggle inline" data-step="${state.currentStep}">
            ${slideOpen ? "Hide explanation" : "Show explanation"}
          </button>
        ` : ""}
      </div>
      ${isSlideMode ? `
        <div class="slide-explanation-text ${slideOpen ? "open" : ""}">
          A reflection in the x-axis keeps x-values the same and multiplies y-values by ${minusSign}1. Points on the x-axis have y = 0, so they do not move under the reflection. Therefore, the shared points are the x-intercepts, and they have the same y-coordinate, which is 0.
        </div>
      ` : `A reflection in the x-axis keeps x-values the same and multiplies y-values by ${minusSign}1. Points on the x-axis have y = 0, so they do not move under the reflection. Therefore, the shared points are the x-intercepts, and they have the same y-coordinate, which is 0.`}
      <button id="nextPartBtn" class="next-part-btn">Finish Exploration →</button>
    </div>
  `;

  const toObj = ([x, y]) => ({ x, y });
  const seriesList = [];

  let svg = `<svg id="graphSvg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg = renderGrid(svg, state.view, { width, height });

  if (originalPoints.length > 0) {
    const pts = originalPoints.map(toObj);
    seriesList.push({
      type: "polyline",
      points: pts,
      style: { stroke: "#2563eb", strokeWidth: 2 }
    });
    seriesList.push({
      type: "points",
      points: pts,
      style: { fill: "#2563eb", r: 6 }
    });
  }

  // Student polyline connecting the student's actual clicked points (always show)
  if (!showPersistedGraph && rawStudentPoints.length > 1) {
    // Sort student points left-to-right by x value for the polyline
    const sortedStudentPoints = [...rawStudentPoints].sort((a, b) => a[0] - b[0]);
    seriesList.push({
      type: "polyline",
      points: sortedStudentPoints.map(toObj),
      style: { stroke: !state.submitted ? "#6d28d9" : (state.lastSubmitCorrect ? "#16a34a" : "#dc2626"), strokeWidth: !state.submitted ? 3 : (state.lastSubmitCorrect ? 4 : 3), opacity: 1 }
    });
  }

  // Student Attempt (faint line)
  if (!showPersistedGraph && rawStudentPoints.length > 0) {
    const mode = state.config.interaction?.mode || "placePoints";
    // Determine student color based on submit state:
    // - working (not submitted): dark purple
    // - submitted & correct: green
    // - submitted & incorrect: red
    const workingColor = "#6d28d9"; // purple-700
    const correctColor = "#16a34a"; // green-600
    const incorrectColor = "#dc2626"; // red-600
    const studentColor = !state.submitted
      ? workingColor
      : (state.lastSubmitCorrect ? correctColor : incorrectColor);

    const studentStrokeWidth = !state.submitted ? 3 : (state.lastSubmitCorrect ? 4 : 3);

    if (mode === "placePoints") {
      // Show raw student clicks as points in the student color.
      seriesList.push({
        type: "points",
        points: rawStudentPoints.map(toObj),
        style: { fill: studentColor, r: 6 }
      });
    } else if (rawStudentPoints.length > 1) {
      seriesList.push({
        type: "polyline",
        points: rawStudentPoints.map(toObj),
        style: { stroke: studentColor, strokeWidth: studentStrokeWidth, opacity: 0.25 }
      });
    }
  }

  // Student Clean (solid line)
  if (!showPersistedGraph && orderedStudentPoints.length > 1) {
    const matchedLookup = new Set(
      orderedStudentPoints.map(p => `${p[0]},${p[1]}`)
    );
    const cleanLinePoints = state.expectedPoints.map(toObj);
    const cleanLineMask = state.expectedPoints.map(p =>
      matchedLookup.has(`${p[0]},${p[1]}`)
    );

    seriesList.push({
      type: "polyline",
      points: cleanLinePoints,
      segmentMask: cleanLineMask,
      style: { stroke: !state.submitted ? "#6d28d9" : (state.lastSubmitCorrect ? "#16a34a" : "#dc2626"), strokeWidth: !state.submitted ? 3 : (state.lastSubmitCorrect ? 4 : 3), opacity: 1 }
    });
  }

  // Student Points (raw)
  // Note: raw student points are already added above (either as points or part
  // of the attempt polyline). Additionally, draw matched expected points (if
  // any) with a distinct style so students see which expected vertices were
  // recognized by the system.
  if (state.expectedPoints && state.expectedPoints.length > 0) {
  // Do not draw matched expected points as separate markers during attempts.

  // Solution overlay (never before submit)
  if (state.submitted || showPersistedGraph) {
    const solutionPoints = showPersistedGraph ? displayReferencePoints : expectedPoints;
    if ((state.showSolution || showPersistedGraph) && solutionPoints.length > 0) {
      const pts = solutionPoints.map(toObj);
      seriesList.push({
        type: "polyline",
        points: pts,
        style: { stroke: "#16a34a", strokeWidth: 5 }
      });
      seriesList.push({
        type: "points",
        points: pts,
        style: { fill: "#16a34a", r: 6 }
      });
    }
  }

  }

  svg = renderSeries(svg, seriesList, state.view, { width, height });

  svg += `</svg>`;

  const stepResolvedClass = (state.currentStep === 2 && part2Submitted && (part2Correct || state.part2ShowSolution))
    ? " step-2-resolved"
    : "";

  const legacyContentHtml = `
    <div class="main-container step-${state.currentStep}${stepResolvedClass}">
      <div class="activity-layout">
        <div class="activity-copy left-panel">
        <div class="page-heading">
          ${state.currentStep === 3 ? "" : `<div class="heading-label">Exploration 2</div>`}
          <div class="heading-title">Reflection in the <span class="nowrap">x-axis</span></div>
        </div>

        <section style="margin-bottom:18px;padding-top:8px;">
          ${state.currentStep === 1 ? `
            ${hideQ1Intro ? "" : `
              <div class="question-label">Question 1 (of 3)</div>
              <div class="task-instructions">Sketch the mirror image graph, <strong>y = g(x)</strong>, by clicking where the 5 connection points should be, and using the above controls.</div>
            `}
            ${state.feedback && state.lastSubmitCorrect === false && !showSolutionAfterIncorrect ? `
              <div id="feedback" class="graph-feedback ${feedbackClass}">
                ${state.feedback}
              </div>
            ` : ""}
              ${ (state.lastSubmitCorrect || state.showSolution) ? `
                <div id="explanation" class="explanation-box ${state.lastSubmitCorrect || state.showSolution ? "success-reveal" : ""} ${isSlideMode ? "slide-compact" : ""} ${(showSolutionAfterIncorrect || showSolutionAfterCorrect) ? "show-solution" : ""}">
                  ${state.lastSubmitCorrect ? `
                    <div class="status-title">${state.feedback}</div>
                  ` : ""}
                  ${isSlideMode ? ((showSolutionAfterIncorrect || showSolutionAfterCorrect) ? `
                    <div class="slide-explanation-text open">
                      ${explanationHtml}
                    </div>
                  ` : `
                    <div class="slide-explanation-text ${slideOpen ? "open" : ""}">
                      ${explanationHtml}
                    </div>
                    <button class="slide-explanation-toggle" data-step="${state.currentStep}">
                      ${slideOpen ? "Hide explanation" : "Show explanation"}
                    </button>
                  `) : explanationHtml}
                  ${ (state.lastSubmitCorrect || state.showSolution) ? `
                    <button id="nextPartBtn" class="next-part-btn">Continue to Part 2 →</button>
                  ` : ""}
                </div>
              ` : ''}
          ` : (state.currentStep === 2 ? `
            <div class="question-body">
              <div class="question-label">Question 2</div>
              <div class="task-instructions">Drag & Drop the boxes below to state the <b>mapping rule</b> from f(x) to g(x).</div>

              <div class="rule-card">
              <div class="mapping-line">
                <span class="rule-prefix">All points</span>
                <div class="math-expression">
                  <span class="rule-math">(</span>${renderMathVar("x")}<span class="rule-math">,</span> ${renderMathVar("y")}<span class="rule-math">)</span>
                  <span class="rule-arrow">&rarr;</span>
                  <span class="rule-math">(</span>

                  <div class="drop-stack">
                    <div class="drop-label">NEW X</div>
                    <div class="drop-zone ${part2Answer.x ? "filled" : ""} ${part2SlotCorrect.x ? "correct" : ""} ${part2Invalid.x ? "invalid shake" : ""}" data-slot="x" tabindex="0" role="button" aria-label="new x drop zone">
                      ${part2Answer.x ? `
                        <span class="drop-value">${renderMathVar(part2Answer.x)}</span>
                        <button class="drop-clear" data-slot="x" aria-label="Clear new x">&times;</button>
                      ` : `<span class="drop-placeholder">drop</span>`}
                    </div>
                  </div>

                  <span class="rule-sep">,</span>

                  <div class="drop-stack">
                    <div class="drop-label">NEW Y</div>
                    <div class="drop-zone ${part2Answer.y ? "filled" : ""} ${part2SlotCorrect.y ? "correct" : ""} ${part2Invalid.y ? "invalid shake" : ""}" data-slot="y" tabindex="0" role="button" aria-label="new y drop zone">
                      ${part2Answer.y ? `
                        <span class="drop-value">${renderMathVar(part2Answer.y)}</span>
                        <button class="drop-clear" data-slot="y" aria-label="Clear new y">&times;</button>
                      ` : `<span class="drop-placeholder">drop</span>`}
                    </div>
                  </div>

                  <span class="rule-math">)</span>
                </div>
              </div>

              ${part2Submitted && !part2Correct ? `
                <div class="rule-hint">Check how the y-values change.</div>
              ` : ""}
              </div>

              ${(part2Submitted && (part2Correct || state.part2ShowSolution)) ? "" : `
              <div class="token-bank">
              <div class="token-group">
                <div class="token-label">X-values</div>
                <div class="token-row">
                  ${part2Tokens.filter(t => t.group === "x").map(t => `
                    <div class="drag-token ${state.part2SelectedToken === t.value ? "selected" : ""}" data-value="${t.value}" tabindex="0" role="button" aria-pressed="${state.part2SelectedToken === t.value}" draggable="true">${t.html}</div>
                  `).join("")}
                </div>
              </div>

              <div class="token-group">
                <div class="token-label">Y-values</div>
                <div class="token-row">
                  ${part2Tokens.filter(t => t.group === "y").map(t => `
                    <div class="drag-token ${state.part2SelectedToken === t.value ? "selected" : ""}" data-value="${t.value}" tabindex="0" role="button" aria-pressed="${state.part2SelectedToken === t.value}" draggable="true">${t.html}</div>
                  `).join("")}
                </div>
              </div>
            </div>
              `}
            </div>

            <div class="feedback-area">
              ${part2Submitted ? `
                ${part2Correct ? `
                  ${state.part2ShowSolution ? `
                    <div class="explanation-box success-reveal solution-explanation ${isSlideMode ? "slide-compact" : ""}">
                      The mapping rule is <span class="rule-math">(</span>${renderMathVar("x")}<span class="rule-math">,</span> ${renderMathVar("y")}<span class="rule-math">) &rarr; (</span>${renderMathVar("x")}<span class="rule-math">,</span> ${renderMathVar(`${minusSign}y`)}<span class="rule-math">)</span>.
                      <button id="nextPartBtn" class="next-part-btn">Continue to Part 3 →</button>
                    </div>
                  ` : `
                    <div class="status-card success-reveal status-success ${isSlideMode ? "slide-compact" : ""}">
                      <div class="status-title">Correct — nice work!</div>
                      <div class="status-text">Notice how each y-coordinate is replaced by its opposite value.</div>
                      <button id="nextPartBtn" class="next-part-btn">Continue to Part 3 →</button>
                    </div>
                  `}
                ` : `
                  <div class="status-card success-reveal status-error ${isSlideMode ? "slide-compact" : ""}">
                    <div class="status-title">Not Correct — try again or click "See Solution".</div>
                  </div>
                `}
              ` : ""}
            </div>
          ` : (state.currentStep === 3 ? `
            <div class="q3-panel">
              <div class="question-body">
                <div class="question-label">Question 3</div>
                <div class="task-instructions"><strong>Drag &amp; drop</strong> to complete each statement.</div>

                <div class="rule-card">
              <div class="mapping-line">
                <span class="rule-prefix">The points on both graphs are</span>
                <div class="math-expression">
                  <div class="drop-zone point-slot ${part3Answer.p1 ? "filled" : ""} ${part3SlotCorrect.p1 ? "correct" : ""} ${part3Invalid.p1 ? "invalid shake" : ""}" data-slot="p1" data-accept="point" tabindex="0" role="button" aria-label="first point drop zone">
                    ${part3Answer.p1 ? `
                      <span class="drop-value">${part3PointHtml.get(part3Answer.p1) ?? ""}</span>
                      <button class="drop-clear" data-slot="p1" aria-label="Clear first point">&times;</button>
                    ` : `<span class="drop-placeholder">drop</span>`}
                  </div>
                  <span class="rule-sep">and</span>
                  <div class="drop-zone point-slot ${part3Answer.p2 ? "filled" : ""} ${part3SlotCorrect.p2 ? "correct" : ""} ${part3Invalid.p2 ? "invalid shake" : ""}" data-slot="p2" data-accept="point" tabindex="0" role="button" aria-label="second point drop zone">
                    ${part3Answer.p2 ? `
                      <span class="drop-value">${part3PointHtml.get(part3Answer.p2) ?? ""}</span>
                      <button class="drop-clear" data-slot="p2" aria-label="Clear second point">&times;</button>
                    ` : `<span class="drop-placeholder">drop</span>`}
                  </div>
                  <span class="rule-math">.</span>
                </div>
              </div>

              <div class="mapping-line">
                <span class="rule-prefix">They have the same</span>
                <div class="math-expression">
                  <div class="drop-zone coord-slot ${part3Answer.coordType ? "filled" : ""} ${part3SlotCorrect.coordType ? "correct" : ""} ${part3Invalid.coordType ? "invalid shake" : ""}" data-slot="coordType" data-accept="coordType" tabindex="0" role="button" aria-label="coordinate type drop zone">
                    ${part3Answer.coordType ? `
                      <span class="drop-value">${part3Answer.coordType}</span>
                      <button class="drop-clear" data-slot="coordType" aria-label="Clear coordinate type">&times;</button>
                    ` : `<span class="drop-placeholder">drop</span>`}
                  </div>
                  <span class="rule-sep">,</span>
                  <span class="rule-prefix">which is</span>
                  <div class="drop-zone value-slot ${part3Answer.value ? "filled" : ""} ${part3SlotCorrect.value ? "correct" : ""} ${part3Invalid.value ? "invalid shake" : ""}" data-slot="value" data-accept="value" tabindex="0" role="button" aria-label="value drop zone">
                    ${part3Answer.value ? `
                      <span class="drop-value">${renderMathNum(part3Answer.value)}</span>
                      <button class="drop-clear" data-slot="value" aria-label="Clear value">&times;</button>
                    ` : `<span class="drop-placeholder">drop</span>`}
                  </div>
                  <span class="rule-math">.</span>
                </div>
              </div>
                </div>

                <div class="banks-scroll">
                  <div class="token-bank">
                    <div class="token-group">
                      <div class="token-label">Points:</div>
                      <div class="token-row points-grid">
                        ${part3PointTiles.map(t => `
                          <div class="drag-token ${state.part3SelectedToken?.value === t.value ? "selected" : ""}" data-type="${t.type}" data-value="${t.value}" tabindex="0" role="button" aria-pressed="${state.part3SelectedToken?.value === t.value}" draggable="true">${t.html}</div>
                        `).join("")}
                      </div>
                    </div>

                    <div class="token-group">
                      <div class="token-label">Type:</div>
                      <div class="token-row">
                        ${part3CoordTiles.map(t => `
                          <div class="drag-token ${state.part3SelectedToken?.value === t.value ? "selected" : ""}" data-type="${t.type}" data-value="${t.value}" tabindex="0" role="button" aria-pressed="${state.part3SelectedToken?.value === t.value}" draggable="true">${t.html}</div>
                        `).join("")}
                      </div>
                    </div>

                    <div class="token-group">
                      <div class="token-label">Value:</div>
                      <div class="token-row">
                        ${part3ValueTiles.map(t => `
                          <div class="drag-token ${state.part3SelectedToken?.value === t.value ? "selected" : ""}" data-type="${t.type}" data-value="${t.value}" tabindex="0" role="button" aria-pressed="${state.part3SelectedToken?.value === t.value}" draggable="true">${t.html}</div>
                        `).join("")}
                      </div>
                    </div>
                  </div>
                </div>

            <div class="feedback-area">
              ${part3Submitted ? `
              ${part3Correct ? `
                ${isSlideMode ? "" : part3SuccessBlock}
              ` : `
                <div class="status-card success-reveal status-error">
                  <div class="status-title">Not Correct — try again or click "See Solution".</div>
                </div>
              `}
              ` : ""}
            </div>
          ` : `
            <div class="question-label">All done</div>
            <div class="task-instructions">You have completed this exploration.</div>
          `))}
        </section>
        </div>

        <div class="graph-column">

        <div class="graph-toolbar">
          <div class="controls">
            <button id="undoBtn">Undo</button>
            <button id="resetBtn">Reset</button>
            <button id="submitBtn" class="submit-btn" ${((state.currentStep === 2 && !part2Ready) || (state.currentStep === 3 && !part3Ready)) ? "disabled" : ""}>Submit</button>
            ${((state.currentStep === 1 && !state.showSolution && state.lastSubmitCorrect === false) || (state.currentStep === 2 && part2Submitted && !part2Correct) || (state.currentStep === 3 && part3Submitted && !part3Correct)) ? `<button id="solutionBtn">See Solution</button><button id="tryAgainBtn" style="margin-left:6px;">Try Again</button>` : ""}
          </div>
        </div>

        <div class="graph-frame">
          ${svg}
          <div class="graph-label">y = f(x)</div>
          ${ (state.showSolution || state.lastSubmitCorrect || showPersistedGraph) ? `<div class="solution-label">y = g(x)</div>` : '' }
        </div>

        ${isSlideMode && state.currentStep === 3 && part3Resolved ? `
          <div class="graph-completion slide-q3-completion">
            ${part3SuccessBlock}
          </div>
        ` : ""}

        </div>
      </div>
    </div>
  `;

  const wrappedHtml = wrapLegacy
    ? `
      <div class="slide-scale-root">
        <div class="slide-scale-inner">
          <div class="slide-viewport">
            <div class="slide-safe-area">
              ${legacyContentHtml}
            </div>
          </div>
        </div>
      </div>
    `
    : legacyContentHtml;

  renderTarget.innerHTML = wrappedHtml;
  window.dispatchEvent(new Event("applet:rendered"));

  

  // Undo
  document.getElementById("undoBtn")?.addEventListener("click", () => {
    if (state.currentStep === 2) {
      if (state.part2Answer?.y) {
        state.part2Answer = { ...state.part2Answer, y: null };
      } else if (state.part2Answer?.x) {
        state.part2Answer = { ...state.part2Answer, x: null };
      }
      state.part2SelectedToken = null;
      state.part2Submitted = false;
      state.part2Correct = null;
      state.part2ShowSolution = false;
      state.part2Feedback = "";
      render(state);
    } else if (state.currentStep === 3) {
      const prev = state.part3History.pop();
      if (prev) {
        state.part3Answer = prev;
      }
      state.part3SelectedToken = null;
      state.part3Submitted = false;
      state.part3Correct = null;
      state.part3ShowSolution = false;
      state.part3Feedback = "";
      render(state);
    } else {
      state.undo();
      render(state);
    }
  });

  // Reset
  document.getElementById("resetBtn")?.addEventListener("click", () => {
    if (state.currentStep === 2) {
      state.part2Answer = { x: null, y: null };
      state.part2SelectedToken = null;
      state.part2Submitted = false;
      state.part2Correct = null;
      state.part2ShowSolution = false;
      state.part2Feedback = "";
      render(state);
    } else if (state.currentStep === 3) {
      state.part3Answer = { p1: null, p2: null, coordType: null, value: null };
      state.part3SelectedToken = null;
      state.part3History = [];
      state.part3Submitted = false;
      state.part3Correct = null;
      state.part3ShowSolution = false;
      state.part3Feedback = "";
      render(state);
    } else {
      state.reset();
      render(state);
    }
  });

  // Try Again (explicit retry) - clears student attempts but keeps config
  document.getElementById("tryAgainBtn")?.addEventListener("click", () => {
    if (state.currentStep === 2) {
      state.part2Answer = { x: null, y: null };
      state.part2SelectedToken = null;
      state.part2Submitted = false;
      state.part2Correct = null;
      state.part2ShowSolution = false;
      state.part2Feedback = "";
      render(state);
    } else if (state.currentStep === 3) {
      state.part3Answer = { p1: null, p2: null, coordType: null, value: null };
      state.part3SelectedToken = null;
      state.part3History = [];
      state.part3Submitted = false;
      state.part3Correct = null;
      state.part3ShowSolution = false;
      state.part3Feedback = "";
      render(state);
    } else {
      state.reset();
      render(state);
    }
  });

  // Submit (semantic correctness)
  document.getElementById("submitBtn")?.addEventListener("click", () => {
    if (state.currentStep === 2) {
      if (!state.part2Answer?.x || !state.part2Answer?.y) return;
      const isCorrect = state.part2Answer?.x === "x" && state.part2Answer?.y === "\u2212y";
      state.part2Submitted = true;
      state.part2Correct = isCorrect;
      state.part2ShowSolution = false;
      state.part2Feedback = isCorrect
        ? "Correct — nice work!"
        : "Not Correct — try again or click \"See Solution\".";
      render(state);
      if (state.currentStep !== 2) {
        setTimeout(() => {
          const target = document.querySelector(isCorrect ? "#nextPartBtn" : ".status-card");
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 0);
      }
      return;
    }

    if (state.currentStep === 3) {
      if (!state.part3Answer?.p1 || !state.part3Answer?.p2 || !state.part3Answer?.coordType || !state.part3Answer?.value) return;
      const expectedSet = new Set(part3ExpectedKeys);
      const isCorrect =
        expectedSet.has(state.part3Answer.p1) &&
        expectedSet.has(state.part3Answer.p2) &&
        state.part3Answer.p1 !== state.part3Answer.p2 &&
        state.part3Answer.coordType === "y-coordinate" &&
        state.part3Answer.value === "0";
      state.part3Submitted = true;
      state.part3Correct = isCorrect;
      state.part3ShowSolution = false;
      state.part3Feedback = isCorrect
        ? "Correct — nice work!"
        : "Not Correct — try again or click \"See Solution\".";
      render(state);
      setTimeout(() => {
        const target = document.querySelector(isCorrect ? "#nextPartBtn" : ".status-card");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 0);
      return;
    }

    const activityType = state.config?.activityType ?? "transformations";
    const result = validate(activityType, state, state.config);

    state.submitted = true;
    state.lastSubmitCorrect = Boolean(result?.isCorrect);
    // If correct, use the fixed celebratory message; otherwise use validator message or empty.
    if (state.lastSubmitCorrect) {
      state.feedback = "CORRECT - Your graph is bang on!";
      const snapshot = expectedPoints.map(p => [p[0], p[1]]);
      state.persistedGraphPoints = snapshot;
      state.persistedReferenceGraph = snapshot.map(p => [p[0], p[1]]);
    } else {
      state.feedback = '<strong>Not Correct</strong> - Click "Try Again" or "See Solution".';
    }

    if (!state.lastSubmitCorrect) {
      state.showSolution = config.feedback.showExpectedPointsOnFail;
    }

    render(state);

    if (!state.lastSubmitCorrect) {
      if (state.currentStep !== 1) {
        setTimeout(() => {
          const feedbackEl = document.getElementById("feedback");
          if (feedbackEl) {
            feedbackEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 0);
      }
    } else {
      setTimeout(() => {
        const nextBtn = document.getElementById("nextPartBtn");
        if (nextBtn) {
          nextBtn.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 0);
    }
  });

  // Solution button
  document.getElementById("solutionBtn")?.addEventListener("click", () => {
    if (state.currentStep === 2) {
      state.part2Answer = { x: "x", y: "\u2212y" };
      state.part2Submitted = true;
      state.part2Correct = true;
      state.part2ShowSolution = true;
      state.part2Feedback = "Correct — nice work!";
      render(state);
      return;
    }

    if (state.currentStep === 3) {
      state.part3Answer = {
        p1: part3ExpectedKeys[0] ?? null,
        p2: part3ExpectedKeys[1] ?? null,
        coordType: "y-coordinate",
        value: "0"
      };
      state.part3History = [];
      state.part3Submitted = true;
      state.part3Correct = true;
      state.part3ShowSolution = true;
      state.part3Feedback = "Correct — nice work!";
      render(state);
      return;
    }

    state.enableSolution();
    render(state);
    if (state.currentStep !== 1) {
      setTimeout(() => {
        const nextBtn = document.getElementById("nextPartBtn");
        if (nextBtn) {
          nextBtn.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 0);
    }
  });

  document.getElementById("nextPartBtn")?.addEventListener("click", () => {
    if (state.currentStep === 1) {
      if (!state.persistedReferenceGraph) {
        const snapshot = expectedPoints.map(p => [p[0], p[1]]);
        state.persistedGraphPoints = snapshot;
        state.persistedReferenceGraph = snapshot.map(p => [p[0], p[1]]);
      }
      state.currentStep = 2;
      state.studentPoints = [];
      state.orderedStudentPoints = [];
      state.submitted = false;
      state.lastSubmitCorrect = null;
      state.feedback = "";
      state.showSolution = false;
      state.part2Answer = { x: null, y: null };
      state.part2SelectedToken = null;
      state.part2Submitted = false;
      state.part2Correct = null;
      state.part2ShowSolution = false;
      state.part2Feedback = "";
      state.slideExplanationOpen = { ...state.slideExplanationOpen, 2: false };
      render(state);
      return;
    }

    if (state.currentStep === 2) {
      state.currentStep = 3;
      state.part3Answer = { p1: null, p2: null, coordType: null, value: null };
      state.part3SelectedToken = null;
      state.part3History = [];
      state.part3Submitted = false;
      state.part3Correct = null;
      state.part3ShowSolution = false;
      state.part3Feedback = "";
      state.slideExplanationOpen = { ...state.slideExplanationOpen, 3: false };
      render(state);
      return;
    }

    if (state.currentStep === 3) {
      state.currentStep = 4;
      state.slideExplanationOpen = { ...state.slideExplanationOpen, 4: false };
      render(state);
    }
  });

  document.querySelectorAll(".slide-explanation-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const step = Number(btn.dataset.step);
      state.slideExplanationOpen = {
        ...state.slideExplanationOpen,
        [step]: !state.slideExplanationOpen?.[step]
      };
      render(state);
    });
  });

  if (state.currentStep === 2) {
    const setPart2Slot = (slot, value) => {
      state.part2Answer = { ...state.part2Answer, [slot]: value };
      state.part2SelectedToken = null;
      state.part2Submitted = false;
      state.part2Correct = null;
      state.part2ShowSolution = false;
      state.part2Feedback = "";
      render(state);
    };

    document.querySelectorAll(".drag-token").forEach(token => {
      token.addEventListener("dragstart", (e) => {
        token.classList.add("dragging");
        e.dataTransfer?.setData("text/plain", token.dataset.value || "");
      });

      token.addEventListener("dragend", () => {
        token.classList.remove("dragging");
      });

      token.addEventListener("click", () => {
        state.part2SelectedToken = token.dataset.value || null;
        render(state);
      });

      token.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          state.part2SelectedToken = token.dataset.value || null;
          render(state);
        }
      });
    });

    document.querySelectorAll(".drop-zone").forEach(zone => {
      zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        zone.classList.add("drag-over");
      });

      zone.addEventListener("dragleave", () => {
        zone.classList.remove("drag-over");
      });

      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("drag-over");
        const value = e.dataTransfer?.getData("text/plain");
        if (value) {
          setPart2Slot(zone.dataset.slot, value);
          setTimeout(() => {
            const refreshed = document.querySelector(`.drop-zone[data-slot="${zone.dataset.slot}"]`);
            if (refreshed) {
              refreshed.classList.add("drop-success");
              setTimeout(() => refreshed.classList.remove("drop-success"), 180);
            }
          }, 0);
        }
      });

      zone.addEventListener("click", () => {
        if (state.part2SelectedToken) {
          setPart2Slot(zone.dataset.slot, state.part2SelectedToken);
          setTimeout(() => {
            const refreshed = document.querySelector(`.drop-zone[data-slot="${zone.dataset.slot}"]`);
            if (refreshed) {
              refreshed.classList.add("drop-success");
              setTimeout(() => refreshed.classList.remove("drop-success"), 180);
            }
          }, 0);
        }
      });

      zone.addEventListener("keydown", (e) => {
        if ((e.key === "Enter" || e.key === " ") && state.part2SelectedToken) {
          e.preventDefault();
          setPart2Slot(zone.dataset.slot, state.part2SelectedToken);
          setTimeout(() => {
            const refreshed = document.querySelector(`.drop-zone[data-slot="${zone.dataset.slot}"]`);
            if (refreshed) {
              refreshed.classList.add("drop-success");
              setTimeout(() => refreshed.classList.remove("drop-success"), 180);
            }
          }, 0);
        }
      });
    });

    document.querySelectorAll(".drop-clear").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const slot = btn.dataset.slot;
        if (slot) {
          setPart2Slot(slot, null);
        }
      });
    });
  }

  if (state.currentStep === 3) {
    const setPart3Slot = (slot, value) => {
      state.part3History.push({ ...state.part3Answer });
      state.part3Answer = { ...state.part3Answer, [slot]: value };
      state.part3SelectedToken = null;
      state.part3Submitted = false;
      state.part3Correct = null;
      state.part3ShowSolution = false;
      state.part3Feedback = "";
      render(state);
    };

    document.querySelectorAll(".drag-token").forEach(token => {
      token.addEventListener("dragstart", (e) => {
        token.classList.add("dragging");
        e.dataTransfer?.setData("text/plain", token.dataset.value || "");
        e.dataTransfer?.setData("text/type", token.dataset.type || "");
      });

      token.addEventListener("dragend", () => {
        token.classList.remove("dragging");
      });

      token.addEventListener("click", () => {
        state.part3SelectedToken = { type: token.dataset.type, value: token.dataset.value };
        render(state);
      });

      token.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          state.part3SelectedToken = { type: token.dataset.type, value: token.dataset.value };
          render(state);
        }
      });
    });

    document.querySelectorAll(".drop-zone").forEach(zone => {
      zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        zone.classList.add("drag-over");
      });

      zone.addEventListener("dragleave", () => {
        zone.classList.remove("drag-over");
      });

      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("drag-over");
        const value = e.dataTransfer?.getData("text/plain");
        const type = e.dataTransfer?.getData("text/type");
        const accept = zone.dataset.accept;
        if (value && type && accept === type) {
          setPart3Slot(zone.dataset.slot, value);
          setTimeout(() => {
            const refreshed = document.querySelector(`.drop-zone[data-slot="${zone.dataset.slot}"]`);
            if (refreshed) {
              refreshed.classList.add("drop-success");
              setTimeout(() => refreshed.classList.remove("drop-success"), 180);
            }
          }, 0);
        }
      });

      zone.addEventListener("click", () => {
        if (state.part3SelectedToken) {
          const { type, value } = state.part3SelectedToken;
          const accept = zone.dataset.accept;
          if (accept === type) {
            setPart3Slot(zone.dataset.slot, value);
            setTimeout(() => {
              const refreshed = document.querySelector(`.drop-zone[data-slot="${zone.dataset.slot}"]`);
              if (refreshed) {
                refreshed.classList.add("drop-success");
                setTimeout(() => refreshed.classList.remove("drop-success"), 180);
              }
            }, 0);
          }
        }
      });

      zone.addEventListener("keydown", (e) => {
        if ((e.key === "Enter" || e.key === " ") && state.part3SelectedToken) {
          e.preventDefault();
          const { type, value } = state.part3SelectedToken;
          const accept = zone.dataset.accept;
          if (accept === type) {
            setPart3Slot(zone.dataset.slot, value);
            setTimeout(() => {
              const refreshed = document.querySelector(`.drop-zone[data-slot="${zone.dataset.slot}"]`);
              if (refreshed) {
                refreshed.classList.add("drop-success");
                setTimeout(() => refreshed.classList.remove("drop-success"), 180);
              }
            }, 0);
          }
        }
      });
    });

    document.querySelectorAll(".drop-clear").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const slot = btn.dataset.slot;
        if (slot) {
          setPart3Slot(slot, null);
        }
      });
    });
  }

  if (!state._shortcutsBound) {
    document.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (key === "enter") {
        document.getElementById("submitBtn")?.click();
      } else if (e.ctrlKey && key === "z") {
        e.preventDefault();
        state.undo();
        render(state);
      }
    });
    state._shortcutsBound = true;
  }
}
