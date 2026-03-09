// engine/configLoader.js

import { migrateConfig } from "./configMigrations.js";
import { validatePageConfig } from "./pageSchema.js";
import { validateLegacyConfig } from "./legacySchema.js";
import { registerActivity } from "./activityRegistry.js";
import { registerValidator } from "./validatorRegistry.js";
import { preloadPageTypes } from "../pages/index.js";

export function getSrcParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get("src");
}

async function resolveActivity(activity, configSrc) {
  if (!activity?.activityModule) return;
  const moduleUrl = new URL(activity.activityModule, new URL(configSrc, window.location.href)).href;
  const mod = await import(moduleUrl);
  registerActivity(mod);
  if (typeof mod.validate === "function") {
    registerValidator(mod.activityType, mod.validate);
  }
}

export async function loadConfigFromSrc() {
  const defaultSrc = "/applets/configs/applet-4-reflect-x-quadratic.json";
  const src = getSrcParam() || defaultSrc;

  const res = await fetch(src);
  if (!res.ok) {
    const err = new Error(`Could not load config (${res.status}) from ${src}`);
    if (res.status === 404) err.code = "NOT_FOUND";
    throw err;
  }

  // If the server returned HTML instead of JSON (e.g. Vite's SPA fallback for a missing file),
  // treat it as not found rather than letting JSON.parse throw a confusing SyntaxError.
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json") && !contentType.includes("text/plain")) {
    const err = new Error(`Expected JSON config but server returned ${contentType || "unknown content"} for ${src}`);
    err.code = "NOT_FOUND";
    throw err;
  }

  const rawConfig = await res.json();
  const config = migrateConfig(rawConfig);

  await resolveActivity(config?.activity, src);
  // Also resolve activities declared inside individual pages (e.g. type: "applet")
  for (const page of config?.pages ?? []) {
    if (page?.activity?.activityModule) await resolveActivity(page.activity, src);
  }
  await preloadPageTypes(config?.pages ?? []);

  if (Array.isArray(config?.pages)) {
    const errors = validatePageConfig(config);
    if (errors.length > 0) {
      throw new Error(`Invalid pages config:\n- ${errors.join("\n- ")}`);
    }
  } else {
    const errors = validateLegacyConfig(config);
    if (errors.length > 0) {
      throw new Error(`Invalid legacy config:\n- ${errors.join("\n- ")}`);
    }
  }
  return { config, src };
}
