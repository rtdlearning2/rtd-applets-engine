export async function initUrlSearchParams(config) {
  const params = new URLSearchParams(window.location.search);
  const urlMode = params.get("mode");
  const embedParam = params.get("embed");
  const embedOn = embedParam === "1" || embedParam === "true";
  const embedOff = embedParam === "0" || embedParam === "false";
  const forceLegacy = params.get("legacy") === "1" || urlMode === "legacy";
  const configMode = config?.ui?.mode ?? config?.mode;
  const publishMode = config?.ui?.publishMode === true;
  const isSlideMode =
    urlMode === "slide" || config?.slideMode === true || configMode === "slide";
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

  return { forceLegacy, isSlideMode, publishMode, isEmbedMode };
}
