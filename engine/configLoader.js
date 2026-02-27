// engine/configLoader.js

import { migrateConfig } from "./configMigrations.js";

export function getSrcParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get("src");
}

export async function loadConfigFromSrc() {
  const src = getSrcParam();
  if (!src) throw new Error("Missing ?src= parameter in URL");

  const res = await fetch(src);
  if (!res.ok) {
    throw new Error(`Could not load config (${res.status}) from ${src}`);
  }

  const rawConfig = await res.json();
  const config = migrateConfig(rawConfig);
  return { config, src };
}
