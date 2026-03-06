import { parseSize } from "../utils/lib";

const presets = {
  ppt1080p: {
    slideWidth: "1280px",
    slideHeight: "720px",
    safePadding: "24px",
    contentWidth: "1200px",
    contentPadding: "24px",
    graphSize: "520px",
  },
  ppt720p: {
    slideWidth: "960px",
    slideHeight: "540px",
    safePadding: "18px",
    contentWidth: "900px",
    contentPadding: "18px",
    graphSize: "480px",
  },
  ppt4x3: {
    slideWidth: "1024px",
    slideHeight: "768px",
    safePadding: "20px",
    contentWidth: "960px",
    contentPadding: "20px",
    graphSize: "520px",
  },
};

export async function initLayout(config, publishMode, isEmbedMode) {
  const appRoot = document.getElementById("app");
  const layout = config?.ui?.layout ?? {};
  const presetKey = layout.preset;
  const preset = presetKey && presets[presetKey] ? presets[presetKey] : null;
  const resolvedLayout = preset ? { ...preset, ...layout } : layout;
  if (appRoot) {
    appRoot.dataset.publishMode = publishMode ? "1" : "0";
    appRoot.dataset.embedMode = isEmbedMode ? "1" : "0";
  }

  if (isEmbedMode) {
    resolvedLayout.overflowPolicy = "clamp";
  }

  if (appRoot && resolvedLayout) {
    if (resolvedLayout.slideWidth)
      appRoot.style.setProperty(
        "--slide-width",
        String(resolvedLayout.slideWidth),
      );
    if (resolvedLayout.slideHeight)
      appRoot.style.setProperty(
        "--slide-height",
        String(resolvedLayout.slideHeight),
      );
    if (resolvedLayout.safePadding)
      appRoot.style.setProperty(
        "--safe-padding",
        String(resolvedLayout.safePadding),
      );
    if (resolvedLayout.contentWidth)
      appRoot.style.setProperty(
        "--content-width",
        String(resolvedLayout.contentWidth),
      );
    if (resolvedLayout.contentPadding)
      appRoot.style.setProperty(
        "--content-padding",
        String(resolvedLayout.contentPadding),
      );
    if (resolvedLayout.graphSize)
      appRoot.style.setProperty(
        "--graph-size",
        String(resolvedLayout.graphSize),
      );
    if (resolvedLayout.overflowPolicy)
      appRoot.dataset.overflowPolicy = String(resolvedLayout.overflowPolicy);
  }
}

const applyOverflowCollapse = (safeArea, shouldCollapse) => {
  if (!safeArea) return;
  const targets = safeArea.querySelectorAll(
    ".page-body, .activity-copy > section, .explanation-box",
  );

  targets.forEach((section) => {
    section.classList.add("collapsible-section");
    if (shouldCollapse) {
      section.classList.add("collapsed");
    } else {
      section.classList.remove("collapsed");
    }

    let toggle = null;
    const next = section.nextElementSibling;
    if (next && next.classList.contains("collapse-toggle")) {
      toggle = next;
    }

    if (!toggle) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "collapse-toggle";
      toggle.addEventListener("click", () => {
        const collapsed = section.classList.toggle("collapsed");
        toggle.textContent = collapsed ? "Show more" : "Show less";
      });
      section.insertAdjacentElement("afterend", toggle);
    }

    toggle.textContent = section.classList.contains("collapsed")
      ? "Show more"
      : "Show less";
    toggle.style.display = shouldCollapse ? "inline-flex" : "none";
  });
};

export const applyLayoutConstraints = () => {
  const root = document.getElementById("app");
  if (!root) return;
  const inner = root.querySelector(".slide-scale-inner");
  if (!inner) return;

  const computed = getComputedStyle(root);
  const slideWidth = parseSize(
    computed.getPropertyValue("--slide-width"),
    1280,
  );
  const slideHeight = parseSize(
    computed.getPropertyValue("--slide-height"),
    720,
  );
  const containerWidth = root.clientWidth || window.innerWidth;
  const containerHeight = root.clientHeight || window.innerHeight;
  const scale = Math.min(
    containerWidth / slideWidth,
    containerHeight / slideHeight,
    1,
  );

  inner.style.setProperty("--slide-scale", String(scale));

  const safeArea = root.querySelector(".slide-safe-area");
  if (safeArea) {
    const overflow =
      safeArea.scrollHeight > safeArea.clientHeight ||
      safeArea.scrollWidth > safeArea.clientWidth;
    safeArea.classList.toggle("overflow-warning", overflow);
    const policy = root.dataset.overflowPolicy;
    safeArea.classList.toggle("overflow-clamp", policy === "clamp");
    applyOverflowCollapse(safeArea, policy === "collapse" && overflow);
  }
};
