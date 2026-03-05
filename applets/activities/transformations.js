// applets/activities/transformations.js
import { computeExpectedPoints } from "../../engine/utils/transformEngine.js";

export const activityType = "transformations";

export function createActivityState(config, src) {
  const originalPoints = config?.original?.points ?? [];
  const transform = config?.transform ?? {};

  const expectedPoints = computeExpectedPoints(originalPoints, transform);

  return {
    expectedPoints,
    studentPoints: []
  };
}

export function getInteractionHandlers() {
  // Use default engine handlers for placePoints by not overriding.
  return null;
}

export function validate(state, config) {
  const expected = state.expectedPoints ?? [];
  const student = state.studentPoints ?? [];
  const tolerance = Number(state.activityState?.tolerance ?? config?.activity?.config?.tolerance ?? 0);
  const requireExactCount = Boolean(config?.studentTask?.requireExactCount ?? config?.activity?.config?.requireExactCount ?? true);
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
    return { isCorrect: false, details: { message: `You must plot exactly ${expectedToMatch.length} points.` } };
  }

  const pointsMatch = (p1, p2) =>
    Math.abs(p1[0] - p2[0]) <= tolerance && Math.abs(p1[1] - p2[1]) <= tolerance;

  if (!requireExactCount) {
    const unmatched = studentToMatch.slice();
    for (const exp of expectedToMatch) {
      const idx = unmatched.findIndex(stu => pointsMatch(exp, stu));
      if (idx === -1) return { isCorrect: false, details: { message: "That graph is not correct. Try again." } };
      unmatched.splice(idx, 1);
    }
    return { isCorrect: true, details: { message: "Correct! The transformation is accurate." } };
  }

  for (let i = 0; i < expectedToMatch.length; i++) {
    if (!pointsMatch(expectedToMatch[i], studentToMatch[i])) {
      return { isCorrect: false, details: { message: "That graph is not correct. Try again." } };
    }
  }

  return { isCorrect: true, details: { message: "Correct! The transformation is accurate." } };
}
