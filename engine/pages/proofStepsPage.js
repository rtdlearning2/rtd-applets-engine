import { PAGE_TYPES } from "./pageTypes.js";
import { renderPrompt } from "./basePage.js";
import { renderPageFeedback, setSubmitFeedback } from "./pageUi.js";

export const proofStepsPage = {
  type: PAGE_TYPES.PROOF_STEPS,
  initState: () => ({ order: [], submitted: false, isCorrect: null, feedback: "" }),
  render: ({ page, pageState }) => {
    const steps = Array.isArray(page?.steps) ? page.steps : [];
    const order = pageState?.order ?? [];
    const items = steps
      .map((step, idx) => {
        const orderIndex = order.indexOf(String(idx));
        const badge = orderIndex >= 0 ? `<span class="order-badge">${orderIndex + 1}</span>` : "";
        const selected = orderIndex >= 0 ? "selected" : "";
        return `<div class="proof-step ${selected}" data-index="${idx}" tabindex="0" role="button">${badge}${step}</div>`;
      })
      .join("");

    const feedback = renderPageFeedback(pageState);

    return `
      <div class="page-proof-steps">
        ${renderPrompt(page)}
        <div class="proof-steps-list">${items || "[proof steps]"}</div>
        ${feedback}
      </div>
    `;
  },
  bind: ({ root, pageState }) => {
    root.querySelectorAll(".proof-step").forEach(item => {
      const toggleItem = () => {
        const idx = item.dataset.index;
        if (!idx) return;
        if (pageState.order.includes(idx)) {
          pageState.order = pageState.order.filter(val => val !== idx);
        } else {
          pageState.order = [...pageState.order, idx];
        }
        root.querySelectorAll(".proof-step").forEach(el => {
          el.classList.remove("selected");
          el.querySelectorAll(".order-badge").forEach(badge => badge.remove());
        });
        pageState.order.forEach((id, orderIndex) => {
          const el = root.querySelector(`.proof-step[data-index='${id}']`);
          if (el) {
            el.classList.add("selected");
            const newBadge = document.createElement("span");
            newBadge.className = "order-badge";
            newBadge.textContent = String(orderIndex + 1);
            el.prepend(newBadge);
          }
        });
      };

      item.addEventListener("click", toggleItem);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleItem();
        }
      });
    });
  },
  submit: ({ pageState, page }) => {
    const steps = Array.isArray(page?.steps) ? page.steps : [];
    const expected = Array.isArray(page?.correctOrder) ? page.correctOrder : [];
    const order = pageState.order ?? [];
    const allSelected = order.length === steps.length;
    let isCorrect = false;

    if (expected.length > 0) {
      if (typeof expected[0] === "number") {
        const expectedStr = expected.map(String);
        isCorrect = expectedStr.length === order.length
          && expectedStr.every((val, idx) => val === order[idx]);
      } else {
        const chosen = order.map(idx => steps[Number(idx)]);
        isCorrect = expected.length === chosen.length
          && expected.every((val, idx) => val === chosen[idx]);
      }
    }

    setSubmitFeedback(pageState, allSelected && isCorrect);

    return { rerender: true };
  },
  reset: ({ pageState }) => {
    pageState.order = [];
    pageState.submitted = false;
    pageState.isCorrect = null;
    pageState.feedback = "";
    return { rerender: true };
  }
};
