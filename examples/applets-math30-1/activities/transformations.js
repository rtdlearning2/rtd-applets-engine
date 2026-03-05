// examples/applets-math30-1/activities/transformations.js
// A copy of the transformations activity placed in the content repo to demonstrate
// how content can own activity modules and register them with the engine.

import { computeExpectedPoints } from "../../../engine/utils/transformEngine.js";

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
  return null;
}
