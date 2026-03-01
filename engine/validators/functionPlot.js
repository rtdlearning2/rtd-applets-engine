export function validate(state, config) {
  const activityState = state.activityState ?? {};
  const fn = activityState.evaluate;
  const tolerance = Number(activityState.tolerance ?? config?.activity?.config?.tolerance ?? 0.5);

  const student = state.studentPoints ?? [];

  if (!fn) {
    return {
      isCorrect: false,
      details: { message: "No function evaluator available for validation." }
    };
  }

  if (!student || student.length === 0) {
    return {
      isCorrect: false,
      details: { message: "Plot at least one point on the curve to submit." }
    };
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
