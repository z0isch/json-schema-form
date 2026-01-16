import { defineConfig } from "vite";
import { resolve } from "path";

const isLibBuild = process.env.BUILD_MODE === "lib";

export default defineConfig({
  // Base path for GitHub Pages - uses repo name from env or defaults to '/'
  base: isLibBuild ? "/" : process.env.BASE_PATH || "/",
  build: isLibBuild
    ? {
        // Library build configuration
        lib: {
          entry: resolve(__dirname, "src/index.ts"),
          name: "JsonSchemaForm",
          fileName: "json-schema-form",
          formats: ["es"],
        },
        rollupOptions: {
          external: [],
        },
        sourcemap: true,
        minify: "esbuild",
      }
    : {
        // Demo site build for GitHub Pages
        outDir: "dist-site",
        sourcemap: true,
        minify: "esbuild",
        target: "esnext",
      },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
