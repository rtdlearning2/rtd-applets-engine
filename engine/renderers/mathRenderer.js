// engine/renderers/mathRenderer.js

export const MINUS = "\u2212";

export function renderMathVar(value) {
  if (!value) return "";
  if (value.startsWith(MINUS)) {
    const v = value.slice(MINUS.length);
    return `<span class="math-minus">${MINUS}</span><span class="math-var">${v}</span>`;
  }
  return `<span class="math-var">${value}</span>`;
}

export function renderMathNum(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.startsWith("-")) {
    return `<span class="math-minus">${MINUS}</span><span class="math-num">${str.slice(1)}</span>`;
  }
  if (str.startsWith(MINUS)) {
    return `<span class="math-minus">${MINUS}</span><span class="math-num">${str.slice(MINUS.length)}</span>`;
  }
  return `<span class="math-num">${str}</span>`;
}

export function renderPointHtml(coords) {
  const [x, y] = coords;
  return `<span class="rule-math">(</span>${renderMathNum(x)}<span class="rule-math">,</span> ${renderMathNum(y)}<span class="rule-math">)</span>`;
}

// Renders a token's display HTML based on its type
export function renderTokenHtml(token) {
  if (token.html) return token.html;
  if (token.type === "point" && token.coords) return renderPointHtml(token.coords);
  return renderMathVar(token.value);
}
