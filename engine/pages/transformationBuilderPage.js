import { PAGE_TYPES } from "./pageTypes.js";
import { renderPrompt } from "./basePage.js";
import { renderPageFeedback, setSubmitFeedback } from "./pageUi.js";

export const transformationBuilderPage = {
  type: PAGE_TYPES.TRANSFORMATION_BUILDER,
  initState: () => ({ operations: [], submitted: false, isCorrect: null, feedback: "" }),
  render: ({ page, pageState }) => {
    const operations = Array.isArray(page?.operations) ? page.operations : [];
    const stack = pageState?.operations ?? [];
    const options = operations
      .map(op => `<button class="operation-btn" data-op="${op}">${op}</button>`)
      .join("");

    const stackItems = stack.length
      ? stack.map((op, idx) => `<div class="stack-item" data-index="${idx}" tabindex="0" role="button">${op}</div>`).join("")
      : "[stacked operations]";

    const feedback = renderPageFeedback(pageState);

    return `
      <div class="page-transformation-builder">
        ${renderPrompt(page)}
        <div class="operation-bank">${options || "[operations]"}</div>
        <div class="operation-stack">${stackItems}</div>
        ${feedback}
      </div>
    `;
  },
  bind: ({ root, pageState }) => {
    root.querySelectorAll(".operation-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const op = btn.dataset.op;
        if (!op) return;
        pageState.operations = [...pageState.operations, op];
        const stack = root.querySelector(".operation-stack");
        if (!stack) return;
        const item = document.createElement("div");
        item.className = "stack-item";
        item.tabIndex = 0;
        item.setAttribute("role", "button");
        item.textContent = op;
        stack.appendChild(item);
      });
    });

    root.querySelectorAll(".stack-item").forEach(item => {
      const removeItem = () => {
        const idx = Number(item.dataset.index);
        if (Number.isNaN(idx)) return;
        pageState.operations = pageState.operations.filter((_, i) => i !== idx);
        item.remove();
      };

      item.addEventListener("click", removeItem);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          removeItem();
        }
      });
    });
  },
  submit: ({ pageState, page }) => {
    const correct = Array.isArray(page?.correctOperations) ? page.correctOperations : [];
    const stack = pageState.operations ?? [];
    const isCorrect = correct.length === stack.length
      && correct.every((val, idx) => val === stack[idx]);

    setSubmitFeedback(pageState, isCorrect);

    return { rerender: true };
  },
  reset: ({ pageState }) => {
    pageState.operations = [];
    pageState.submitted = false;
    pageState.isCorrect = null;
    pageState.feedback = "";
    return { rerender: true };
  }
};
