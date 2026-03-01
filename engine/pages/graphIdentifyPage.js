import { PAGE_TYPES } from "./pageTypes.js";
import { renderPrompt, renderPlaceholderList } from "./basePage.js";
import { renderPageFeedback, setSubmitFeedback } from "./pageUi.js";

export const graphIdentifyPage = {
  type: PAGE_TYPES.GRAPH_IDENTIFY,
  initState: () => ({ selected: [], submitted: false, isCorrect: null, feedback: "" }),
  render: ({ page, pageState }) => {
    const targets = Array.isArray(page?.targets) ? page.targets : [];
    const selected = pageState?.selected ?? [];
    const targetButtons = targets
      .map((t, idx) => {
        const isSelected = selected.includes(String(idx)) ? "selected" : "";
        return `<button class="target-chip ${isSelected}" data-index="${idx}">${t}</button>`;
      })
      .join("");

    const feedback = renderPageFeedback(pageState);

    return `
      <div class="page-graph-identify">
        ${renderPrompt(page)}
        <div class="graph-placeholder">[graph for identification]</div>
        <div class="target-list">${targetButtons || renderPlaceholderList(["Targets pending"])}</div>
        ${feedback}
      </div>
    `;
  },
  bind: ({ root, pageState }) => {
    root.querySelectorAll(".target-chip").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.dataset.index;
        if (idx === undefined) return;
        if (pageState.selected.includes(idx)) {
          pageState.selected = pageState.selected.filter(val => val !== idx);
          btn.classList.remove("selected");
        } else {
          pageState.selected = [...pageState.selected, idx];
          btn.classList.add("selected");
        }
      });
    });
  },
  submit: ({ pageState, page }) => {
    const correct = Array.isArray(page?.correctTargets) ? page.correctTargets.map(String) : [];
    const selected = (pageState.selected ?? []).map(String).sort();
    const expected = [...correct].sort();

    const isCorrect = selected.length === expected.length
      && selected.every((val, idx) => val === expected[idx]);

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
