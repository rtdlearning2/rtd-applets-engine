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
