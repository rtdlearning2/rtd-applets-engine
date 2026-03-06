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
  const defaultSrc = "/applets/configs/golden.json";
  const src = getSrcParam() || defaultSrc;

  const res = await fetch(src);
  if (!res.ok) {
    throw new Error(`Could not load config (${res.status}) from ${src}`);
  }

  const rawConfig = await res.json();
  const config = migrateConfig(rawConfig);

  await resolveActivity(config?.activity, src);
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
