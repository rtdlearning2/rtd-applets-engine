const registry = new Map();

const LAZY_PAGE_MAP = {
  "graph-plot":             () => import("./graphPlotPage.js").then(m => m.graphPlotPage),
  "drag-drop-fill":         () => import("./dragDropFillPage.js").then(m => m.dragDropFillPage),
  "multiple-choice":        () => import("./multipleChoicePage.js").then(m => m.multipleChoicePage),
  "sort-order":             () => import("./sortOrderPage.js").then(m => m.sortOrderPage),
  "match-pairs":            () => import("./matchPairsPage.js").then(m => m.matchPairsPage),
  "numeric-input":          () => import("./numericInputPage.js").then(m => m.numericInputPage),
  "table-complete":         () => import("./tableCompletePage.js").then(m => m.tableCompletePage),
  "true-false-grid":        () => import("./trueFalseGridPage.js").then(m => m.trueFalseGridPage),
  "proof-steps":            () => import("./proofStepsPage.js").then(m => m.proofStepsPage),
  "graph-identify":         () => import("./graphIdentifyPage.js").then(m => m.graphIdentifyPage),
  "transformation-builder": () => import("./transformationBuilderPage.js").then(m => m.transformationBuilderPage),
};

export async function preloadPageTypes(pages) {
  const types = [...new Set(pages.map(p => p?.type).filter(Boolean))];
  await Promise.all(
    types
      .filter(type => LAZY_PAGE_MAP[type] && !registry.has(type))
      .map(type => LAZY_PAGE_MAP[type]().then(renderer => registry.set(type, renderer)))
  );
}

export const getPageRenderer = (type) => registry.get(type);

export const getAllPageRenderers = () => Array.from(registry.values());
