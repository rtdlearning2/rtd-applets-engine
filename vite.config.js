import { defineConfig } from "vite";

export default defineConfig({
  root: "activity",
  base: "./",
  build: {
    outDir: "../docs",
    emptyOutDir: true
  }
});
