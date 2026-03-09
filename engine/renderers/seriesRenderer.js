/**
 * Safely evaluates a curve formula string for a given x.
 * Supports sqrt(), abs(), sin(), cos(), tan(), log(), ln(), ^ (power).
 * Returns NaN on domain errors rather than throwing.
 */
function evalCurveFn(fnStr, x) {
  try {
    const expr = fnStr
      .replace(/\bsqrt\s*\(/g, "Math.sqrt(")
      .replace(/\babs\s*\(/g,  "Math.abs(")
      .replace(/\bsin\s*\(/g,  "Math.sin(")
      .replace(/\bcos\s*\(/g,  "Math.cos(")
      .replace(/\btan\s*\(/g,  "Math.tan(")
      .replace(/\blog\s*\(/g,  "Math.log10(")
      .replace(/\bln\s*\(/g,   "Math.log(")
      .replace(/\^/g,          "**");
    // eslint-disable-next-line no-new-func
    return new Function("x", `"use strict"; return (${expr});`)(x);
  } catch {
    return NaN;
  }
}

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

    // ── Smooth curve through discrete points (Catmull-Rom spline) ────────
    if (series.type === "smooth-curve") {
      const pts     = series.points ?? [];
      const stroke  = style.stroke      ?? "black";
      const sw      = style.strokeWidth ?? 2;
      const opacity = style.opacity     ?? 1;
      if (pts.length >= 2) {
        let d = `M ${toSvgX(pts[0].x)} ${toSvgY(pts[0].y)}`;
        for (let i = 0; i < pts.length - 1; i++) {
          const p0 = pts[Math.max(0, i - 1)];
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const p3 = pts[Math.min(pts.length - 1, i + 2)];
          const x0 = toSvgX(p0.x), y0 = toSvgY(p0.y);
          const x1 = toSvgX(p1.x), y1 = toSvgY(p1.y);
          const x2 = toSvgX(p2.x), y2 = toSvgY(p2.y);
          const x3 = toSvgX(p3.x), y3 = toSvgY(p3.y);
          const cp1x = x1 + (x2 - x0) / 6;
          const cp1y = y1 + (y2 - y0) / 6;
          const cp2x = x2 - (x3 - x1) / 6;
          const cp2y = y2 - (y3 - y1) / 6;
          d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
        }
        content += `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" />`;
      }
      continue;
    }

    // ── Continuous curve (formula-based) ──────────────────────────────────
    if (series.type === "curve") {
      const fn      = series.fn      ?? "";
      const samples = series.samples ?? 200;
      const dxmin   = series.domain?.[0] ?? xmin;
      const dxmax   = series.domain?.[1] ?? xmax;
      const stroke  = style.stroke      ?? "black";
      const sw      = style.strokeWidth ?? 2;
      const opacity = style.opacity     ?? 1;
      const dashed  = style.dashed ? "5,5" : "none";

      let d = "";
      let penDown = false;
      for (let i = 0; i <= samples; i++) {
        const gx = dxmin + (i / samples) * (dxmax - dxmin);
        const gy = evalCurveFn(fn, gx);
        if (!isFinite(gy) || gy < ymin - 1 || gy > ymax + 1) {
          penDown = false;
          continue;
        }
        const sx = toSvgX(gx);
        const sy = toSvgY(gy);
        d += penDown ? `L ${sx} ${sy} ` : `M ${sx} ${sy} `;
        penDown = true;
      }
      if (d) {
        content += `<path d="${d.trim()}" fill="none" stroke="${stroke}" stroke-width="${sw}" opacity="${opacity}" stroke-dasharray="${dashed}" />`;
      }
      if (label && d) {
        const midX = (dxmin + dxmax) / 2;
        const midY = evalCurveFn(fn, midX);
        if (isFinite(midY)) {
          content += `<text x="${toSvgX(midX) + 8}" y="${toSvgY(midY)}" dominant-baseline="middle" font-family="sans-serif" font-size="12" fill="${stroke}">${label}</text>`;
        }
      }
      continue;
    }

    if (series.type === "points") {
      const r = style.r ?? 5;
      const fill = style.fill ?? "black";

      for (let i = 0; i < series.points.length; i++) {
        const p = series.points[i];
        content += `<circle cx="${toSvgX(p.x)}" cy="${toSvgY(p.y)}" r="${r}" fill="${fill}" />`;
        const ptLabel = series.labels?.[i];
        if (ptLabel) {
          content += `<text x="${toSvgX(p.x) + 8}" y="${toSvgY(p.y) - 6}" font-family="sans-serif" font-size="11" font-weight="600" fill="${fill}">${ptLabel}</text>`;
        }
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