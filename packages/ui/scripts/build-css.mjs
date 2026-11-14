// Builds dist/styles.css = design tokens (src/styles/globals.css, processed
// by the consumer's Tailwind) + compiled component CSS modules (dist/index.css,
// emitted by tsup). dist/index.css is removed so styles.css is the only
// stylesheet in the package.
import { readFile, rm, writeFile } from "node:fs/promises";

const tokens = await readFile("src/styles/globals.css", "utf8");
const components = await readFile("dist/index.css", "utf8");

await writeFile(
  "dist/styles.css",
  `${tokens}\n/* ---- Components (compiled CSS modules) ---- */\n${components}`,
);
await rm("dist/index.css");
await rm("dist/index.css.map", { force: true });
