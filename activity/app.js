// app.js (no template strings)

let APP_STATE = {
  config: null,
  src: null,
  showSolution: false
};

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load config (" + res.status + ") from " + url);
  return res.json();
}

function getConfigUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("src"); // may be null
}

function setHeader(title, subtitle) {
  const titleEl = document.getElementById("title");
  const subtitleEl = document.getElementById("subtitle");
  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle || "";
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (m) {
    return ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[m];
  });
}

function showError(err) {
  setHeader("Config load failed", (err && err.message) ? err.message : String(err));

  const appEl = document.getElementById("app");
  if (!appEl) return;

  const details = escapeHtml(String((err && (err.stack || err.message)) || err));
  appEl.innerHTML =
    '<div class="muted">Fix the URL or config path and reload.</div>' +
    "<pre>" + details + "</pre>";
}

function applyTransform(points, transform) {
  if (!transform || !transform.type) return points;

  if (transform.type === "reflect_x") {
    return points.map(function (p) { return [p[0], -p[1]]; });
  }

  if (transform.type === "reflect_y") {
    return points.map(function (p) { return [-p[0], p[1]]; });
  }

  return points;
}

function buildPathData(points, toSvgX, toSvgY) {
  let pathData = "";
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    pathData += (i === 0 ? "M " : "L ") + toSvgX(p[0]) + " " + toSvgY(p[1]) + " ";
  }
  return pathData.trim();
}

/**
 * Inject the instructions + controls card into the DOM exactly as specified
 * (so you can add it in index.html later if you prefer).
 *
 * Placement:
 * - inside <main class="wrap"> if present
 * - immediately ABOVE <div id="app">
 */
function ensureInstructionsCard() {
  const appEl = document.getElementById("app");
  if (!appEl) return null;

  let card = document.getElementById("instructionsCard");
  if (card) return card;

  card = document.createElement("div");
  card.className = "card";
  card.id = "instructionsCard";
  card.setAttribute("style", "margin-bottom: 12px;");

  // This markup matches what you provided
  card.innerHTML =
    '<div id="prompt" style="font-size:16px; font-weight:600;"></div>' +
    '<div id="howto" class="muted" style="margin-top:6px;"></div>' +
    '<div class="muted" style="margin-top:6px;">' +
      "Plot <b>exactly 5 points</b>, from left to right. Points will snap when close." +
    "</div>" +
    '<div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">' +
      '<button id="btnUndo" type="button">Undo</button>' +
      '<button id="btnReset" type="button">Reset</button>' +
      '<button id="btnSubmit" type="button">Submit</button>' +
      '<button id="btnSeeSolution" type="button" style="display:none;">See solution</button>' +
    "</div>" +
    '<div id="feedback" style="margin-top:12px;"></div>';

  // Insert above app, preferably within main.wrap
  const wrapMain = appEl.closest("main.wrap");
  if (wrapMain) {
    wrapMain.insertBefore(card, appEl);
  } else {
    // Fallback: insert right before #app wherever it is
    appEl.parentNode.insertBefore(card, appEl);
  }

  return card;
}

function setFeedback(html) {
  const feedbackEl = document.getElementById("feedback");
  if (!feedbackEl) return;
  feedbackEl.innerHTML = html || "";
}

function defaultHowtoForTransform(transform) {
  if (!transform || !transform.type) return "";

  if (transform.type === "reflect_x") {
    return "Reflect the graph across the <b>x-axis</b>: keep x-values the same and negate y-values.";
  }
  if (transform.type === "reflect_y") {
    return "Reflect the graph across the <b>y-axis</b>: keep y-values the same and negate x-values.";
  }
  return "";
}

/**
 * Fill the instructions card fields from config (if present) and wire controls.
 * Note: Plotting/snap/undo point logic isn’t implemented yet in this file—
 * this step just creates the UI “place to show instructions + controls” and
 * sets up basic submit/solution flow.
 */
