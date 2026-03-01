# Contained Responsive Slide Mode (Embed)

Purpose
- Ensure a single right-side scrollbar in embed mode.
- Keep layout contained and centered for 16:9 slides.
- Maintain stable graph sizing and prevent chip clipping.

Where It Is Enforced
- CSS: embed-mode rules in [activity/styles.css](../activity/styles.css)
- JS: embed-mode toggle in [activity/app.js](../activity/app.js)
- Viewport: [activity/index.html](../activity/index.html)

Behavior Summary (Embed Mode Only)
- Single scroll container: `.wrap.embed-viewport` is the only vertical scroller.
- Outer lock: `html, body` are height-locked and `overflow: hidden`.
- Containment: `.main-container` is centered with `max-width: 1200px`.
- Two-column layout: left panel flexes, graph uses a stable width clamp.
- Chip banks: points/types/values wrap; no horizontal clipping.
- Mobile-safe: `viewport-fit=cover` and `-webkit-overflow-scrolling: touch`.

Verification Checklist
- Only one vertical scrollbar appears (far right of the app).
- No horizontal scrollbars.
- Q1/Q2 render unchanged.
- Q3 shows Type/Value when content exceeds height.
- Graph width stays stable on wide screens.

How To Run
- Build: `npm run build`
- Preview: `npm run preview`
- Open: http://localhost:4173/?src=/engine/config/golden.json&embed=1
