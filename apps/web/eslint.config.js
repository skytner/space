// Снимаем глобальный патч onlyWarn (из base.js), чтобы ошибки были именно error
import onlyWarn from "eslint-plugin-only-warn";
onlyWarn.disable();

import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  // Неиспользуемые переменные/пропсы (например link) — error
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];
