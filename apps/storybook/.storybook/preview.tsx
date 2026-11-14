import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect, type ReactNode } from "react";

import "./preview.css";

/** Toggles the `.dark` class the design tokens key off. */
function ThemeRoot({ theme, children }: { theme: "light" | "dark"; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return children;
}

const withTheme: Decorator = (Story, context) => (
  <ThemeRoot theme={context.globals.theme === "dark" ? "dark" : "light"}>
    <Story />
  </ThemeRoot>
);

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Light or dark tokens",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    layout: "centered",
    controls: { expanded: true, sort: "requiredFirst" },
    a11y: { test: "error" },
  },
  tags: ["autodocs"],
};

export default preview;
