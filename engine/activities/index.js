
// engine/activities/index.js
// Simple activity registry. Activities should export at least:
// - activityType: string
// - createActivityState(config, src) -> object
// - getInteractionHandlers() -> { modeName: handler }

const registry = new Map();

export function registerActivity(activityModule) {
  if (!activityModule || !activityModule.activityType) return;
  registry.set(activityModule.activityType, activityModule);
}

export function getActivity(type) {
  return registry.get(type);
}

// Auto-register built-in example activities
// Auto-register built-in example activities (excluding `transformations`)
// so that content repos can provide their own `transformations` activity if desired.
import * as functionPlot from "./functionPlot.js";
import * as intersection from "./intersection.js";
import * as extrema from "./extrema.js";
import * as rationalPlot from "./rationalPlot.js";

registerActivity(functionPlot);
registerActivity(intersection);
registerActivity(extrema);
registerActivity(rationalPlot);

export function listActivities() {
  return Array.from(registry.keys());
}
