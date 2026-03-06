import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PAGE_TYPES } from "../engine/pages/pageTypes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configsDir = path.join(__dirname, "..", "applets", "configs");
const knownTypes = new Set(Object.values(PAGE_TYPES));

let passed = 0;
let failed = 0;

function check(label, condition, detail = "") {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}${detail ? ": " + detail : ""}`);
    failed++;
  }
}

const configFiles = fs.readdirSync(configsDir).filter(f => f.endsWith(".json"));

for (const file of configFiles) {
  const raw = fs.readFileSync(path.join(configsDir, file), "utf8");
  const config = JSON.parse(raw);
  const pages = Array.isArray(config.pages) ? config.pages : [];
  if (pages.length === 0) continue;

  console.log(`\n${file} (${pages.length} pages)`);

  for (const page of pages) {
    check(
      `page "${page.id ?? "?"}" type "${page.type}" is a known page type`,
      knownTypes.has(page.type),
      `"${page.type}" not found in PAGE_TYPES`
    );
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
