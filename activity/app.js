async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Could not load config (${res.status}) from ${url}`);
  return res.json();
}

function getConfigUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("src"); // may be null
}

function setHeader(title, subtitle) {
  document.getElementById("title").textContent = title;
  document.getElementById("subtitle").textContent = subtitle || "";
}

function showError(err) {
  setHeader("Config load failed", err.message);
  document.getElementById("app").innerHTML = `
    <div class="muted">Fix the URL or config path and reload.</div>
    <pre>${escapeHtml(String(err.stack || err.message || err))}</pre>
  `;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[m]));
}

function renderConfig(config, src) {
  setHeader(config.title || "Untitled activity", `Loaded from: ${src}`);
  document.getElementById("app").innerHTML = `
    <div class="muted">✅ Engine loaded this config successfully.</div>
    <p><strong>Next step:</strong> we’ll render the grid + original points here.</p>
    <pre>${escapeHtml(JSON.stringify(config, null, 2))}</pre>
  `;
}

async function main() {
  const src = getConfigUrl();

  if (!src) {
    setHeader("No config specified", "Add ?src=... to the URL");
    document.getElementById("app").innerHTML = `
      <p class="muted">Example (local):</p>
      <pre>http://localhost:3000/activity/?src=../configs/reflections/reflect_x_001.json</pre>
    `;
    return;
  }

  const config = await fetchJson(src);
  renderConfig(config, src);
}

main().catch(showError);