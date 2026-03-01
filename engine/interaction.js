// engine/interaction.js

import { orderStudentPoints } from "./validator.js";

const handlers = {
  placePoints: (state, e, svg, onStateChange) => {
    if (state.currentStep !== 1) return;
    const maxPoints = state.expectedPoints.length;
    // Limit by raw student clicks (allow up to expectedPoints.length clicks)
    if (state.studentPoints.length >= maxPoints) return;

    const rect = svg.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Convert back to graph coords
    const xmin = state.view.xmin;
    const xmax = state.view.xmax;
    const ymin = state.view.ymin;
    const ymax = state.view.ymax;

    // Use rect dimensions for accurate pixel mapping (handles scaling)
    let width = rect.width;
    let height = rect.height;

    // Prefer SVG coordinate mapping when available (handles transforms reliably)
    if (svg.createSVGPoint && svg.getScreenCTM) {
      const ctm = svg.getScreenCTM();
      if (ctm) {
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgPoint = pt.matrixTransform(ctm.inverse());
        x = svgPoint.x;
        y = svgPoint.y;
        const viewBox = svg.viewBox?.baseVal;
        if (viewBox && viewBox.width && viewBox.height) {
          width = viewBox.width;
          height = viewBox.height;
        }
      }
    }

    const graphX = xmin + (x / width) * (xmax - xmin);
    const graphY = ymax - (y / height) * (ymax - ymin);

    // Snap to configured snap step (default 1)
    const step = state.config.interaction?.snapStep ?? 1;
    const snapped = [
      Math.round(graphX / step) * step,
      Math.round(graphY / step) * step
    ];

    // Optional pixel tolerance: only accept the snap if the click is reasonably
    // close (in pixels) to the snapped vertex. This prevents wildly off-grid
    // accidental clicks while preserving exact snap behavior. Configurable
    // via state.config.interaction.hitRadiusPx (default 18px).
    const hitRadiusPx = state.config.interaction?.hitRadiusPx ?? 18;

    // Convert the snapped graph coords back to pixel space for distance check
    const snappedPixelX = ((snapped[0] - xmin) / (xmax - xmin)) * width;
    const snappedPixelY = ((ymax - snapped[1]) / (ymax - ymin)) * height;

    const dx = snappedPixelX - x;
    const dy = snappedPixelY - y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > hitRadiusPx) {
      // Click was too far from the grid vertex — ignore it.
      return;
    }

    // Prevent duplicate clicks on the same vertex
    const alreadyClicked = state.studentPoints.some(
      p => p[0] === snapped[0] && p[1] === snapped[1]
    );
    if (alreadyClicked) return;

    // Keep raw clicks in studentPoints
    state.studentPoints.push(snapped);

    // Compute ordered view separately
    state.orderedStudentPoints = orderStudentPoints(
      state.expectedPoints,
      state.studentPoints
    );

    
    onStateChange();
  },
  drawPolyline: () => {},
  dragHandles: () => {},
  selectInterval: () => {}
};

export function attachGraphInteraction(state, onStateChange) {

  document.addEventListener("pointerdown", function (e) {

    const svg = document.getElementById("graphSvg");
    if (!svg) return;

    if (!svg.contains(e.target)) return;

    const mode = state.config.interaction?.mode || "placePoints";

    // Combine built-in handlers with any activity-provided handlers. Activity handlers
    // override built-ins when keys conflict.
    const activityHandlers = state.activityHandlers ?? {};
    const combined = { ...handlers, ...activityHandlers };

    if (combined[mode]) {
      combined[mode](state, e, svg, onStateChange);
    }
  });

  console.log("Interaction attached");
}