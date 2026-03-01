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
