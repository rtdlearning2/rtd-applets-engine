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
