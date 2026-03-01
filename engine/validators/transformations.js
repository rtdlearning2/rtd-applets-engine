export function validate(state, config) {
  const expected = state.expectedPoints ?? [];
  const student = state.studentPoints ?? [];

  // Tolerance can be set on the activityState (from activity.createActivityState)
  // or in the config under activity.config.tolerance. Default to 0 for exact match.
  const tolerance = Number(
    state.activityState?.tolerance ?? config?.activity?.config?.tolerance ?? 0
  );

  // Configurable requirement for exact point count. Some exercises may allow
  // extra clicks (requireExactCount = false) and only require matching points.
  const requireExactCount = Boolean(
    config?.studentTask?.requireExactCount ?? config?.activity?.config?.requireExactCount ?? true
  );

  // Ordering preference: if the task expects left_to_right ordering, sort both
  // expected and student points by x before matching. Default: no reordering.
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
    return {
      isCorrect: false,
      details: {
        message: `You must plot exactly ${expectedToMatch.length} points.`
      }
    };
  }

  function pointsMatch(p1, p2) {
    return (
      Math.abs(p1[0] - p2[0]) <= tolerance &&
      Math.abs(p1[1] - p2[1]) <= tolerance
    );
  }

  // If exact count is not required, allow student to have extra points; use a
  // greedy matching approach where each expected point must be matched by some student point.
  if (!requireExactCount) {
    const unmatched = studentToMatch.slice();
    for (const exp of expectedToMatch) {
      const idx = unmatched.findIndex(stu => pointsMatch(exp, stu));
      if (idx === -1) {
        return { isCorrect: false, details: { message: "That graph is not correct. Try again." } };
      }
      unmatched.splice(idx, 1);
    }
    return { isCorrect: true, details: { message: "Correct! The transformation is accurate." } };
  }

  // Exact-count matching: expect the arrays to be same length and match pairwise
  for (let i = 0; i < expectedToMatch.length; i++) {
    const exp = expectedToMatch[i];
    const stu = studentToMatch[i];
    if (!pointsMatch(exp, stu)) {
      return { isCorrect: false, details: { message: "That graph is not correct. Try again." } };
    }
  }

  return { isCorrect: true, details: { message: "Correct! The transformation is accurate." } };
}