function setupInstructionsUI(config) {
  ensureInstructionsCard();

  const promptEl = document.getElementById("prompt");
  const howtoEl = document.getElementById("howto");
  const btnUndo = document.getElementById("btnUndo");
  const btnReset = document.getElementById("btnReset");
  const btnSubmit = document.getElementById("btnSubmit");
  const btnSeeSolution = document.getElementById("btnSeeSolution");

  // Populate text
  const promptText = (config && config.prompt) ? String(config.prompt) :
    ((config && config.title) ? String(config.title) : "Complete the transformation");
  if (promptEl) promptEl.textContent = promptText;

  const howtoHtml = (config && config.howto) ? String(config.howto) : defaultHowtoForTransform(config && config.transform);
  if (howtoEl) howtoEl.innerHTML = howtoHtml;

  // Reset state/UI
  APP_STATE.showSolution = false;
  if (btnSeeSolution) btnSeeSolution.style.display = "none";
  setFeedback("");

  // Wire buttons (placeholder behavior until plotting is added)
  if (btnUndo) {
    btnUndo.onclick = function () {
      setFeedback('<div class="muted">Undo is ready to be wired to point-plotting (not yet implemented in this app.js).</div>');
    };
  }

  if (btnReset) {
    btnReset.onclick = function () {
      APP_STATE.showSolution = false;
      if (btnSeeSolution) btnSeeSolution.style.display = "none";
      setFeedback('<div class="muted">Reset complete (point-plotting reset will be added next).</div>');
      if (APP_STATE.config) renderConfig(APP_STATE.config, APP_STATE.src);
    };
  }

  if (btnSubmit) {
    btnSubmit.onclick = function () {
      // Until point plotting exists, submit just reveals the "See solution" option.
      setFeedback(
        '<div style="font-weight:600;">Submitted.</div>' +
        '<div class="muted" style="margin-top:6px;">You can now view the solution.</div>'
      );
      if (btnSeeSolution) btnSeeSolution.style.display = "inline-block";
    };
  }

  if (btnSeeSolution) {
    btnSeeSolution.onclick = function () {
      APP_STATE.showSolution = true;
      setFeedback('<div style="font-weight:600;">Solution shown.</div>');
      if (APP_STATE.config) renderConfig(APP_STATE.config, APP_STATE.src);
    };
  }
}

