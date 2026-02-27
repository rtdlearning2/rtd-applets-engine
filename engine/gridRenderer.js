export function renderGrid(svg, view, dims, options = {}) {
  const { xmin, xmax, ymin, ymax } = view;
  const { width, height } = dims;

  const xScale = width / (xmax - xmin);
  const yScale = height / (ymax - ymin);

  const toSvgX = x => (x - xmin) * xScale;
  const toSvgY = y => height - (y - ymin) * yScale;

  const axisY = toSvgY(0);
  const axisX = toSvgX(0);

  let content = "";

  for (let x = Math.ceil(xmin); x <= Math.floor(xmax); x++) {
    const sx = toSvgX(x);
    content += `<line x1="${sx}" y1="0" x2="${sx}" y2="${height}" stroke="${x === 0 ? "#000" : "#eee"}"/>`;
    if (x !== 0) {
      content += `<text x="${sx}" y="${axisY + 15}" font-size="12" font-family="sans-serif" text-anchor="middle" fill="#666">${x}</text>`;
    }
  }

  for (let y = Math.ceil(ymin); y <= Math.floor(ymax); y++) {
    const sy = toSvgY(y);
    content += `<line x1="0" y1="${sy}" x2="${width}" y2="${sy}" stroke="${y === 0 ? "#000" : "#eee"}"/>`;
    if (y !== 0) {
      content += `<text x="${axisX - 5}" y="${sy + 4}" font-size="12" font-family="sans-serif" text-anchor="end" fill="#666">${y}</text>`;
    }
  }

  return svg + content;
}