import { getPageRenderer } from "../pages/index.js";

const ensureArray = (value) => Array.isArray(value) ? value : [];
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

const validators = {
  "applet":     () => [],   // validation handled at runtime by the applet renderer
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
