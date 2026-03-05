// engine/activities/rationalPlot.js
// Example activity for rational expressions (handles discontinuities by skipping non-finite values).

export const activityType = "rationalPlot";

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
    for (let x = domain[0]; x <= domain[1]; x = +(x + step).toFixed(10)) {
      try {
        const y = Number(fn(x));
        if (Number.isFinite(y)) expectedPoints.push([+x, y]);
      } catch (e) {
        // skip points causing errors (vertical asymptotes)
      }
    }
  }

  return { expectedPoints, studentPoints: [], evaluate: fn, tolerance: tol };
}

export function getInteractionHandlers() {
  return null;
}

export function validate(state, config) {
  const aState = state.activityState ?? {};
  const fn = aState.evaluate;
  const tol = Number(aState.tolerance ?? config?.activity?.config?.tolerance ?? 0.5);
  const student = state.studentPoints ?? [];

  if (!fn) return { isCorrect: false, details: { message: "No function evaluator available." } };
  if (!student || student.length === 0) return { isCorrect: false, details: { message: "Plot at least one point." } };

  for (const p of student) {
    const x = Number(p[0]);
    const y = Number(p[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return { isCorrect: false, details: { message: "Invalid student point." } };
    let expectedY;
    try { expectedY = Number(fn(x)); } catch (e) { return { isCorrect: false, details: { message: "Evaluation error." } }; }
    if (!Number.isFinite(expectedY) || Math.abs(expectedY - y) > tol) {
      return { isCorrect: false, details: { message: "Point not on curve within tolerance." } };
    }
  }

  return { isCorrect: true, details: { message: "Correct — points match the rational expression (within tolerance)." } };
}
