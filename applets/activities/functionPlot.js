// engine/activities/functionPlot.js
// Example activity that samples a function expression over a domain.

export const activityType = "functionPlot";

function compileExpression(expr) {
  if (!expr || typeof expr !== "string") return null;
  // Create a function of x using Math scope available via with().
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("x", `with(Math){ return (${expr}); }`);
    // quick test
    fn(0);
    return fn;
  } catch (err) {
    console.error("Failed to compile function expression:", expr, err);
    return null;
  }
}

export function createActivityState(config, src) {
  const activityCfg = config?.activity?.config ?? {};
  const expr = activityCfg.function ?? activityCfg.expr ?? activityCfg.f ?? null;
  const domain = activityCfg.domain ?? [config?.grid?.xmin ?? -10, config?.grid?.xmax ?? 10];
  const step = Number(activityCfg.sampleStep ?? 0.5) || 0.5;
  const tolerance = Number(activityCfg.tolerance ?? 0.5) || 0.5;

  const fn = compileExpression(expr);

  const expectedPoints = [];
  if (fn) {
    for (let x = domain[0]; x <= domain[1]; x = +(x + step).toFixed(10)) {
      try {
        const y = Number(fn(x));
        if (Number.isFinite(y)) expectedPoints.push([+x, y]);
      } catch (err) {
        // skip
      }
    }
  }

  return {
    expectedPoints,
    studentPoints: [],
    // provide evaluator and tolerance for validators
    evaluate: fn,
    tolerance
  };
}

export function getInteractionHandlers() {
  // Rely on engine defaults for now. Activities can override modes such as
  // `sampleOnClick` or `drawPolyline` by returning handler functions here.
  return null;
}

export function validate(state, config) {
  const activityState = state.activityState ?? {};
  const fn = activityState.evaluate;
  const tolerance = Number(activityState.tolerance ?? config?.activity?.config?.tolerance ?? 0.5);
  const student = state.studentPoints ?? [];

  if (!fn) {
    return { isCorrect: false, details: { message: "No function evaluator available for validation." } };
  }
  if (!student || student.length === 0) {
    return { isCorrect: false, details: { message: "Plot at least one point on the curve to submit." } };
  }

  for (const p of student) {
    const x = Number(p[0]);
    const y = Number(p[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return { isCorrect: false, details: { message: "Invalid student points." } };
    }
    let expectedY;
    try {
      expectedY = Number(fn(x));
    } catch (err) {
      return { isCorrect: false, details: { message: "Failed to evaluate function at student x." } };
    }
    if (!Number.isFinite(expectedY) || Math.abs(expectedY - y) > tolerance) {
      return { isCorrect: false, details: { message: "One or more points are not on the curve (within tolerance)." } };
    }
  }

  return { isCorrect: true, details: { message: "Correct — points lie on the function (within tolerance)." } };
}
