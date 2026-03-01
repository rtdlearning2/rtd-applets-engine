export const getPageId = (page, index) => page?.id ?? `page-${index + 1}`;

export const renderPageShell = ({ page, index, total, bodyHtml, footerHtml }) => {
  const pageId = getPageId(page, index);
  const title = page?.title ?? `Page ${index + 1}`;
  const subtitle = page?.subtitle ?? "";
  const progress = total > 0 ? `Page ${index + 1} of ${total}` : "";
  const showProgress = page?.showProgress !== false;
  const showTitle = page?.showTitle !== false;

  return `
    <section class="page-shell" data-page-id="${pageId}">
      <header class="page-header">
        ${showProgress ? `<div class="page-progress">${progress}</div>` : ""}
        ${showTitle ? `<h2 class="page-title">${title}</h2>` : ""}
        ${showTitle && subtitle ? `<div class="page-subtitle">${subtitle}</div>` : ""}
      </header>
      <div class="page-body">
        ${bodyHtml}
      </div>
      ${footerHtml ? `<footer class="page-footer">${footerHtml}</footer>` : ""}
    </section>
  `;
};

export const renderPrompt = (page) => {
  if (!page?.prompt) return "";
  return `<div class="page-prompt">${page.prompt}</div>`;
};

export const renderPlaceholderList = (items) => {
  if (!items || items.length === 0) return "";
  const list = items.map(item => `<li>${item}</li>`).join("");
  return `<ul class="page-placeholder-list">${list}</ul>`;
};
