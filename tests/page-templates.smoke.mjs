import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAllPageRenderers } from "../engine/pages/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "..", "engine", "config", "page-templates.json");
const raw = fs.readFileSync(configPath, "utf8");
const config = JSON.parse(raw);

const pages = Array.isArray(config.pages) ? config.pages : [];
const types = new Set(pages.map(page => page.type));
const renderers = getAllPageRenderers();
const rendererTypes = new Set(renderers.map(renderer => renderer.type));

const missing = [...types].filter(type => !rendererTypes.has(type));

if (missing.length > 0) {
  console.error("Missing page renderers for:", missing.join(", "));
  process.exit(1);
}

console.log("Page template smoke test passed. Types:", [...types].join(", "));
