import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Resolve the absolute path of a package (needed in pnpm monorepos).
 */
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    // Forces :hover / :focus-visible / :active via `parameters.pseudo`.
    getAbsolutePath("storybook-addon-pseudo-states"),
  ],
  framework: getAbsolutePath("@storybook/react-vite"),
  async viteFinal(viteConfig) {
    const { mergeConfig } = await import("vite");
    return mergeConfig(viteConfig, {
      // Tailwind compiles preview.css and the library's *.module.css files
      // (their @apply / @reference) on the fly.
      plugins: [tailwindcss()],
      build: {
        rollupOptions: {
          // Base UI's 'use client' directives are meaningless in this
          // client-only bundle; hide the per-file warning noise.
          onwarn(warning: { code?: string }, defaultHandler: (w: unknown) => void) {
            if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
            defaultHandler(warning);
          },
        },
      },
      resolve: {
        // Stories render the library SOURCE, so edits in packages/ui show up
        // instantly without rebuilding dist. Only the bare specifier is
        // aliased; the published entry is still `@lab-ds/ui` in stories.
        alias: [
          {
            find: /^@lab-ds\/ui$/,
            replacement: fileURLToPath(
              new URL("../../../packages/ui/src/index.ts", import.meta.url),
            ),
          },
        ],
      },
    });
  },
};

export default config;
