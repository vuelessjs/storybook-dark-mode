import { fileURLToPath } from "node:url";

export default {
  stories: ["../src/**/*.stories.tsx"],
  addons: [fileURLToPath(import.meta.resolve("../../preset.js"))],
  framework: {
    name: "@storybook/react-vite",
  },
};
