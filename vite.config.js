import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CONTENT_TYPES = {
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".html": "text/html",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

// Bundle activity modules as named entry points so relative imports are resolved
// at build time. This makes them work from any URL depth (e.g. PR preview subdirs).
const activityDir = path.join(__dirname, "applets", "activities");
const activityEntries = fs.existsSync(activityDir)
  ? Object.fromEntries(
      fs.readdirSync(activityDir)
        .filter((f) => f.endsWith(".js"))
        .map((f) => [
          `applets/activities/${f.slice(0, -3)}`,
          path.join(activityDir, f),
        ])
    )
  : {};

export default defineConfig({
  root: "activity",
  base: "./",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.join(__dirname, "activity", "index.html"),
        ...activityEntries,
      },
      preserveEntrySignatures: "exports-only",
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
  },
  plugins: [
    {
      name: "resolve-project-root",
      // Fixes module import resolution (e.g. import '/engine/...' or '/examples/...')
      resolveId(id) {
        if (id.startsWith("/") && !id.startsWith("/@")) {
          const filePath = path.join(__dirname, id);
          if (fs.existsSync(filePath)) {
            return filePath;
          }
        }
      },
      // Fixes fetch() requests to paths that only exist in the project root
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const urlPath = req.url?.split("?")[0];
          if (!urlPath || urlPath.startsWith("/@")) return next();
          // Skip files that exist under the activity/ root (let Vite handle them)
          const activityPath = path.join(__dirname, "activity", urlPath);
          if (fs.existsSync(activityPath)) return next();
          // Serve from project root if the file exists there
          const rootPath = path.join(__dirname, urlPath);
          if (fs.existsSync(rootPath) && fs.statSync(rootPath).isFile()) {
            const ext = path.extname(rootPath);
            const ct = CONTENT_TYPES[ext];
            if (ct) res.setHeader("Content-Type", ct);
            res.end(fs.readFileSync(rootPath));
            return;
          }
          next();
        });
      },
    },
  ],
});
