// engine/core/computedTokens.js
// Resolves "computed:*" sources in token banks and correct answers.

import { renderPointHtml } from "../renderers/mathRenderer.js";

// --- Geometry helpers ---

function dedupe(points) {
  const seen = new Set();
  return points.filter(p => {
    const key = `${p[0]},${p[1]}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function computeXIntercepts(points) {
  const intercepts = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    if (y1 === 0) intercepts.push([x1, 0]);
    if (y2 === 0) intercepts.push([x2, 0]);
    if ((y1 < 0 && y2 > 0) || (y1 > 0 && y2 < 0)) {
      const t = (0 - y1) / (y2 - y1);
      const x = x1 + t * (x2 - x1);
      intercepts.push([Math.round(x * 1000) / 1000, 0]);
    }
  }
  return dedupe(intercepts);
}

function computeYIntercepts(points) {
  const intercepts = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    if (x1 === 0) intercepts.push([0, y1]);
    if (x2 === 0) intercepts.push([0, y2]);
    if ((x1 < 0 && x2 > 0) || (x1 > 0 && x2 < 0)) {
      const t = (0 - x1) / (x2 - x1);
      const y = y1 + t * (y2 - y1);
      intercepts.push([0, Math.round(y * 1000) / 1000]);
    }
  }
  return dedupe(intercepts);
}

// --- Public API ---

/**
 * Returns the invariant points for a given transform type and original point set.
 * If the loaded activity module exports getInvariantPoints, that is called first.
 * Built-in fallback handles: reflect_x, reflect_y, scale.
 */
export function getInvariantPoints(config, activity) {
  // Activity hook takes priority — new transforms live entirely in the activity module
  if (typeof activity?.getInvariantPoints === "function") {
    return activity.getInvariantPoints(config);
  }
  // Built-in fallback for known transform types
  const transformType = config.transform?.type ?? "";
  const originalPoints = config.original?.points ?? [];
  if (transformType === "reflect_x") return computeXIntercepts(originalPoints);
  if (transformType === "reflect_y") return computeYIntercepts(originalPoints);
  if (transformType === "scale") {
    const sx = Number(config.transform?.sx ?? 1);
    const sy = Number(config.transform?.sy ?? 1);
    if (sx !== 1) return computeYIntercepts(originalPoints);
    if (sy !== 1) return computeXIntercepts(originalPoints);
  }
  return [];
}

/**
 * Resolves a token bank's "source" field to an array of token objects.
 * Handles "computed:invariant-points" and falls back to explicit bank.tokens.
 */
export function resolveTokenBank(bank, config, activity) {
  if (!bank.source) return bank.tokens ?? [];

  if (bank.source === "computed:invariant-points") {
    const invariantPoints = getInvariantPoints(config, activity);
    const tokens = invariantPoints.map(coords => ({
      value: `${coords[0]},${coords[1]}`,
      type: "point",
      group: bank.group ?? "point",
      coords,
      html: renderPointHtml(coords)
    }));

    // Append distractors (won't duplicate invariant points)
    if (Array.isArray(bank.distractors)) {
      for (const coords of bank.distractors) {
        const key = `${coords[0]},${coords[1]}`;
        if (!tokens.some(t => t.value === key)) {
          tokens.push({
            value: key,
            type: "point",
            group: bank.group ?? "point",
            coords,
            html: renderPointHtml(coords)
          });
        }
      }
    }

    return tokens;
  }

  return bank.tokens ?? [];
}

/**
 * Returns true if `answerValue` satisfies `correctValue` for a given slot.
 * Handles "computed:invariant-point" (any invariant point is valid).
 */
export function isCorrectSlotValue(correctValue, answerValue, config, activity) {
  if (typeof correctValue === "string" && correctValue.startsWith("computed:invariant-point")) {
    const invariantPoints = getInvariantPoints(config, activity);
    const validKeys = new Set(invariantPoints.map(p => `${p[0]},${p[1]}`));
    return validKeys.has(answerValue);
  }
  return correctValue === answerValue;
}

/**
 * Validates all slots in a drag-drop step against step.correctAnswer.
 * Also enforces uniqueness among slots sharing "computed:invariant-point".
 */
export function validateDragDropAnswers(step, stepState, config, activity) {
  for (const [slotId, correctValue] of Object.entries(step.correctAnswer)) {
    const answer = stepState.answers[slotId];
    if (!answer) return false;
    if (!isCorrectSlotValue(correctValue, answer, config, activity)) return false;
  }

  // Cross-slot: multiple "computed:invariant-point" slots must have distinct values
  const invariantSlots = Object.entries(step.correctAnswer)
    .filter(([, v]) => v === "computed:invariant-point")
    .map(([k]) => k);
  if (invariantSlots.length > 1) {
    const answers = invariantSlots.map(k => stepState.answers[k]);
    if (new Set(answers).size < answers.length) return false;
  }

  return true;
}

/**
 * Resolves step.correctAnswer into concrete values (no "computed:*" strings).
 * Used when showing the solution.
 */
export function resolveSolutionAnswers(step, config, activity) {
  const invariantPoints = getInvariantPoints(config, activity);
  let invariantIdx = 0;
  const resolved = {};
  for (const [slotId, correctValue] of Object.entries(step.correctAnswer)) {
    if (correctValue === "computed:invariant-point") {
      const pt = invariantPoints[invariantIdx++];
      resolved[slotId] = pt ? `${pt[0]},${pt[1]}` : null;
    } else {
      resolved[slotId] = correctValue;
    }
  }
  return resolved;
}

/**
 * Returns all slot IDs for a step (used to check if all slots are filled).
 */
export function getStepSlotIds(step) {
  if (step.type === "drag-drop-mapping") {
    return step.slots.map(s => s.id);
  }
  if (step.type === "drag-drop-sentences") {
    return step.sentences.flatMap(s =>
      s.slots.filter(sl => sl.id).map(sl => sl.id)
    );
  }
  return [];
}
