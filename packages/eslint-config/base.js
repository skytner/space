import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";
import importPlugin from "eslint-plugin-import";
import perfectionist from "eslint-plugin-perfectionist";
import unicornPlugin from "eslint-plugin-unicorn";
import prettierPlugin from "eslint-plugin-prettier";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      import: importPlugin,
      perfectionist,
      unicorn: unicornPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "react-hooks/exhaustive-deps": "error",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "no-undef": "error",
      "eqeqeq": "error",
      "no-eval": "error",
      "consistent-return": "error",
      "no-floating-decimal": "warn",
      "no-implicit-coercion": "warn",
      "no-implied-eval": "error",
      "no-invalid-this": "error",
      "no-self-compare": "error",
      "complexity": ["error", { "max": 15 }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",

      "unicorn/prefer-array-find": "warn",
      "unicorn/no-array-for-each": "warn",
      "import/no-cycle": "error",
      "import/order": "error",
      "import/no-duplicates": "error",
      "perfectionist/sort-objects": "warn",
      "perfectionist/sort-interfaces": "warn",
      "perfectionist/sort-jsx-props": "warn",
      "unicorn/prefer-query-selector": "warn",
      "quotes": ["error", "single"],
      "comma-dangle": ["error", "always-multiline"],
      "prettier/prettier": "error",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    ignores: ["dist/**"],
  },
];

/** Base config без onlyWarn — для приложений (например Next), где нужны именно errors. */
export const configStrict = config.filter(
  (block) => !(block.plugins && block.plugins.onlyWarn),
);
