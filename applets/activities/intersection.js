// engine/activities/intersection.js
// Find approximate intersections of two functions by sampling.

export const activityType = "intersection";

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
  const exprA = activityCfg.functionA ?? activityCfg.fA ?? activityCfg.a ?? null;
  const exprB = activityCfg.functionB ?? activityCfg.fB ?? activityCfg.b ?? null;
  const domain = activityCfg.domain ?? [config?.grid?.xmin ?? -10, config?.grid?.xmax ?? 10];
  const step = Number(activityCfg.sampleStep ?? 0.5) || 0.5;
  const tol = Number(activityCfg.tolerance ?? 0.5) || 0.5;

  const fA = compileExpression(exprA);
  const fB = compileExpression(exprB);

  const expectedPoints = [];
  if (fA && fB) {
    // sample and find sign changes of h(x)=fA(x)-fB(x)
    let prevX = domain[0];
    let prevH;
    try {
      prevH = Number(fA(prevX)) - Number(fB(prevX));
    } catch (e) {
      prevH = NaN;
    }
    for (let x = domain[0] + step; x <= domain[1]; x = +(x + step).toFixed(10)) {
      let h;
      try {
        h = Number(fA(x)) - Number(fB(x));
      } catch (e) {
        h = NaN;
      }
      if (Number.isFinite(prevH) && Number.isFinite(h) && prevH === 0) {
        // already an exact root at prevX
        expectedPoints.push([prevX, Number(fA(prevX))]);
      } else if (Number.isFinite(prevH) && Number.isFinite(h) && prevH * h < 0) {
        // linear interpolation estimate
        const t = Math.abs(prevH) / (Math.abs(prevH) + Math.abs(h));
        const xi = prevX + (x - prevX) * (1 - t);
        const yi = Number(fA(xi));
        expectedPoints.push([+xi, yi]);
      }
      prevX = x;
      prevH = h;
    }
  }

  return { expectedPoints, studentPoints: [], evaluateA: fA, evaluateB: fB, tolerance: tol };
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
    return { isCorrect: false, details: { message: "No expected intersections computed." } };
  }
  if (!student || student.length < expected.length) {
    return { isCorrect: false, details: { message: `Plot the ${expected.length} intersection point(s).` } };
  }

  for (const exp of expected) {
    const found = student.find(st => Math.hypot(st[0] - exp[0], st[1] - exp[1]) <= tol);
    if (!found) {
      return { isCorrect: false, details: { message: "One or more intersection points are missing or off by more than tolerance." } };
    }
  }

  return { isCorrect: true, details: { message: "Correct — intersections found." } };
}
