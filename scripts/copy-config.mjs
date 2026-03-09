import { cp, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "docs");

const copyDir = async (from, to) => {
  try {
    await mkdir(path.dirname(to), { recursive: true });
    await cp(from, to, { recursive: true });
  } catch (err) {
    if (err && err.code === "ENOENT") {
      return;
    }
    throw err;
  }
};

await copyDir(
  path.join(root, "applets", "configs"),
  path.join(dist, "applets", "configs"),
);
// Note: applets/activities/*.js are bundled by Vite as entry points (see vite.config.js)
