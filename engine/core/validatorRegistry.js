// engine/validatorRegistry.js
// Validators are registered dynamically when their activity module is loaded.
// Each activity module (applets/activities/*.js) exports its own validate() function,
// which configLoader registers here via registerValidator().

const registry = {};

export function registerValidator(type, validator) {
  if (typeof type !== "string" || typeof validator !== "function") return;
  registry[type] = validator;
}

export function validate(activityType, state, config) {
  const validator = activityType && registry[activityType];
  if (validator) {
    return validator(state, config);
  }
  return { isCorrect: false, details: { message: "No validator registered." } };
}
