export function renderSeries(svg, seriesList, view, dims) {
  const { xmin, xmax, ymin, ymax } = view;
  const { width, height } = dims;

  const xScale = width / (xmax - xmin);
  const yScale = height / (ymax - ymin);

  const toSvgX = x => (x - xmin) * xScale;
  const toSvgY = y => height - (y - ymin) * yScale;

  let content = "";

  for (const series of seriesList) {
    const style = series.style || {};
    const label = series.label;

    if (series.type === "points") {
      const r = style.r ?? 5;
      const fill = style.fill ?? "black";

      for (const p of series.points) {
        content += `<circle cx="${toSvgX(p.x)}" cy="${toSvgY(p.y)}" r="${r}" fill="${fill}" />`;
      }

      if (label && series.points.length > 0) {
        const p = series.points[series.points.length - 1];
        content += `<text x="${toSvgX(p.x) + 8}" y="${toSvgY(p.y)}" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="${fill}">${label}</text>`;
      }
    } else if (series.type === "polyline") {
      const stroke = style.stroke ?? "black";
      const strokeWidth = style.strokeWidth ?? 2;
      const fill = style.fill ?? "none";
      const opacity = style.opacity ?? 1;
      const strokeDasharray = style.dashed ? "5,5" : "none";

      if (series.points.length > 0) {
        const d = series.points
          .map((p, i) => (i === 0 ? "M" : "L") + toSvgX(p.x) + " " + toSvgY(p.y))
          .join(" ");
        content += `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" stroke-dasharray="${strokeDasharray}" />`;

        if (label) {
          const p = series.points[series.points.length - 1];
          content += `<text x="${toSvgX(p.x) + 8}" y="${toSvgY(p.y)}" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="${stroke}">${label}</text>`;
        }
      }
    }
  }

  return svg + content;
}