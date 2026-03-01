import { PAGE_TYPES } from "./pageTypes.js";
import { renderPrompt } from "./basePage.js";
import { renderPageFeedback, setSubmitFeedback } from "./pageUi.js";

export const multipleChoicePage = {
  type: PAGE_TYPES.MULTIPLE_CHOICE,
  initState: () => ({ selected: [], submitted: false, isCorrect: null, feedback: "" }),
  render: ({ page, pageState }) => {
    const choices = Array.isArray(page?.choices) ? page.choices : [];
    const multiSelect = Boolean(page?.multiSelect);
    const selected = pageState?.selected ?? [];
    const inputType = multiSelect ? "checkbox" : "radio";
    const groupName = page?.id ? `mc-${page.id}` : "mc";
    const items = choices
      .map((choice, idx) => {
        const isChecked = selected.includes(String(idx));
        return `
          <label class="choice-item">
            <input type="${inputType}" name="${groupName}" value="${idx}" ${isChecked ? "checked" : ""}>
            <span>${choice}</span>
          </label>
        `;
      })
      .join("");

    const feedback = renderPageFeedback(pageState);

    return `
      <div class="page-multiple-choice">
        ${renderPrompt(page)}
        <div class="choice-list">${items || "[choices]"}</div>
        ${feedback}
      </div>
    `;
  },
  bind: ({ root, pageState, page }) => {
    const multiSelect = Boolean(page?.multiSelect);
    const inputs = root.querySelectorAll(".choice-item input");

    inputs.forEach(input => {
      input.addEventListener("change", () => {
        if (multiSelect) {
          const selected = Array.from(inputs)
            .filter(el => el.checked)
            .map(el => el.value);
          pageState.selected = selected;
        } else {
          pageState.selected = input.checked ? [input.value] : [];
        }
      });
    });
  },
  submit: ({ pageState, page }) => {
    const multiSelect = Boolean(page?.multiSelect);
    const selected = pageState.selected ?? [];
    let isCorrect = false;

    if (multiSelect) {
      const correct = Array.isArray(page?.correctIndices)
        ? page.correctIndices.map(String)
        : [];
      const sortedSelected = [...selected].sort();
      const sortedCorrect = [...correct].sort();
      isCorrect = sortedSelected.length === sortedCorrect.length
        && sortedSelected.every((val, idx) => val === sortedCorrect[idx]);
    } else {
      const correctIndex = page?.correctIndex;
      isCorrect = selected.length === 1 && String(correctIndex) === selected[0];
    }

    setSubmitFeedback(pageState, isCorrect);

    return { rerender: true };
  },
  reset: ({ pageState }) => {
    pageState.selected = [];
    pageState.submitted = false;
    pageState.isCorrect = null;
    pageState.feedback = "";
    return { rerender: true };
  }
};
