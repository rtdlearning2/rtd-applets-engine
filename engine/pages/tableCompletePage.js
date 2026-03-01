import { PAGE_TYPES } from "./pageTypes.js";
import { renderPrompt } from "./basePage.js";
import { renderPageFeedback, setSubmitFeedback } from "./pageUi.js";

export const tableCompletePage = {
  type: PAGE_TYPES.TABLE_COMPLETE,
  initState: () => ({ values: {}, submitted: false, isCorrect: null, feedback: "" }),
  render: ({ page, pageState }) => {
    const columns = Array.isArray(page?.columns) ? page.columns : [];
    const rows = Array.isArray(page?.rows) ? page.rows : [];
    const values = pageState?.values ?? {};

    const header = columns.map(col => `<th>${col}</th>`).join("");
    const body = rows
      .map((row, rowIndex) => {
        const cells = row
          .map((cell, colIndex) => {
            if (cell === null || cell === undefined) {
              const key = `${rowIndex},${colIndex}`;
              const value = values[key] ?? "";
              return `<td><input data-row="${rowIndex}" data-col="${colIndex}" type="text" value="${value}"></td>`;
            }
            return `<td>${cell}</td>`;
          })
          .join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");

    const feedback = renderPageFeedback(pageState);

    return `
      <div class="page-table-complete">
        ${renderPrompt(page)}
        <table class="value-table">
          <thead><tr>${header || ""}</tr></thead>
          <tbody>${body || ""}</tbody>
        </table>
        ${feedback}
      </div>
    `;
  },
  bind: ({ root, pageState }) => {
    root.querySelectorAll("input[data-row]").forEach(input => {
      input.addEventListener("input", () => {
        const row = input.dataset.row;
        const col = input.dataset.col;
        if (row === undefined || col === undefined) return;
        const key = `${row},${col}`;
        pageState.values[key] = input.value;
      });
    });
  },
  submit: ({ pageState, page }) => {
    const rows = Array.isArray(page?.rows) ? page.rows : [];
    const correctRows = Array.isArray(page?.correctRows) ? page.correctRows : [];
    const values = pageState.values ?? {};
    let isCorrect = true;

    rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null || cell === undefined) {
          const key = `${rowIndex},${colIndex}`;
          const expected = correctRows?.[rowIndex]?.[colIndex];
          if (expected === undefined || expected === null) {
            isCorrect = false;
          } else if (String(values[key] ?? "") !== String(expected)) {
            isCorrect = false;
          }
        }
      });
    });

    setSubmitFeedback(pageState, isCorrect);

    return { rerender: true };
  },
  reset: ({ pageState }) => {
    pageState.values = {};
    pageState.submitted = false;
    pageState.isCorrect = null;
    pageState.feedback = "";
    return { rerender: true };
  }
};
