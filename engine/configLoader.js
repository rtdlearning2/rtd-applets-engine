// engine/configLoader.js

import { migrateConfig } from "./configMigrations.js";
import { validatePageConfig } from "./pageSchema.js";
import { validateLegacyConfig } from "./legacySchema.js";

export function getSrcParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get("src");
}

export async function loadConfigFromSrc() {
  const defaultSrc = "/engine/config/golden.json";
  const src = getSrcParam() || defaultSrc;

  const res = await fetch(src);
  if (!res.ok) {
    throw new Error(`Could not load config (${res.status}) from ${src}`);
  }

  const rawConfig = await res.json();
  const config = migrateConfig(rawConfig);
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
