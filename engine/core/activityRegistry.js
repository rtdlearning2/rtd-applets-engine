// engine/activityRegistry.js
// Activity registry. Activities must export:
// - activityType: string
// - createActivityState(config, src) -> object
// - getInteractionHandlers() -> { modeName: handler } | null
// - validate(state, config) -> { isCorrect, details }

const registry = new Map();

export function registerActivity(activityModule) {
  if (!activityModule || !activityModule.activityType) return;
  registry.set(activityModule.activityType, activityModule);
}

export function getActivity(type) {
  return registry.get(type);
}

export function listActivities() {
  return Array.from(registry.keys());
}
