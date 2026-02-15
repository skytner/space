import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import nestjsPlugin from "@darraghor/eslint-plugin-nestjs-typed";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["dist/**", "node_modules/**", "eslint.config.js"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    plugins: {
      "@nestjs": nestjsPlugin,
    },
    rules: {
      "@nestjs/injectable-should-be-provided": "error",
      "@nestjs/provided-injected-should-match-factory": "error",
      "@nestjs/api-property-matches-property-optionality": "error",
      "@nestjs/all-properties-have-explicit-defined": "error",
      "@nestjs/param-decorator-name-matches-route-param": "error",
      
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  eslintConfigPrettier, 
];