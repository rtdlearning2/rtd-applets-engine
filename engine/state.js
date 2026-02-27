import { computeExpectedPoints } from "./transformEngine.js";

export function createAppState({ config, src }) {
  const originalPoints = config?.original?.points ?? [];

  const expectedPoints = computeExpectedPoints(
    originalPoints,
    config?.transform
  );

  const state = {
    config,
    src,
    expectedPoints,
    studentPoints: [],
    showSolution: false,
    feedback: ""
  };

  state.undo = function () {
    state.studentPoints.pop();
  };

  state.reset = function () {
    state.studentPoints = [];
  };

  return state;
}