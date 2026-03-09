import { getPageRenderer } from "../pages/index.js";

const ensureArray = (value) => Array.isArray(value) ? value : [];
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const validators = {
  "applet": (page) => {
    const errors = [];
    const KNOWN_STEP_TYPES = new Set(["graph-plot", "drag-drop-mapping", "drag-drop-sentences", "table-input"]);

    // ── grid ──────────────────────────────────────────────────────────────────
    const grid = page?.grid;
    if (!isObject(grid)) {
      errors.push("missing grid");
    } else {
      for (const k of ["xmin", "xmax", "ymin", "ymax"]) {
        if (typeof grid[k] !== "number") errors.push(`grid.${k} must be a number`);
      }
    }

    // ── original ──────────────────────────────────────────────────────────────
    const original = page?.original;
    if (!isObject(original)) {
      errors.push("missing original");
    } else {
      const hasCurve  = isObject(original.curve)  && typeof original.curve.fn === "string";
      const hasPoints = Array.isArray(original.points) && original.points.length > 0;
      if (!hasCurve && !hasPoints) errors.push("original must have curve.fn or points[]");
      if (isObject(original.curve)) {
        if (typeof original.curve.fn !== "string") errors.push("original.curve.fn must be a string");
        if (!Array.isArray(original.curve.domain) || original.curve.domain.length !== 2)
          errors.push("original.curve.domain must be [min, max]");
      }
    }

    // ── transform (optional) ──────────────────────────────────────────────────
    if (page?.transform !== undefined) {
      if (!isObject(page.transform))              errors.push("transform must be an object");
      else if (typeof page.transform.type !== "string") errors.push("transform.type must be a string");
    }

    // ── activity (required only when a graph-plot step is present) ────────────
    const activity = page?.activity;
    const hasGraphPlot = Array.isArray(page?.applet?.steps) && page.applet.steps.some(s => s?.type === "graph-plot");
    if (isObject(activity)) {
      if (typeof activity.type          !== "string") errors.push("activity.type must be a string");
      if (typeof activity.activityModule !== "string") errors.push("activity.activityModule must be a string");
    } else if (hasGraphPlot) {
      errors.push("missing activity (required when graph-plot step is present)");
    }

    // ── applet.steps ──────────────────────────────────────────────────────────
    const applet = page?.applet;
    if (!isObject(applet)) {
      errors.push("missing applet");
      return errors;
    }
    if (!Array.isArray(applet.steps) || applet.steps.length === 0) {
      errors.push("applet.steps must be a non-empty array");
      return errors;
    }

    const seenIds = new Set();
    applet.steps.forEach((step, i) => {
      const s = step?.id ? `step[${step.id}]` : `step[${i}]`;

      if (!step?.id)              errors.push(`${s}: missing id`);
      else if (seenIds.has(step.id)) errors.push(`${s}: duplicate id "${step.id}"`);
      else seenIds.add(step.id);

      if (!step?.type) { errors.push(`${s}: missing type`); return; }
      if (!KNOWN_STEP_TYPES.has(step.type)) { errors.push(`${s}: unknown type "${step.type}"`); return; }

      if (step.type === "table-input") {
        if (!isObject(step.table)) {
          errors.push(`${s}: missing table`);
        } else {
          if (typeof step.table.fn !== "string" || !step.table.fn)
            errors.push(`${s}: table.fn must be a non-empty string`);
          if (!Array.isArray(step.table.rows) || step.table.rows.length === 0)
            errors.push(`${s}: table.rows must be a non-empty array`);
        }
        if (step.plotAsEntered !== true) errors.push(`${s}: plotAsEntered must be true`);
      }

      if (step.type === "drag-drop-mapping" || step.type === "drag-drop-sentences") {
        const sentencesOrSlots = step.type === "drag-drop-sentences" ? step.sentences : step.slots;
        const sentencesKey     = step.type === "drag-drop-sentences" ? "sentences" : "slots";
        if (!Array.isArray(sentencesOrSlots) || sentencesOrSlots.length === 0)
          errors.push(`${s}: ${sentencesKey} must be a non-empty array`);
        if (!Array.isArray(step.tokenBanks) || step.tokenBanks.length === 0)
          errors.push(`${s}: tokenBanks must be a non-empty array`);
        if (!isObject(step.correctAnswer) || Object.keys(step.correctAnswer).length === 0)
          errors.push(`${s}: correctAnswer must be a non-empty object`);
      }

      if (step.type === "graph-plot") {
        if (!step.successMessage) errors.push(`${s}: successMessage is required`);
      }
    });

    return errors;
  },
  "graph-plot": () => [],
  "drag-drop-fill": (page) => {
    const errors = [];
    if (!Array.isArray(page?.tokens)) errors.push("tokens must be an array");
    if (!Array.isArray(page?.blanks)) errors.push("blanks must be an array");
    if (!isObject(page?.correctAnswers)) {
      errors.push("correctAnswers must be an object");
    } else {
      const blanks = ensureArray(page?.blanks);
      const missing = blanks.filter(blank => page.correctAnswers[blank] === undefined);
      if (missing.length > 0) {
        errors.push(`correctAnswers missing keys: ${missing.join(", ")}`);
      }
    }
    return errors;
  },
  "multiple-choice": (page) => {
    const errors = [];
    if (!Array.isArray(page?.choices)) errors.push("choices must be an array");
    const multi = Boolean(page?.multiSelect);
    if (multi) {
      if (!Array.isArray(page?.correctIndices)) errors.push("correctIndices must be an array when multiSelect is true");
    } else if (page?.correctIndex === undefined) {
      errors.push("correctIndex is required when multiSelect is false");
    }
    return errors;
  },
  "sort-order": (page) => {
    const errors = [];
    if (!Array.isArray(page?.items)) errors.push("items must be an array");
    if (!Array.isArray(page?.correctOrder)) {
      errors.push("correctOrder must be an array");
    } else if (page?.items && page.correctOrder.length !== page.items.length) {
      errors.push("correctOrder length must match items length");
    }
    return errors;
  },
  "match-pairs": (page) => {
    const errors = [];
    if (!Array.isArray(page?.leftItems)) errors.push("leftItems must be an array");
    if (!Array.isArray(page?.rightItems)) errors.push("rightItems must be an array");
    if (!isObject(page?.correctPairs)) errors.push("correctPairs must be an object");
    return errors;
  },
  "numeric-input": (page) => {
    const errors = [];
    if (page?.correctValue === undefined) errors.push("correctValue is required");
    if (page?.tolerance !== undefined && !Number.isFinite(Number(page.tolerance))) {
      errors.push("tolerance must be a number if provided");
    }
    return errors;
  },
  "table-complete": (page) => {
    const errors = [];
    if (!Array.isArray(page?.columns)) errors.push("columns must be an array");
    if (!Array.isArray(page?.rows)) errors.push("rows must be an array");
    if (!Array.isArray(page?.correctRows)) errors.push("correctRows must be an array");
    return errors;
  },
  "true-false-grid": (page) => {
    const errors = [];
    if (!Array.isArray(page?.statements)) errors.push("statements must be an array");
    if (!Array.isArray(page?.correctAnswers)) {
      errors.push("correctAnswers must be an array");
    } else if (page?.statements && page.correctAnswers.length !== page.statements.length) {
      errors.push("correctAnswers length must match statements length");
    }
    return errors;
  },
  "proof-steps": (page) => {
    const errors = [];
    if (!Array.isArray(page?.steps)) errors.push("steps must be an array");
    if (!Array.isArray(page?.correctOrder)) errors.push("correctOrder must be an array");
    return errors;
  },
  "graph-identify": (page) => {
    const errors = [];
    if (!Array.isArray(page?.targets)) errors.push("targets must be an array");
    if (!Array.isArray(page?.correctTargets)) errors.push("correctTargets must be an array");
    return errors;
  },
  "transformation-builder": (page) => {
    const errors = [];
    if (!Array.isArray(page?.operations)) errors.push("operations must be an array");
    if (!Array.isArray(page?.correctOperations)) errors.push("correctOperations must be an array");
    return errors;
  }
};

export const validatePageConfig = (config) => {
  const errors = [];
  const pages = ensureArray(config?.pages);

  pages.forEach((page, index) => {
    const label = page?.id ?? `page-${index + 1}`;
    const type = page?.type;

    if (!type) {
      errors.push(`[${label}] missing type`);
      return;
    }

    const renderer = getPageRenderer(type);
    if (!renderer) {
      errors.push(`[${label}] unknown type: ${type}`);
      return;
    }

    const validator = validators[type];
    if (validator) {
      validator(page).forEach(msg => errors.push(`[${label}] ${msg}`));
    }
  });

  return errors;
};
