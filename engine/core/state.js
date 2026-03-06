import { orderStudentPoints } from "../utils/validator.js";
import { getActivity } from "./activityRegistry.js";
import { computeExpectedPoints } from "../utils/transformEngine.js";

const DEFAULT_SNAP_STEP = 1;

function normalizeSnapStep(step) {
  const value = Number(step);
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_SNAP_STEP;
}

export function createAppState({ config, src }) {
  const interaction = config?.interaction ?? {};
  const feedback = config?.feedback ?? {};

  const normalizedConfig = {
    ...config,
    interaction: {
      ...interaction,
      snapStep: normalizeSnapStep(interaction.snapStep),
      hitRadiusPx: interaction.hitRadiusPx ?? 20
    },
    feedback: {
      showExpectedPointsOnFail: feedback.showExpectedPointsOnFail ?? false,
      showSolutionOnFail: feedback.showSolutionOnFail ?? false,
      allowHints: feedback.allowHints ?? false
    }
  };

  const originalPoints = normalizedConfig?.original?.points ?? [];

  // Activity integration: allow activities to supply expected outputs,
  // initial student data, and interaction handlers.
  const activityType = normalizedConfig.activityType ?? normalizedConfig.activity?.type ?? "transformations";
  const activity = getActivity(activityType);

  // Base state
  const state = {
    config: normalizedConfig,
    src,
    pageState: {},
    currentPageIndex: 0,
    // expectedPoints and student data may be provided by the activity; fall back to
    // the legacy transform computation if the activity does not supply expectedPoints.
    expectedPoints: [],
    studentPoints: [],
    orderedStudentPoints: [],
    activityState: {},
    activityHandlers: null,
  // UI progression for multi-part explorations
  currentStep: 1,
  // track drag/drop answers for parts 2 and 3
  part2Answer: { x: null, y: null },
  part2SelectedToken: null,
  part2Submitted: false,
  part2Correct: null,
  part2ShowSolution: false,
  part2Feedback: "",
  part3Answers: [],
  part3Answer: { p1: null, p2: null, coordType: null, value: null },
  part3SelectedToken: null,
  part3History: [],
  part3Submitted: false,
  part3Correct: null,
  part3ShowSolution: false,
  part3Feedback: "",
  persistedGraphPoints: null,
  persistedReferenceGraph: null,
  slideExplanationOpen: {},
    showSolution: false,
    lastSubmitCorrect: null,
    feedback: "",
    submitted: false,
    view: {
      xmin: normalizedConfig.grid.xmin,
      xmax: normalizedConfig.grid.xmax,
      ymin: normalizedConfig.grid.ymin,
      ymax: normalizedConfig.grid.ymax
    }
  };

  // Let activity populate initial activityState and expected outputs
  if (activity && typeof activity.createActivityState === "function") {
    try {
      const aState = activity.createActivityState(normalizedConfig, src);
      if (aState && typeof aState === "object") {
        state.activityState = aState;
        if (Array.isArray(aState.expectedPoints)) state.expectedPoints = aState.expectedPoints;
        if (Array.isArray(aState.studentPoints)) state.studentPoints = aState.studentPoints;
      }
    } catch (err) {
      console.error("activity.createActivityState failed:", err);
    }
  }

  // Backwards-compatible fallback: if nothing supplied expectedPoints, try transformEngine
  if (!Array.isArray(state.expectedPoints) || state.expectedPoints.length === 0) {
    state.expectedPoints = computeExpectedPoints(originalPoints, normalizedConfig?.transform);
  }

  // Allow activity to provide custom interaction handlers (object of handler functions)
  if (activity && typeof activity.getInteractionHandlers === "function") {
    try {
      state.activityHandlers = activity.getInteractionHandlers();
    } catch (err) {
      console.error("activity.getInteractionHandlers failed:", err);
    }
  }

state.undo = function () {
  state.studentPoints.pop();
  state.orderedStudentPoints = orderStudentPoints(
    state.expectedPoints,
    state.studentPoints
  );
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

  state.enableSolution = function () {
    state.showSolution = true;
  };

  state.clearSolution = function () {
    state.showSolution = false;
  };

  state.reset = function () {
    state.studentPoints = [];
    state.orderedStudentPoints = [];
    state.feedback = "";
    state.showSolution = false;
    state.lastSubmitCorrect = null;
    state.submitted = false;
  };

  return state;
}
