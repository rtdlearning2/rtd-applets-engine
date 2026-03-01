// engine/activities/transformations.js
import { computeExpectedPoints } from "../transformEngine.js";

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
