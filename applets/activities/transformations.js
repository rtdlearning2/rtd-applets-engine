// applets/activities/transformations.js
import { computeExpectedPoints } from "../../engine/utils/transformEngine.js";

export const activityType = "transformations";

/**
 * Derives the curve config for the transformed graph.
 * The engine calls this instead of its own hardcoded logic when this hook is present.
 * Returns { fn, domain } or null if not applicable.
 */
export function deriveCurve(config) {
  const curve = config.original?.curve;
  if (!curve) return null;
  const { fn, domain } = curve;
  const type = config.transform?.type;

  if (type === "reflect_y") {
    return { fn: fn.replace(/\bx\b/g, "(-x)"), domain: [-domain[1], -domain[0]] };
  }
  if (type === "reflect_x") {
    return { fn: `-(${fn})`, domain: [...domain] };
  }
  if (type === "scale") {
    const sx = Number(config.transform?.sx ?? 1);
    const sy = Number(config.transform?.sy ?? 1);
    let derivedFn = sx !== 1 ? fn.replace(/\bx\b/g, `(x/${sx})`) : fn;
    if (sy !== 1) derivedFn = `${sy} * (${derivedFn})`;
    return { fn: derivedFn, domain: [sx * domain[0], sx * domain[1]] };
  }
  if (type === "translate") {
    const dx = Number(config.transform?.dx ?? 0);
    const dy = Number(config.transform?.dy ?? 0);
    // horizontal shift: replace x with (x - dx) in formula
    let derivedFn = dx !== 0 ? fn.replace(/\bx\b/g, `(x-${dx})`) : fn;
    // vertical shift: add dy to the result
    if (dy !== 0) derivedFn = `(${derivedFn}) + ${dy}`;
    return { fn: derivedFn, domain: [domain[0] + dx, domain[1] + dx] };
  }
  return null;
}

/**
 * Returns invariant points for the transform (points that don't move).
 * The engine calls this instead of its own hardcoded logic when this hook is present.
 */
export function getInvariantPoints(config) {
  const type = config.transform?.type ?? "";
  const pts  = config.original?.points ?? [];

  const dedupe = arr => {
    const seen = new Set();
    return arr.filter(p => { const k = `${p[0]},${p[1]}`; return seen.has(k) ? false : seen.add(k); });
  };

  const xIntercepts = () => {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i]; const [x2, y2] = pts[i + 1];
      if (y1 === 0) out.push([x1, 0]);
      if (y2 === 0) out.push([x2, 0]);
      if ((y1 < 0 && y2 > 0) || (y1 > 0 && y2 < 0)) {
        const t = -y1 / (y2 - y1);
        out.push([Math.round((x1 + t * (x2 - x1)) * 1000) / 1000, 0]);
      }
    }
    return dedupe(out);
  };

  const yIntercepts = () => {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i]; const [x2, y2] = pts[i + 1];
      if (x1 === 0) out.push([0, y1]);
      if (x2 === 0) out.push([0, y2]);
      if ((x1 < 0 && x2 > 0) || (x1 > 0 && x2 < 0)) {
        const t = -x1 / (x2 - x1);
        out.push([0, Math.round((y1 + t * (y2 - y1)) * 1000) / 1000]);
      }
    }
    return dedupe(out);
  };

  if (type === "reflect_x") return xIntercepts();
  if (type === "reflect_y") return yIntercepts();
  if (type === "scale") {
    const sx = Number(config.transform?.sx ?? 1);
    const sy = Number(config.transform?.sy ?? 1);
    if (sx !== 1) return yIntercepts();
    if (sy !== 1) return xIntercepts();
  }
  return [];
}

export function createActivityState(config) {
  const originalPoints = config?.original?.points ?? [];
  const transform = config?.transform ?? {};

  const expectedPoints = computeExpectedPoints(originalPoints, transform);

  return {
    expectedPoints,
    studentPoints: []
  };
}

export function getInteractionHandlers() {
  // Use default engine handlers for placePoints by not overriding.
  return null;
}

export function validate(state, config) {
  const expected = state.expectedPoints ?? [];
  const student = state.studentPoints ?? [];
  const tolerance = Number(state.activityState?.tolerance ?? config?.activity?.config?.tolerance ?? 0);
  const requireExactCount = Boolean(config?.studentTask?.requireExactCount ?? config?.activity?.config?.requireExactCount ?? true);
  const orderPref = config?.studentTask?.order ?? config?.activity?.config?.order ?? null;

  let expectedToMatch = expected.slice();
  let studentToMatch = student.slice();

  if (orderPref === "left_to_right") {
    expectedToMatch.sort((a, b) => a[0] - b[0]);
    studentToMatch.sort((a, b) => a[0] - b[0]);
  } else if (orderPref === "right_to_left") {
    expectedToMatch.sort((a, b) => b[0] - a[0]);
    studentToMatch.sort((a, b) => b[0] - a[0]);
  }

  if (requireExactCount && studentToMatch.length !== expectedToMatch.length) {
    return { isCorrect: false, details: { message: `You must plot exactly ${expectedToMatch.length} points.` } };
  }

  const pointsMatch = (p1, p2) =>
    Math.abs(p1[0] - p2[0]) <= tolerance && Math.abs(p1[1] - p2[1]) <= tolerance;

  // Match each expected point to a student point (unordered set matching).
  // orderPref sorts both arrays the same way before positional comparison.
  if (orderPref) {
    for (let i = 0; i < expectedToMatch.length; i++) {
      if (!pointsMatch(expectedToMatch[i], studentToMatch[i])) {
        return { isCorrect: false, details: { message: "That graph is not correct. Try again." } };
      }
    }
    return { isCorrect: true, details: { message: "Correct! The transformation is accurate." } };
  }

  const unmatched = studentToMatch.slice();
  for (const exp of expectedToMatch) {
    const idx = unmatched.findIndex(stu => pointsMatch(exp, stu));
    if (idx === -1) return { isCorrect: false, details: { message: "That graph is not correct. Try again." } };
    unmatched.splice(idx, 1);
  }
  return { isCorrect: true, details: { message: "Correct! The transformation is accurate." } };
}
