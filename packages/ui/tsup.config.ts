import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2022",
  external: ["react", "react-dom", "react/jsx-runtime"],
  // The whole bundle is marked as a client module so it works when imported
  // from Next.js Server Components. Server-safe components can be split into
  // a separate entry later if needed.
  banner: { js: '"use client";' },
});
