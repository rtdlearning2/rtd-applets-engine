import { getPageRenderer } from "../pages/index.js";
import { getPageState } from "../core/pageState.js";
import { renderPageShell } from "../pages/basePage.js";

const renderUnknownPage = ({ page, index, total }) => {
  return renderPageShell({
    page,
    index,
    total,
    bodyHtml: `<div class="page-unknown">Unknown page type: ${page?.type ?? "(missing)"}</div>`,
    footerHtml: ""
  });
};

export const renderPageApp = (state) => {
  const container = document.getElementById("app");
  if (!container) return;

  const pages = Array.isArray(state.config?.pages) ? state.config.pages : [];
  const total = pages.length;
  const index = Math.max(0, Math.min(state.currentPageIndex ?? 0, total - 1));
  const page = pages[index] ?? { type: "unknown" };
  const renderer = getPageRenderer(page.type);

  if (!renderer) {
    container.innerHTML = renderUnknownPage({ page, index, total });
    return;
  }

  const pageId = page.id ?? `page-${index + 1}`;
  const pageState = getPageState(state, pageId, () => renderer.initState?.(page));
  const bodyHtml = `
    ${renderer.render({ page, state, pageState, index, total })}
  `;
  const showFooter = page?.showFooter !== false;
  const footerHtml = showFooter ? `
    <div class="page-footer-controls">
      <button class="page-nav" data-action="prev" ${index === 0 ? "disabled" : ""}>Back</button>
      <div class="page-footer-actions">
        <button class="page-reset" data-action="reset">Try Again</button>
        <button class="page-submit" data-action="submit">Submit</button>
        <button class="page-nav" data-action="next" ${index >= total - 1 ? "disabled" : ""}>Next</button>
      </div>
    </div>
  ` : "";
  const html = renderPageShell({ page, index, total, bodyHtml, footerHtml });
  const wrappedHtml = `
    <div class="slide-scale-root">
      <div class="slide-scale-inner">
        <div class="slide-viewport">
          <div class="slide-safe-area">
            ${html}
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = wrappedHtml;
  window.dispatchEvent(new Event("applet:rendered"));
  const root = container.querySelector(".page-shell");
  renderer.bind?.({ root, state, pageState, page, index, total });
  const onNav = (direction) => {
    const nextIndex = direction === "next" ? index + 1 : index - 1;
    state.currentPageIndex = Math.max(0, Math.min(nextIndex, total - 1));
    renderPageApp(state);
  };

  if (showFooter) {
    root?.querySelector("[data-action='prev']")?.addEventListener("click", () => onNav("prev"));
    root?.querySelector("[data-action='next']")?.addEventListener("click", () => onNav("next"));
    root?.querySelector("[data-action='submit']")?.addEventListener("click", () => {
      const result = renderer.submit?.({ root, state, pageState, page, index, total });
      if (result?.rerender) {
        renderPageApp(state);
      }
    });
    root?.querySelector("[data-action='reset']")?.addEventListener("click", () => {
      const result = renderer.reset?.({ root, state, pageState, page, index, total });
      if (result?.rerender) {
        renderPageApp(state);
      }
    });
  }
};
