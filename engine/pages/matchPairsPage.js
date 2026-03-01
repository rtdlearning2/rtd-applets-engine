import { PAGE_TYPES } from "./pageTypes.js";
import { renderPrompt } from "./basePage.js";
import { renderPageFeedback, setSubmitFeedback } from "./pageUi.js";

export const matchPairsPage = {
  type: PAGE_TYPES.MATCH_PAIRS,
  initState: () => ({ pairs: {}, selectedLeft: null, submitted: false, isCorrect: null, feedback: "" }),
  render: ({ page, pageState }) => {
    const leftItems = Array.isArray(page?.leftItems) ? page.leftItems : [];
    const rightItems = Array.isArray(page?.rightItems) ? page.rightItems : [];
    const pairs = pageState?.pairs ?? {};

    const leftHtml = leftItems
      .map((item, idx) => {
        const paired = pairs[idx] !== undefined;
        const selected = pageState?.selectedLeft === String(idx) ? "selected" : "";
        return `<div class="match-item ${selected}" data-side="left" data-index="${idx}" tabindex="0" role="button">${item}${paired ? " ✓" : ""}</div>`;
      })
      .join("");

    const rightHtml = rightItems
      .map((item, idx) => {
        const pairedLeft = Object.keys(pairs).find(key => String(pairs[key]) === String(idx));
        const paired = pairedLeft !== undefined;
        return `<div class="match-item ${paired ? "paired" : ""}" data-side="right" data-index="${idx}" tabindex="0" role="button">${item}${paired ? " ✓" : ""}</div>`;
      })
      .join("");

    const feedback = renderPageFeedback(pageState);

    return `
      <div class="page-match-pairs">
        ${renderPrompt(page)}
        <div class="match-columns">
          <div class="match-column">${leftHtml || "[left items]"}</div>
          <div class="match-column">${rightHtml || "[right items]"}</div>
        </div>
        ${feedback}
      </div>
    `;
  },
  bind: ({ root, pageState }) => {
    root.querySelectorAll(".match-item[data-side='left']").forEach(item => {
      const selectLeft = () => {
        pageState.selectedLeft = item.dataset.index ?? null;
        root.querySelectorAll(".match-item[data-side='left']").forEach(el => el.classList.remove("selected"));
        item.classList.add("selected");
      };

      item.addEventListener("click", selectLeft);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectLeft();
        }
      });
    });

    root.querySelectorAll(".match-item[data-side='right']").forEach(item => {
      const selectRight = () => {
        const rightIndex = item.dataset.index;
        if (!pageState.selectedLeft || rightIndex === undefined) return;
        pageState.pairs[pageState.selectedLeft] = Number(rightIndex);
        pageState.selectedLeft = null;
        root.querySelectorAll(".match-item[data-side='left']").forEach(el => el.classList.remove("selected"));
      };

      item.addEventListener("click", selectRight);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectRight();
        }
      });
    });
  },
  submit: ({ pageState, page }) => {
    const leftItems = Array.isArray(page?.leftItems) ? page.leftItems : [];
    const expectedPairs = page?.correctPairs ?? {};
    const pairs = pageState.pairs ?? {};
    const allPaired = Object.keys(pairs).length === leftItems.length;

    const isCorrect = allPaired && Object.keys(expectedPairs).every(key => {
      return String(expectedPairs[key]) === String(pairs[key]);
    });

    setSubmitFeedback(pageState, isCorrect);

    return { rerender: true };
  },
  reset: ({ pageState }) => {
    pageState.pairs = {};
    pageState.selectedLeft = null;
    pageState.submitted = false;
    pageState.isCorrect = null;
    pageState.feedback = "";
    return { rerender: true };
  }
};
