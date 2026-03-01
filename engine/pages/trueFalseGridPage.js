import { PAGE_TYPES } from "./pageTypes.js";
import { renderPrompt } from "./basePage.js";
import { renderPageFeedback, setSubmitFeedback } from "./pageUi.js";

export const trueFalseGridPage = {
  type: PAGE_TYPES.TRUE_FALSE_GRID,
  initState: () => ({ answers: {}, submitted: false, isCorrect: null, feedback: "" }),
  render: ({ page, pageState }) => {
    const statements = Array.isArray(page?.statements) ? page.statements : [];
    const rows = statements
      .map((text, idx) => {
        const selected = pageState?.answers?.[idx];
        const trueSelected = selected === true;
        const falseSelected = selected === false;
        return `
          <tr>
            <td>${text}</td>
            <td><button class="tf-btn ${trueSelected ? "selected" : ""}" data-index="${idx}" data-value="true">True</button></td>
            <td><button class="tf-btn ${falseSelected ? "selected" : ""}" data-index="${idx}" data-value="false">False</button></td>
          </tr>
        `;
      })
      .join("");

    const feedback = renderPageFeedback(pageState);

    return `
      <div class="page-true-false">
        ${renderPrompt(page)}
        <table class="true-false-grid">
          <thead><tr><th>Statement</th><th>True</th><th>False</th></tr></thead>
          <tbody>${rows || ""}</tbody>
        </table>
        ${feedback}
      </div>
    `;
  },
  bind: ({ root, pageState }) => {
    root.querySelectorAll(".tf-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.dataset.index;
        const val = btn.dataset.value === "true";
        if (idx === undefined) return;
        pageState.answers[idx] = val;
        root.querySelectorAll(`.tf-btn[data-index='${idx}']`).forEach(el => el.classList.remove("selected"));
        btn.classList.add("selected");
      });
    });
  },
  submit: ({ pageState, page }) => {
    const statements = Array.isArray(page?.statements) ? page.statements : [];
    const correct = Array.isArray(page?.correctAnswers) ? page.correctAnswers : [];
    const answers = pageState.answers ?? {};
    const allAnswered = statements.every((_, idx) => answers[idx] === true || answers[idx] === false);
    const isCorrect = allAnswered && correct.every((val, idx) => answers[idx] === val);

    setSubmitFeedback(pageState, isCorrect);

    return { rerender: true };
  },
  reset: ({ pageState }) => {
    pageState.answers = {};
    pageState.submitted = false;
    pageState.isCorrect = null;
    pageState.feedback = "";
    return { rerender: true };
  }
};