function renderConfig(config, src) {
  // --- Normalize config so "transform" exists at the top level for reflect-x activities ---
  // This matches the desired JSON shape:
  // {
  //   "title": "...",
  //   "grid": { ... },
  //   "original": { ... },
  //   "transform": { "type": "reflect_x" }
  // }
  try {
    const title = (config && config.title) ? String(config.title) : "";
    const srcStr = src ? String(src) : "";
    const looksLikeReflectX =
      (srcStr.indexOf("reflect_x") !== -1) ||
      (title.toLowerCase().indexOf("reflect across the x-axis") !== -1) ||
      (title.toLowerCase().indexOf("reflect across the x axis") !== -1);

    if (looksLikeReflectX && (!config.transform || !config.transform.type)) {
      config.transform = { type: "reflect_x" };
    }
  } catch (e) {
    // If anything weird happens, don't block rendering; just proceed as-is.
  }

  // Ensure instructions UI exists + updated (safe to call repeatedly)
  setupInstructionsUI(config);

  setHeader((config && config.title) ? config.title : "Untitled activity", "Loaded from: " + src);

  const appEl = document.getElementById("app");
  if (!appEl) return;

  // Basic validation with friendly message
  if (!config || !config.grid || !config.original || !config.original.points || !config.original.points.length) {
    appEl.innerHTML =
      '<div class="muted">Config is missing required fields.</div>' +
      "<pre>" + escapeHtml(JSON.stringify(config, null, 2)) + "</pre>";
    return;
  }

  const xmin = config.grid.xmin;
  const xmax = config.grid.xmax;
  const ymin = config.grid.ymin;
  const ymax = config.grid.ymax;

  const width = 640;
  const height = 640;

  const xScale = width / (xmax - xmin);
  const yScale = height / (ymax - ymin);

  function toSvgX(x) { return (x - xmin) * xScale; }
  function toSvgY(y) { return height - (y - ymin) * yScale; }

  // SVG builder
  let svg =
    '<svg viewBox="0 0 ' + width + " " + height + '" width="' + width + '" height="' + height + '" style="border:1px solid #ccc; background:white;">';

  // Grid lines
  for (let x = xmin; x <= xmax; x++) {
    const sx = toSvgX(x);
    const stroke = (x === 0) ? "#000" : "#eee";
    const strokeWidth = (x === 0) ? 1.5 : 1;
    svg += '<line x1="' + sx + '" y1="0" x2="' + sx + '" y2="' + height + '" stroke="' + stroke + '" stroke-width="' + strokeWidth + '"/>';
  }

  for (let y = ymin; y <= ymax; y++) {
    const sy = toSvgY(y);
    const stroke = (y === 0) ? "#000" : "#eee";
    const strokeWidth = (y === 0) ? 1.5 : 1;
    svg += '<line x1="0" y1="' + sy + '" x2="' + width + '" y2="' + sy + '" stroke="' + stroke + '" stroke-width="' + strokeWidth + '"/>';
  }

  // Axis numbers (tick labels) — skip 0 by default
  const axisLabelStyle = "font-family: Arial, sans-serif; font-size: 12px; fill: #666; user-select: none; pointer-events: none;";
  for (let x = xmin; x <= xmax; x++) {
    if (x === 0) continue;
    const sx = toSvgX(x);
    const sy0 = toSvgY(0);
    svg += '<text x="' + sx + '" y="' + (sy0 + 18) + '" text-anchor="middle" style="' + axisLabelStyle + '">' + x + "</text>";
  }

  for (let y = ymin; y <= ymax; y++) {
    if (y === 0) continue;
    const sx0 = toSvgX(0);
    const sy = toSvgY(y);
    svg += '<text x="' + (sx0 - 10) + '" y="' + (sy + 4) + '" text-anchor="end" style="' + axisLabelStyle + '">' + y + "</text>";
  }

  // Points
  const originalPoints = config.original.points;

  // --- Expected/ghost graph (transformed) ---
  // NOW: Only draw when solution is enabled (after clicking "See solution")
  if (APP_STATE.showSolution && config.transform && config.transform.type) {
    const expectedPoints = applyTransform(originalPoints, config.transform);

    const expectedPath = buildPathData(expectedPoints, toSvgX, toSvgY);

    // dashed green line
    if (config.original.connectLines !== false) {
      svg += '<path d="' + expectedPath + '" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-dasharray="7 5" opacity="0.85" />';
    }

    // green points
    for (let i = 0; i < expectedPoints.length; i++) {
      const p = expectedPoints[i];
      svg += '<circle cx="' + toSvgX(p[0]) + '" cy="' + toSvgY(p[1]) + '" r="5" fill="#16a34a" opacity="0.85" />';
    }
  }

  // --- Original polyline (blue) ---
  const originalPath = buildPathData(originalPoints, toSvgX, toSvgY);

  if (config.original.connectLines !== false) {
    svg += '<path d="' + originalPath + '" fill="none" stroke="#2563eb" stroke-width="2.5" />';
  }

  // Original points (blue)
  for (let i = 0; i < originalPoints.length; i++) {
    const p = originalPoints[i];
    svg += '<circle cx="' + toSvgX(p[0]) + '" cy="' + toSvgY(p[1]) + '" r="5" fill="#2563eb" />';
  }

  // 🔵 Function label (pixel-positioned so it ALWAYS shows)
  svg += '<text x="' + (width - 110) + '" y="28" ' +
         'style="font-family: Arial, sans-serif; font-size: 16px; fill: #2563eb; font-weight: 600; pointer-events: none;">' +
         'y = f(x)</text>';

  svg += "</svg>";
  appEl.innerHTML = svg;
}

async function main() {
  const src = getConfigUrl();

  if (!src) {
    setHeader("No config specified", "Add ?src=... to the URL");
    ensureInstructionsCard();
    const appEl = document.getElementById("app");
    if (appEl) {
      appEl.innerHTML =
        '<p class="muted">Example:</p>' +
        "<pre>https://rtdlearning2.github.io/rtd-applets-engine/activity/?src=https://raw.githubusercontent.com/rtdlearning2/rtd-applets-math30-1/main/configs/unit-1-transformations/reflections/reflect_x_001.json</pre>";
    }
    return;
  }

  const config = await fetchJson(src);
  APP_STATE.config = config;
  APP_STATE.src = src;

  renderConfig(config, src);
}

window.addEventListener("DOMContentLoaded", function () {
  main().catch(showError);
});
