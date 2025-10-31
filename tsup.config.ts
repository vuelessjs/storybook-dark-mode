import { defineConfig, type Options } from "tsup";

const NODE_TARGET = "node20.19";

export default defineConfig(async (_options) => {
  const packageJson = (
    await import("./package.json", { with: { type: "json" } })
  ).default;

  const {
    bundler: { managerEntries = [], previewEntries = [], nodeEntries = [] },
  } = packageJson;

  const commonConfig: Options = {
    splitting: true,
    format: ["esm"],
    treeshake: true,
    clean: false,
    external: ["react", "react-dom", "@storybook/icons"],
  };

  const configs: Options[] = [];

  if (managerEntries.length) {
    configs.push({
      ...commonConfig,
      entry: managerEntries,
      platform: "browser",
      target: "esnext",
    });
  }

  if (previewEntries.length) {
    configs.push({
      ...commonConfig,
      entry: previewEntries,
      platform: "browser",
      target: "esnext",
      dts: true,
    });
  }

  if (nodeEntries.length) {
    configs.push({
      ...commonConfig,
      entry: nodeEntries,
      platform: "node",
      target: NODE_TARGET,
    });
  }

  return configs;
});

