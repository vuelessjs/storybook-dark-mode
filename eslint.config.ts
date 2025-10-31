import globals from "globals";

import js from "@eslint/js";
import ts from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const languageOptions = {
  globals: {
    ...globals.node,
    ...globals.browser,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};

export default ts.config(
  eslintPluginPrettier,
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    name: "common",
    languageOptions,
    plugins: {
      js,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@stylistic": stylistic,
      "@typescript-eslint": ts.plugin,
    },
    rules: {
      "no-console": process.env.PROD ? "error" : "warn",
      "no-debugger": process.env.PROD ? "error" : "warn",
      "no-unused-expressions": ["error", { allowTernary: true, allowShortCircuit: true }],
      "arrow-parens": ["error", "always"],
      curly: ["error", "multi-line"],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
        { blankLine: "always", prev: "directive", next: "*" },
        { blankLine: "any", prev: "directive", next: "directive" },
        { blankLine: "always", prev: "block-like", next: "*" },
        { blankLine: "always", prev: "*", next: "block-like" },
        { blankLine: "always", prev: "*", next: "return" },
      ],
      "prettier/prettier": ["warn", { printWidth: 100, singleQuote: false }],
      "@stylistic/max-len": ["error", { code: 120, ignoreComments: true, ignoreUrls: true }],
      "react/prop-types": 0,
      "react/jsx-tag-spacing": 0,
      "react/jsx-curly-newline": 0,
      "react/jsx-closing-tag-location": 0,
      "react/no-danger": 0,
      "@typescript-eslint/explicit-function-return-type": 0,
      "@typescript-eslint/explicit-member-accessibility": 0,
      "@typescript-eslint/camelcase": 0,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    name: "eslint-config",
    files: ["eslint.config.*"],
    rules: {
      "prettier/prettier": ["warn", { printWidth: 120, singleQuote: false }],
    },
  },
  {
    ignores: ["node_modules", "dist"],
  },
);
