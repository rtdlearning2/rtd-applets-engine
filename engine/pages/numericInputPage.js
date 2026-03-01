import { PAGE_TYPES } from "./pageTypes.js";
import { renderPrompt } from "./basePage.js";
import { renderPageFeedback, setSubmitFeedback } from "./pageUi.js";

export const numericInputPage = {
  type: PAGE_TYPES.NUMERIC_INPUT,
  initState: () => ({ value: "", submitted: false, isCorrect: null, feedback: "" }),
  render: ({ page, pageState }) => {
    const unit = page?.unit ? `<span class="numeric-unit">${page.unit}</span>` : "";
    const value = pageState?.value ?? "";
    const feedback = renderPageFeedback(pageState);

    return `
      <div class="page-numeric-input">
        ${renderPrompt(page)}
        <div class="numeric-input-row">
          <input class="numeric-input" type="text" placeholder="Enter value" value="${value}">
          ${unit}
        </div>
        ${feedback}
      </div>
    `;
  },
  bind: ({ root, pageState }) => {
    const input = root.querySelector(".numeric-input");
    if (!input) return;
    input.addEventListener("input", () => {
      pageState.value = input.value;
    });
  },
  submit: ({ pageState, page }) => {
    const raw = pageState.value;
    const value = Number(raw);
    const target = Number(page?.correctValue);
    const tolerance = Number(page?.tolerance ?? 0);
    const valid = Number.isFinite(value) && Number.isFinite(target);
    const isCorrect = valid && Math.abs(value - target) <= tolerance;

    setSubmitFeedback(pageState, isCorrect);

    return { rerender: true };
  },
  reset: ({ pageState }) => {
    pageState.value = "";
    pageState.submitted = false;
    pageState.isCorrect = null;
    pageState.feedback = "";
    return { rerender: true };
  }
};
