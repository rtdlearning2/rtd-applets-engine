// engine/renderers/svgBuilder.js
// Pure SVG builder — reads state, returns an SVG string. No DOM side-effects.

import { renderGrid }           from "./gridRenderer.js";
import { renderSeries }         from "./seriesRenderer.js";
import { deriveReflectedCurve } from "../utils/transformEngine.js";

// ─── Module-scope pure helpers ────────────────────────────────────────────────

const toObj    = ([x, y]) => ({ x, y });
const fmtCoord = n => Number.isInteger(n) ? String(n) : parseFloat(n.toFixed(2)).toString();
const ptLabel  = (x, y) => `(${fmtCoord(x)}, ${fmtCoord(y)})`;

// ─── Internal series builders ─────────────────────────────────────────────────

function buildOriginalSeries(config, tableRowSet, hideOriginalCurve) {
  const originalPoints = config.original?.points ?? [];
  const originalCurve  = config.original?.curve;
  const series         = [];

  const visiblePts = tableRowSet
    ? originalPoints.filter(([x]) => !tableRowSet.has(String(x)))
    : originalPoints;

  if (originalCurve) {
    if (!hideOriginalCurve) {
      series.push({ type: "curve", fn: originalCurve.fn, domain: originalCurve.domain, style: { stroke: "#2563eb", strokeWidth: 2 } });
    }
    if (visiblePts.length > 0) {
      series.push({ type: "points", points: visiblePts.map(toObj), labels: visiblePts.map(([x, y]) => ptLabel(x, y)), style: { fill: "#2563eb", r: 6 } });
    }
  } else if (visiblePts.length > 0) {
    const pts = visiblePts.map(toObj);
    series.push({ type: "polyline", points: pts, style: { stroke: "#2563eb", strokeWidth: 2 } });
    series.push({ type: "points",   points: pts, labels: visiblePts.map(([x, y]) => ptLabel(x, y)), style: { fill: "#2563eb", r: 6 } });
  }

  return series;
}

function buildPersistedSeries(persistedGraph, config, activity) {
  const series         = [];
  const reflectedCurve = deriveReflectedCurve(config, activity);

  if (reflectedCurve) {
    series.push({ type: "curve", fn: reflectedCurve.fn, domain: reflectedCurve.domain, style: { stroke: "#16a34a", strokeWidth: 3 } });
  } else {
    series.push({ type: "polyline", points: persistedGraph.map(toObj), style: { stroke: "#16a34a", strokeWidth: 5 } });
  }
  series.push({ type: "points", points: persistedGraph.map(toObj), style: { fill: "#16a34a", r: 6 } });

  return series;
}

function buildStudentSeries(state, config, stepState) {
  const rawStudentPoints     = state.studentPoints       ?? [];
  const orderedStudentPoints = state.orderedStudentPoints ?? [];
  const expectedPoints       = state.expectedPoints;
  const series               = [];

  const submitted   = stepState?.submitted ?? state.submitted;
  const correct     = stepState?.correct   ?? state.lastSubmitCorrect;
  const isCurve     = Boolean(config.original?.curve);
  const color       = !submitted ? "#6d28d9" : (correct ? "#16a34a" : "#dc2626");
  const strokeWidth = !submitted ? 3 : (correct ? 4 : 3);
  const mode        = config.interaction?.mode || "placePoints";

  if (mode === "placePoints") {
    if (rawStudentPoints.length > 1) {
      const sorted   = [...rawStudentPoints].sort((a, b) => a[0] - b[0]);
      const lineType = config.interaction?.studentLineStyle ?? (isCurve ? "smooth-curve" : "polyline");
      series.push({ type: lineType, points: sorted.map(toObj), style: { stroke: color, strokeWidth, opacity: 1 } });
    }
    if (rawStudentPoints.length > 0) {
      series.push({ type: "points", points: rawStudentPoints.map(toObj), labels: rawStudentPoints.map(([x, y]) => ptLabel(x, y)), style: { fill: color, r: 6 } });
    }
  } else {
    if (rawStudentPoints.length > 1) {
      const sorted = [...rawStudentPoints].sort((a, b) => a[0] - b[0]);
      series.push({ type: "polyline", points: sorted.map(toObj), style: { stroke: color, strokeWidth, opacity: 1 } });
    }
    if (rawStudentPoints.length > 0) {
      series.push({ type: "polyline", points: rawStudentPoints.map(toObj), style: { stroke: color, strokeWidth, opacity: 0.25 } });
    }
  }

  // Clean ordered polyline (masked to matched vertices) — linear applets only
  if (!isCurve && orderedStudentPoints.length > 1) {
    const matchedLookup = new Set(orderedStudentPoints.map(p => `${p[0]},${p[1]}`));
    const cleanPts  = expectedPoints.map(toObj);
    const cleanMask = expectedPoints.map(p => matchedLookup.has(`${p[0]},${p[1]}`));
    series.push({ type: "polyline", points: cleanPts, segmentMask: cleanMask, style: { stroke: color, strokeWidth, opacity: 1 } });
  }

  return series;
}

