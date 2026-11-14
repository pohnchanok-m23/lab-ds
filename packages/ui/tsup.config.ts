import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2022",
  external: ["react", "react-dom", "react/jsx-runtime"],
  // Only *.module.css files are imported from TS. tsup runs them through
  // postcss.config.mjs (Tailwind), then esbuild's local-css loader hashes the
  // class names and emits dist/index.css. scripts/build-css.mjs then
  // combines that file with the tokens into dist/styles.css.
  loader: { ".css": "local-css" },
  // No bundle-wide "use client": that would turn buttonVariants() into a client
  // reference that Server Components cannot call. The components contain no
  // hooks; interactivity lives in @base-ui/react, which stays external (it is a
  // dependency) and ships its own 'use client' directives.
});
