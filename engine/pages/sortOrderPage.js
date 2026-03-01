import { PAGE_TYPES } from "./pageTypes.js";
import { renderPrompt } from "./basePage.js";
import { renderPageFeedback, setSubmitFeedback } from "./pageUi.js";

export const sortOrderPage = {
  type: PAGE_TYPES.SORT_ORDER,
  initState: () => ({ order: [], submitted: false, isCorrect: null, feedback: "" }),
  render: ({ page, pageState }) => {
    const items = Array.isArray(page?.items) ? page.items : [];
    const order = pageState?.order ?? [];
    const list = items
      .map((item, idx) => {
        const orderIndex = order.indexOf(String(idx));
        const badge = orderIndex >= 0 ? `<span class="order-badge">${orderIndex + 1}</span>` : "";
        const selected = orderIndex >= 0 ? "selected" : "";
        return `<div class="sort-item ${selected}" data-index="${idx}" tabindex="0" role="button">${badge}${item}</div>`;
      })
      .join("");

    const feedback = renderPageFeedback(pageState);

    return `
      <div class="page-sort-order">
        ${renderPrompt(page)}
        <div class="sort-list">${list || "[sortable items]"}</div>
        ${feedback}
      </div>
    `;
  },
  bind: ({ root, pageState }) => {
    root.querySelectorAll(".sort-item").forEach(item => {
      const toggleItem = () => {
        const idx = item.dataset.index;
        if (!idx) return;
        if (pageState.order.includes(idx)) {
          pageState.order = pageState.order.filter(val => val !== idx);
        } else {
          pageState.order = [...pageState.order, idx];
        }
        root.querySelectorAll(".sort-item").forEach(el => {
          el.classList.remove("selected");
          el.querySelectorAll(".order-badge").forEach(badge => badge.remove());
        });
        pageState.order.forEach((id, orderIndex) => {
          const el = root.querySelector(`.sort-item[data-index='${id}']`);
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
    const items = Array.isArray(page?.items) ? page.items : [];
    const expected = Array.isArray(page?.correctOrder) ? page.correctOrder : [];
    const order = pageState.order ?? [];
    const allSelected = order.length === items.length;
    let isCorrect = false;

    if (expected.length > 0) {
      if (typeof expected[0] === "number") {
        const expectedStr = expected.map(String);
        isCorrect = expectedStr.length === order.length
          && expectedStr.every((val, idx) => val === order[idx]);
      } else {
        const chosen = order.map(idx => items[Number(idx)]);
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
