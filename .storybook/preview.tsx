import type { Preview } from "@storybook/react";
import React, { useEffect } from "react";
import "../src/index.css";

const THEME_CLASS: Record<string, string> = {
  "default-light": "",
  "default-dark": "dark",
  "midnight-slate": "theme-midnight",
  "warm-sand": "theme-warm-sand",
  "graphite": "theme-graphite",
  "naval": "theme-naval",
};

const withTheme = (Story: any, context: any) => {
  const theme = context.globals.theme || "default-light";
  useEffect(() => {
    document.documentElement.className = THEME_CLASS[theme] ?? "";
    document.body.style.background = "hsl(var(--background))";
    document.body.style.color = "hsl(var(--foreground))";
    document.body.style.minHeight = "100vh";
    document.body.style.padding = "2rem";
    document.body.style.transition = "background-color 0.15s, color 0.15s";
  }, [theme]);
  return React.createElement(Story);
};

const preview: Preview = {
  parameters: {
    layout: "centered",
    options: {
      storySort: {
        order: ["Foundations", ["Colors", "Typography", "Spacing"], "Components"],
      },
    },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Autumn Design System theme",
      defaultValue: "default-light",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "default-light", title: "Default — Light" },
          { value: "default-dark", title: "Default — Dark" },
          { value: "midnight-slate", title: "Midnight Slate" },
          { value: "warm-sand", title: "Warm Sand" },
          { value: "graphite", title: "Graphite" },
          { value: "naval", title: "Naval" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
