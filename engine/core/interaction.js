// engine/interaction.js

import { orderStudentPoints } from "../utils/validator.js";

const handlers = {
  placePoints: (state, e, svg, onStateChange) => {
    // Only allow graph interaction when the active applet step is a graph-plot step.
    // For non-applet configs (state.applet === null) keep legacy behaviour (step 1 only).
    if (state.applet) {
      const stepCfg = state.config?.applet?.steps?.[state.applet.currentStep];
      if (!stepCfg || stepCfg.type !== "graph-plot") return;
    } else if (state.currentStep !== 1) {
      return;
    }

    const maxPoints = state.expectedPoints.length;
    if (state.studentPoints.length >= maxPoints) return;

    const rect = svg.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    const xmin = state.view.xmin;
    const xmax = state.view.xmax;
    const ymin = state.view.ymin;
    const ymax = state.view.ymax;

    let width  = rect.width;
    let height = rect.height;

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
          width  = viewBox.width;
          height = viewBox.height;
        }
      }
    }

    const graphX = xmin + (x / width)  * (xmax - xmin);
    const graphY = ymax - (y / height) * (ymax - ymin);

    const step    = state.config.interaction?.snapStep ?? 1;
    const snapped = [
      Math.round(graphX / step) * step,
      Math.round(graphY / step) * step
    ];

    const hitRadiusPx   = state.config.interaction?.hitRadiusPx ?? 18;
    const snappedPixelX = ((snapped[0] - xmin) / (xmax - xmin)) * width;
    const snappedPixelY = ((ymax - snapped[1]) / (ymax - ymin)) * height;
    const dx = snappedPixelX - x;
    const dy = snappedPixelY - y;

    if (Math.sqrt(dx * dx + dy * dy) > hitRadiusPx) return;

    const alreadyClicked = state.studentPoints.some(
      p => p[0] === snapped[0] && p[1] === snapped[1]
    );
    if (alreadyClicked) return;

    state.studentPoints.push(snapped);
    state.orderedStudentPoints = orderStudentPoints(state.expectedPoints, state.studentPoints);

    onStateChange();
  },
  drawPolyline:   () => {},
  dragHandles:    () => {},
  selectInterval: () => {}
};

export function attachGraphInteraction(state, onStateChange) {
  document.addEventListener("pointerdown", function (e) {
    const svg = document.getElementById("graphSvg");
    if (!svg || !svg.contains(e.target)) return;

    const mode = state.config.interaction?.mode || "placePoints";
    const activityHandlers = state.activityHandlers ?? {};
    const combined = { ...handlers, ...activityHandlers };
    if (combined[mode]) combined[mode](state, e, svg, onStateChange);
  });

  console.log("Interaction attached");
}
