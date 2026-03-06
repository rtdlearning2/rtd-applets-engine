// engine/activities/quadraticRoots.js
// Activity: student plots the real roots of a quadratic on a number line / coordinate grid.
// Self-contained — exports both the activity contract AND validate(), so configLoader
// can register both with a single dynamic import. No edits to core files needed.

export const activityType = "quadraticRoots";

function computeRoots(a, b, c) {
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return [];
  if (discriminant === 0) return [[-b / (2 * a), 0]];
  const sqrtD = Math.sqrt(discriminant);
  return [
    [(-b - sqrtD) / (2 * a), 0],
    [(-b + sqrtD) / (2 * a), 0]
  ];
}

export function createActivityState(config) {
  const cfg = config?.activity?.config ?? {};
  const a = Number(cfg.a ?? 1);
  const b = Number(cfg.b ?? 0);
  const c = Number(cfg.c ?? 0);
  const tolerance = Number(cfg.tolerance ?? 0.5);

  return {
    a, b, c,
    tolerance,
    expectedPoints: computeRoots(a, b, c),
    studentPoints: []
  };
}

export function getInteractionHandlers() {
  return null;
}

export function validate(state) {
  const aState = state.activityState ?? {};
  const expected = aState.expectedPoints ?? [];
  const student = state.studentPoints ?? [];
  const tol = Number(aState.tolerance ?? 0.5);

  if (expected.length === 0) {
    return { isCorrect: false, details: { message: "This quadratic has no real roots." } };
  }

  if (student.length < expected.length) {
    return {
      isCorrect: false,
      details: { message: `Plot all ${expected.length} root(s) on the graph.` }
    };
  }

  for (const exp of expected) {
    const hit = student.find(s => Math.hypot(s[0] - exp[0], s[1] - exp[1]) <= tol);
    if (!hit) {
      return { isCorrect: false, details: { message: "One or more roots are missing or outside tolerance." } };
    }
  }

  return { isCorrect: true, details: { message: "Correct! All roots are placed accurately." } };
}
