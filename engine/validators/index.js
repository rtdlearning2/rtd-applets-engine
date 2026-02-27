import { validate as validateTransformations } from "./transformations.js";

const registry = {};

export function registerValidator(type, validator) {
  if (typeof type !== "string" || typeof validator !== "function") {
    return;
  }
  registry[type] = validator;
}

function getValidator(type) {
  if (type && registry[type]) {
    return registry[type];
  }
  return registry.transformations;
}

export function validate(activityType, state, config) {
  const validator = getValidator(activityType);
  if (validator) {
    return validator(state, config);
  }
  return {
    isCorrect: false,
    details: { message: "No validator registered." }
  };
}

registerValidator("transformations", validateTransformations);
