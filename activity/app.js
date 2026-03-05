import { loadConfigFromSrc } from "../engine/core/configLoader.js";
import { createAppState } from "../engine/core/state.js";
import { render } from "../engine/renderers/renderer.js";
import { renderPageApp } from "../engine/renderers/pageRenderer.js";
import { attachGraphInteraction } from "../engine/core/interaction.js";

async function main() {
  try {
    const { config, src } = await loadConfigFromSrc();

    // Attempt to load a content-provided registration script so content repos
    // can register activities (like `transformations`) before the engine
    // creates app state. This file is optional and should live at the
    // absolute path `/examples/applets-math30-1/register-transformations.mjs`
    // in this workspace example. Failing to load it is non-fatal.
    if (import.meta.env.DEV) {
      try {
        await import(
          /* @vite-ignore */
          "/examples/applets-math30-1/register-transformations.mjs"
        );
      } catch (err) {
        // Ignore missing registration script; proceed with defaults.
        // console.info('No content registration script found.');
      }
    }

    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get("mode");
    const embedParam = params.get("embed");
    const embedOn = embedParam === "1" || embedParam === "true";
    const embedOff = embedParam === "0" || embedParam === "false";
    const forceLegacy = params.get("legacy") === "1" || urlMode === "legacy";
    const configMode = config?.ui?.mode ?? config?.mode;
    const publishMode = config?.ui?.publishMode === true;
    const isSlideMode =
      urlMode === "slide" ||
      config?.slideMode === true ||
      configMode === "slide";
    let isInIframe = false;
    try {
      isInIframe = window.self !== window.top;
    } catch (err) {
      isInIframe = true;
    }
    const isEmbedMode =
      !embedOff && (publishMode || embedOn || isSlideMode || isInIframe);

    if (isSlideMode) {
      document.documentElement.classList.add("slide-mode");
      document.body.classList.add("slide-mode");
    }

    if (publishMode) {
      document.documentElement.classList.add("publish-mode");
      document.body.classList.add("publish-mode");
    }

    if (isEmbedMode) {
      document.documentElement.classList.add("embed-mode");
      document.body.classList.add("embed-mode");
      document.querySelector(".wrap")?.classList.add("embed-viewport");
    }

    const appRoot = document.getElementById("app");
    const layout = config?.ui?.layout ?? {};
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

    const state = createAppState({ config, src });
    state.uiMode = isSlideMode ? "slide" : "browser";

    const parseSize = (value, fallback) => {
      const num = Number.parseFloat(String(value).trim());
      return Number.isFinite(num) ? num : fallback;
    };

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

    const applyLayoutConstraints = () => {
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

    const hasPages =
      Array.isArray(config?.pages) && config.pages.length > 0 && !forceLegacy;

    // Render once initially
    if (hasPages) {
      renderPageApp(state);
    } else {
      render(state);
    }

    applyLayoutConstraints();
    window.addEventListener("resize", applyLayoutConstraints);
    window.addEventListener("applet:rendered", () => {
      requestAnimationFrame(applyLayoutConstraints);
    });

    // Attach interaction (no-op for now)
    if (!hasPages) {
      attachGraphInteraction(state, () => {
        render(state);
      });
    }
  } catch (err) {
    console.error(err);
    const el = document.getElementById("app");
    if (el) el.innerHTML = `<pre style="color:red;">${err.message}</pre>`;
  }
}

main();