function buildSolutionSeries(state, config, activity, stepState) {
  const expectedPoints = state.expectedPoints;
  const series         = [];
  const showSolution   = stepState?.showSolution ?? state.showSolution;
  const submitted      = stepState?.submitted    ?? state.submitted;

  if (expectedPoints.length > 0 && (submitted || showSolution)) {
    const reflectedCurve = deriveReflectedCurve(config, activity);
    if (reflectedCurve) {
      series.push({ type: "curve", fn: reflectedCurve.fn, domain: reflectedCurve.domain, style: { stroke: "#16a34a", strokeWidth: 3 } });
    } else {
      series.push({ type: "polyline", points: expectedPoints.map(toObj), style: { stroke: "#16a34a", strokeWidth: 5 } });
    }
    series.push({ type: "points", points: expectedPoints.map(toObj), labels: expectedPoints.map(([x, y]) => ptLabel(x, y)), style: { fill: "#16a34a", r: 6 } });
  }

  return series;
}

function buildTableSeries(tableStepCfg, tableStepState) {
  const rows   = tableStepCfg.table?.rows ?? [];
  const series = [];
  const fmtN   = n => Number.isInteger(n) ? String(n) : parseFloat(n.toFixed(2)).toString();

  const tablePts = rows
    .filter(x => tableStepState.cellCorrect?.[String(x)] === true)
    .map(x => ({ x: Number(x), y: parseFloat(tableStepState.cellValues?.[String(x)]) }))
    .filter(p => Number.isFinite(p.y));

  if (tablePts.length > 0) {
    series.push({ type: "points", points: tablePts, labels: tablePts.map(p => `(${fmtN(p.x)}, ${fmtN(p.y)})`), style: { fill: "#2563eb", r: 6 } });
  }

  return series;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function buildSvg(state, width, height) {
  const config   = state.config;
  const activity = state.activity ?? null;
  const applet   = state.applet;

  const svgPad = 14;
  let svg = `<svg id="graphSvg" width="${width}" height="${height}" viewBox="${-svgPad} ${-svgPad} ${width + 2 * svgPad} ${height + 2 * svgPad}" xmlns="http://www.w3.org/2000/svg">`;
  svg = renderGrid(svg, state.view, { width, height });

  // Resolve active step — drives suppression logic and table series
  const currentStepCfg  = applet ? config.applet?.steps?.[applet.currentStep] : null;
  const tableStepCfg    = currentStepCfg?.type === "table-input" ? currentStepCfg : null;
  const tableStepState  = tableStepCfg ? applet.steps[tableStepCfg.id] : null;
  const isPlotAsEntered = tableStepCfg?.plotAsEntered === true;
  const tableRowSet     = isPlotAsEntered
    ? new Set((tableStepCfg.table?.rows ?? []).map(r => String(r)))
    : null;
  const hideOriginalCurve = isPlotAsEntered && !tableStepState?.graphed;

  const persistedGraph = applet?.persistedGraph ?? null;
  const showPersisted  = Boolean(persistedGraph?.length);

  const seriesList = [];

  // 1. Original (blue) series
  seriesList.push(...buildOriginalSeries(config, tableRowSet, hideOriginalCurve));

  // 2. Persisted graph (green) OR live student attempt
  if (showPersisted) {
    seriesList.push(...buildPersistedSeries(persistedGraph, config, activity));
  } else {
    const stepState = applet ? applet.steps[currentStepCfg?.id] : null;
    seriesList.push(...buildStudentSeries(state, config, stepState));

    // Solution overlay — only for graph-plot steps
    if (currentStepCfg?.type === "graph-plot") {
      seriesList.push(...buildSolutionSeries(state, config, activity, stepState));
    }
  }

  // 3. Table-input plotAsEntered dots (blue, appear one-by-one as student fills rows)
  if (isPlotAsEntered && tableStepState) {
    seriesList.push(...buildTableSeries(tableStepCfg, tableStepState));
  }

  svg = renderSeries(svg, seriesList, state.view, { width, height });
  svg += "</svg>";
  return svg;
}
