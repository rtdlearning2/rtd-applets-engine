import { orderStudentPoints } from "../utils/validator.js";
import { getActivity } from "./activityRegistry.js";
import { computeExpectedPoints } from "../utils/transformEngine.js";
import { initAppletState } from "./appletState.js";

const DEFAULT_SNAP_STEP = 1;

function normalizeSnapStep(step) {
  const value = Number(step);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_SNAP_STEP;
}

export function createAppState({ config, src }) {
  const interaction = config?.interaction ?? {};
  const feedback    = config?.feedback    ?? {};

  const normalizedConfig = {
    ...config,
    interaction: {
      ...interaction,
      snapStep:    normalizeSnapStep(interaction.snapStep),
      hitRadiusPx: interaction.hitRadiusPx ?? 20
    },
    feedback: {
      showExpectedPointsOnFail: feedback.showExpectedPointsOnFail ?? false,
      showSolutionOnFail:       feedback.showSolutionOnFail       ?? false,
      allowHints:               feedback.allowHints               ?? false
    }
  };

  const originalPoints = normalizedConfig?.original?.points ?? [];
  const activityType   = normalizedConfig.activityType ?? normalizedConfig.activity?.type ?? "transformations";
  const activity       = getActivity(activityType);

  const state = {
    config:   normalizedConfig,
    src,

    // Page-system state (unchanged)
    pageState:        {},
    currentPageIndex: 0,

    // Graph interaction state (used by both graph-plot step and interaction.js)
    expectedPoints:       [],
    studentPoints:        [],
    orderedStudentPoints: [],

    // Activity extension points
    activity:         activity ?? null,   // the loaded activity module
    activityState:    {},
    activityHandlers: null,

    // Applet step state — null when config has no applet.steps (non-applet configs)
    applet: initAppletState(normalizedConfig),

    // Legacy top-level submission state (used by validator / SVG overlay)
    showSolution:      false,
    lastSubmitCorrect: null,
    feedback:          "",
    submitted:         false,

    view: {
      xmin: normalizedConfig.grid?.xmin ?? -10,
      xmax: normalizedConfig.grid?.xmax ??  10,
      ymin: normalizedConfig.grid?.ymin ?? -10,
      ymax: normalizedConfig.grid?.ymax ??  10
    }
  };

  // Let activity populate initial activityState and expected outputs
  if (activity && typeof activity.createActivityState === "function") {
    try {
      const aState = activity.createActivityState(normalizedConfig, src);
      if (aState && typeof aState === "object") {
        state.activityState = aState;
        if (Array.isArray(aState.expectedPoints)) state.expectedPoints = aState.expectedPoints;
        if (Array.isArray(aState.studentPoints))  state.studentPoints  = aState.studentPoints;
      }
    } catch (err) {
      console.error("activity.createActivityState failed:", err);
    }
  }

  // Fallback: compute expectedPoints from transform if activity didn't supply them
  if (!Array.isArray(state.expectedPoints) || state.expectedPoints.length === 0) {
    state.expectedPoints = computeExpectedPoints(originalPoints, normalizedConfig?.transform);
  }

  if (activity && typeof activity.getInteractionHandlers === "function") {
    try {
      state.activityHandlers = activity.getInteractionHandlers();
    } catch (err) {
      console.error("activity.getInteractionHandlers failed:", err);
    }
  }

  // --- State mutation helpers ---

  state.undo = function () {
    state.studentPoints.pop();
    state.orderedStudentPoints = orderStudentPoints(state.expectedPoints, state.studentPoints);
    state.feedback = "";
  };

  state.zoomIn = function () {
    const xRange = state.view.xmax - state.view.xmin;
    const yRange = state.view.ymax - state.view.ymin;
    const cx = (state.view.xmin + state.view.xmax) / 2;
    const cy = (state.view.ymin + state.view.ymax) / 2;
    state.view.xmin = cx - (xRange * 0.8) / 2;
    state.view.xmax = cx + (xRange * 0.8) / 2;
    state.view.ymin = cy - (yRange * 0.8) / 2;
    state.view.ymax = cy + (yRange * 0.8) / 2;
  };

  state.zoomOut = function () {
    const xRange = state.view.xmax - state.view.xmin;
    const yRange = state.view.ymax - state.view.ymin;
    const cx = (state.view.xmin + state.view.xmax) / 2;
    const cy = (state.view.ymin + state.view.ymax) / 2;
    state.view.xmin = cx - (xRange * 1.2) / 2;
    state.view.xmax = cx + (xRange * 1.2) / 2;
    state.view.ymin = cy - (yRange * 1.2) / 2;
    state.view.ymax = cy + (yRange * 1.2) / 2;
  };

  state.enableSolution = function () { state.showSolution = true; };
  state.clearSolution  = function () { state.showSolution = false; };

  state.reset = function () {
    state.studentPoints        = [];
    state.orderedStudentPoints = [];
    state.feedback             = "";
    state.showSolution         = false;
    state.lastSubmitCorrect    = null;
    state.submitted            = false;
  };

  return state;
}
