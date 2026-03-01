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

await copyDir(path.join(root, "engine", "config"), path.join(dist, "engine", "config"));
await copyDir(path.join(root, "activity", "config"), path.join(dist, "activity", "config"));
