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
        // If a segmentMask is provided (array of booleans per point), draw only
        // segments where both endpoints are true. This prevents revealing the
        // entire expected polyline when only some vertices are matched.
        const mask = Array.isArray(series.segmentMask) ? series.segmentMask : null;

        if (!mask) {
          const d = series.points
            .map((p, i) => (i === 0 ? "M" : "L") + toSvgX(p.x) + " " + toSvgY(p.y))
            .join(" ");
          content += `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" stroke-dasharray="${strokeDasharray}" />`;
        } else {
          // Build path segments for contiguous runs where consecutive mask values are true
          let pathD = "";
          let building = false;
          for (let i = 0; i < series.points.length - 1; i++) {
            const p1 = series.points[i];
            const p2 = series.points[i + 1];
            const showSeg = Boolean(mask[i] && mask[i + 1]);
            if (showSeg) {
              if (!building) {
                // start a new subpath at p1
                pathD += `M ${toSvgX(p1.x)} ${toSvgY(p1.y)} `;
                pathD += `L ${toSvgX(p2.x)} ${toSvgY(p2.y)} `;
                building = true;
              } else {
                // continue the current subpath to p2
                pathD += `L ${toSvgX(p2.x)} ${toSvgY(p2.y)} `;
              }
            } else {
              building = false;
            }
          }
          if (pathD) {
            content += `<path d="${pathD.trim()}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" stroke-dasharray="${strokeDasharray}" />`;
          }
        }

        if (label) {
          const p = series.points[series.points.length - 1];
          content += `<text x="${toSvgX(p.x) + 8}" y="${toSvgY(p.y)}" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="${stroke}">${label}</text>`;
        }
      }
    }
  }

  return svg + content;
}