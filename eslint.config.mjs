import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import getifyPlugin from "@getify/eslint-plugin-proper-arrows";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/node_modules", "**/dist"],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ),
  {
    rules: {
      "func-names": "error",
      "@getify/proper-arrows/name": "error",
      "require-await": ["error"],
      "@typescript-eslint/no-explicit-any": ["off"],
      "prettier.bracketSpacing": ["off"],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "explicit",
        },
      ],
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
    },
  },
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "unused-imports": unusedImports,
      "@getify/proper-arrows": getifyPlugin,
    },
    languageOptions: {
      parser: tsParser,
      globals: {
        window: "readonly",
      },
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
    },
  },
  {
    files: ["**/*.test.ts"],
    rules: {
      "@getify/proper-arrows/name": "off",
    },
  },
  eslintPluginPrettierRecommended,
];
