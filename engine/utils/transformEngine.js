// engine/transformEngine.js

export function computeExpectedPoints(originalPoints, transform) {
  if (!Array.isArray(originalPoints)) return [];

  if (!transform || !transform.type) {
    return originalPoints;
  }

  // Helpers
  const getPivot = () => {
    const p = transform.pivot;
    if (Array.isArray(p) && p.length === 2) return [p[0], p[1]];
    return [0, 0];
  };

  const rotateAroundOrigin = ([x, y], angle) => {
    const a = ((angle % 360) + 360) % 360; // normalize
    if (a === 0) return [x, y];
    if (a === 90) return [-y, x];
    if (a === 180) return [-x, -y];
    if (a === 270) return [y, -x];
    // Restrict to 90-multiples for now (per spec)
    return [x, y];
  };

  // Existing: reflections
  if (transform.type === "reflect_x") {
    return originalPoints.map(([x, y]) => [x, -y]);
  }

  if (transform.type === "reflect_y") {
    return originalPoints.map(([x, y]) => [-x, y]);
  }

  // Step 9A: translation
  if (transform.type === "translate") {
    const dx = Number(transform.dx ?? 0);
    const dy = Number(transform.dy ?? 0);
    return originalPoints.map(([x, y]) => [x + dx, y + dy]);
  }

  // Step 10A/10B: rotation (90-multiples) with optional pivot
  if (transform.type === "rotate") {
    const angle = Number(transform.angle ?? 0);
    const [h, k] = getPivot();

    return originalPoints.map(([x, y]) => {
      // translate to pivot
      const xr = x - h;
      const yr = y - k;

      // rotate about origin
      const [rx, ry] = rotateAroundOrigin([xr, yr], angle);

      // translate back
      return [rx + h, ry + k];
    });
  }

  // Horizontal / vertical scale (stretch or compression)
  // scale { sx, sy } maps (x, y) → (sx*x, sy*y)
  if (transform.type === "scale") {
    const sx = Number(transform.sx ?? 1);
    const sy = Number(transform.sy ?? 1);
    return originalPoints.map(([x, y]) => [sx * x, sy * y]);
  }

  // Step 11: dilation with optional pivot
  if (transform.type === "dilate") {
    const factor = Number(transform.k ?? 1);
    const [h, k] = getPivot();

    return originalPoints.map(([x, y]) => {
      // pivot form: (x', y') = (h + k*(x-h),  k + k*(y-k))
      return [h + factor * (x - h), k + factor * (y - k)];
    });
  }

  // Default: no transform
  return originalPoints;
}

/**
 * Derives the transformed curve config (fn + domain) from original.curve + transform.
 * If the activity module exports deriveCurve, that hook is called first.
 * Returns { fn, domain } or null if not applicable.
 */
export function deriveReflectedCurve(config, activity) {
  // Activity hook takes priority — new transforms live entirely in the activity module
  if (typeof activity?.deriveCurve === "function") {
    return activity.deriveCurve(config);
  }
  const curve     = config.original?.curve;
  const transform = config.transform?.type;
  if (!curve || !transform) return null;
  const { fn, domain } = curve;
  if (transform === "reflect_y") {
    return { fn: fn.replace(/\bx\b/g, "(-x)"), domain: [-domain[1], -domain[0]] };
  }
  if (transform === "reflect_x") {
    return { fn: `-(${fn})`, domain: [...domain] };
  }
  if (transform === "scale") {
    const sx = Number(config.transform?.sx ?? 1);
    const sy = Number(config.transform?.sy ?? 1);
    let derivedFn = sx !== 1 ? fn.replace(/\bx\b/g, `(x/${sx})`) : fn;
    if (sy !== 1) derivedFn = `${sy} * (${derivedFn})`;
    return { fn: derivedFn, domain: [sx * domain[0], sx * domain[1]] };
  }
  return null;
}