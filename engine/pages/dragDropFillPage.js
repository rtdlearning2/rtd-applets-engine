import { PAGE_TYPES } from "./pageTypes.js";
import { renderPrompt } from "./basePage.js";
import { renderPageFeedback, setSubmitFeedback } from "./pageUi.js";

export const dragDropFillPage = {
  type: PAGE_TYPES.DRAG_DROP_FILL,
  initState: () => ({ answers: {}, selectedToken: null, submitted: false, isCorrect: null, feedback: "" }),
  render: ({ page, pageState }) => {
    const blanks = Array.isArray(page?.blanks) ? page.blanks : [];
    const tokens = Array.isArray(page?.tokens) ? page.tokens : [];
    const answers = pageState?.answers ?? {};

    const blankHtml = blanks
      .map(blank => {
        const value = answers[blank];
        const text = value ? value : "[drop]";
        return `<div class="drop-slot" data-blank="${blank}" tabindex="0" role="button">${text}</div>`;
      })
      .join("");

    const tokenHtml = tokens
      .map(token => {
        const selected = pageState?.selectedToken === token ? "selected" : "";
        return `<div class="token ${selected}" data-token="${token}" tabindex="0" role="button">${token}</div>`;
      })
      .join("");

    const feedback = renderPageFeedback(pageState);

    return `
      <div class="page-drag-drop">
        ${renderPrompt(page)}
        <div class="drop-zone">${blankHtml || "[drop zones]"}</div>
        <div class="token-bank">${tokenHtml || "[token bank]"}</div>
        ${feedback}
      </div>
    `;
  },
  bind: ({ root, pageState, page }) => {
    const tokens = root.querySelectorAll(".token");
    const blanks = root.querySelectorAll(".drop-slot");

    tokens.forEach(token => {
      const selectToken = () => {
        pageState.selectedToken = token.dataset.token;
        root.querySelectorAll(".token").forEach(el => el.classList.remove("selected"));
        token.classList.add("selected");
      };

      token.addEventListener("click", selectToken);
      token.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectToken();
        }
      });
    });

    blanks.forEach(blank => {
      const fillBlank = () => {
        if (!pageState.selectedToken) return;
        const key = blank.dataset.blank;
        pageState.answers[key] = pageState.selectedToken;
        blank.textContent = pageState.selectedToken;
        pageState.selectedToken = null;
        root.querySelectorAll(".token").forEach(el => el.classList.remove("selected"));
      };

      blank.addEventListener("click", fillBlank);
      blank.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          fillBlank();
        }
      });
    });
  },
  submit: ({ pageState, page }) => {
    const blanks = Array.isArray(page?.blanks) ? page.blanks : [];
    const correct = page?.correctAnswers ?? {};
    const allFilled = blanks.every(blank => Boolean(pageState.answers?.[blank]));
    const allCorrect = blanks.every(blank => pageState.answers?.[blank] === correct[blank]);

    setSubmitFeedback(pageState, allFilled && allCorrect);

    return { rerender: true };
  },
  reset: ({ pageState }) => {
    pageState.answers = {};
    pageState.selectedToken = null;
    pageState.submitted = false;
    pageState.isCorrect = null;
    pageState.feedback = "";
    return { rerender: true };
  }
};
