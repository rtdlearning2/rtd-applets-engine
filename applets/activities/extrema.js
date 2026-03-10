// engine/activities/extrema.js
// Find local maxima and minima by sampling a function over a domain.

export const activityType = "extrema";

function compileExpression(expr) {
  if (!expr || typeof expr !== "string") return null;
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("x", `with(Math){ return (${expr}); }`);
    fn(0);
    return fn;
  } catch (err) {
    console.error("Failed to compile expression:", expr, err);
    return null;
  }
}

export function createActivityState(config, src) {
  const activityCfg = config?.activity?.config ?? {};
  const expr = activityCfg.function ?? activityCfg.expr ?? activityCfg.f ?? null;
  const domain = activityCfg.domain ?? [config?.grid?.xmin ?? -10, config?.grid?.xmax ?? 10];
  const step = Number(activityCfg.sampleStep ?? 0.5) || 0.5;
  const tol = Number(activityCfg.tolerance ?? 0.5) || 0.5;

  const fn = compileExpression(expr);
  const expectedPoints = [];

  if (fn) {
    const samples = [];
    for (let x = domain[0]; x <= domain[1]; x = +(x + step).toFixed(10)) {
      try {
        const y = Number(fn(x));
        if (Number.isFinite(y)) samples.push([+x, y]);
      } catch (e) {
        // skip
      }
    }

    for (let i = 1; i < samples.length - 1; i++) {
      const y0 = samples[i - 1][1];
      const y1 = samples[i][1];
      const y2 = samples[i + 1][1];
      if (y1 > y0 && y1 > y2) expectedPoints.push(samples[i]);
      if (y1 < y0 && y1 < y2) expectedPoints.push(samples[i]);
    }
  }

  return { expectedPoints, studentPoints: [], evaluate: fn, tolerance: tol };
}

export function getInteractionHandlers() {
  return null;
}

export function validate(state, config) {
  const aState = state.activityState ?? {};
  const expected = aState.expectedPoints ?? [];
  const student = state.studentPoints ?? [];
  const tol = Number(aState.tolerance ?? config?.activity?.config?.tolerance ?? 0.5);

  if (!expected || expected.length === 0) {
    return { isCorrect: false, details: { message: "No extrema computed for this function." } };
  }
  if (!student || student.length < expected.length) {
    return { isCorrect: false, details: { message: `Plot the ${expected.length} extrema points.` } };
  }

  for (const exp of expected) {
    const found = student.find(st => Math.hypot(st[0] - exp[0], st[1] - exp[1]) <= tol);
    if (!found) {
      return { isCorrect: false, details: { message: "One or more extrema are missing or outside tolerance." } };
    }
  }

  return { isCorrect: true, details: { message: "Correct — extrema located." } };
}
