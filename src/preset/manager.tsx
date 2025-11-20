import { addons } from "storybook/manager-api";
import { Addon_TypesEnum } from "storybook/internal/types";
import { themes } from "storybook/theming";
import * as React from "react";

import Tool from "../Tool";
import { prefersDark, store } from "../store";

const currentStore = store();
const currentTheme = currentStore.current || (prefersDark.matches && "dark") || "light";

addons.setConfig({
  theme: {
    ...themes[currentTheme],
    ...currentStore[currentTheme],
  },
});

addons.register("@vueless/storybook-dark-mode", (api) => {
  addons.add("@vueless/storybook-dark-mode", {
    title: "dark mode",
    type: Addon_TypesEnum.TOOL,
    match: ({ viewMode }) => viewMode === "story" || viewMode === "docs",
    render: () => <Tool api={api} />,
  });
});
