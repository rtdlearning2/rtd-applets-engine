import { graphPlotPage } from "./graphPlotPage.js";
import { dragDropFillPage } from "./dragDropFillPage.js";
import { multipleChoicePage } from "./multipleChoicePage.js";
import { sortOrderPage } from "./sortOrderPage.js";
import { matchPairsPage } from "./matchPairsPage.js";
import { numericInputPage } from "./numericInputPage.js";
import { tableCompletePage } from "./tableCompletePage.js";
import { trueFalseGridPage } from "./trueFalseGridPage.js";
import { proofStepsPage } from "./proofStepsPage.js";
import { graphIdentifyPage } from "./graphIdentifyPage.js";
import { transformationBuilderPage } from "./transformationBuilderPage.js";

const registry = new Map([
  [graphPlotPage.type, graphPlotPage],
  [dragDropFillPage.type, dragDropFillPage],
  [multipleChoicePage.type, multipleChoicePage],
  [sortOrderPage.type, sortOrderPage],
  [matchPairsPage.type, matchPairsPage],
  [numericInputPage.type, numericInputPage],
  [tableCompletePage.type, tableCompletePage],
  [trueFalseGridPage.type, trueFalseGridPage],
  [proofStepsPage.type, proofStepsPage],
  [graphIdentifyPage.type, graphIdentifyPage],
  [transformationBuilderPage.type, transformationBuilderPage]
]);

export const getPageRenderer = (type) => registry.get(type);

export const getAllPageRenderers = () => Array.from(registry.values());
