// engine/interaction.js

import { orderStudentPoints } from "./validator.js";

const handlers = {
  placePoints: (state, e, svg, onStateChange) => {
    const maxPoints = state.expectedPoints.length;
    const matchedCount = state.orderedStudentPoints?.length ?? 0;
    if (matchedCount >= maxPoints) return;

    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert back to graph coords
    const xmin = state.view.xmin;
    const xmax = state.view.xmax;
    const ymin = state.view.ymin;
    const ymax = state.view.ymax;

    // Use rect dimensions for accurate pixel mapping (handles scaling)
    const width = rect.width;
    const height = rect.height;

    const graphX = xmin + (x / width) * (xmax - xmin);
    const graphY = ymax - (y / height) * (ymax - ymin);

    // Snap to nearest integer
    const snapped = [
      Math.round(graphX),
      Math.round(graphY)
    ];

    // Hit radius check
    const hitRadius = state.config.interaction.hitRadiusPx;
    
    // Project snapped point back to screen pixels to verify distance
    const screenX = ((snapped[0] - xmin) / (xmax - xmin)) * width;
    const screenY = ((ymax - snapped[1]) / (ymax - ymin)) * height;

    const dist = Math.hypot(x - screenX, y - screenY);
    if (dist > hitRadius) return;

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
    if (handlers[mode]) {
      handlers[mode](state, e, svg, onStateChange);
    }
  });

  console.log("Interaction attached");
}