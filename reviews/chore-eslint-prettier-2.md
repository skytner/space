# Code review: `chore/eslint-prettier` #2 (повторная проверка)

**Ветка:** `chore/eslint-prettier`

---

## Что уже хорошо

- Опечатки исправлены: `comma-dangle`, `import/no-cycle`.
- Nest-правила вынесены в отдельный конфиг `nest.js` с плагином `@darraghor/eslint-plugin-nestjs-typed`, префикс правил `@nestjs/` корректен.
- В base задан явный лимит `complexity: ["error", { "max": 15 }]`.
- Правила Next вынесены из base в `next.js` — структура конфигов логичная.

---

## Что было сделано в рамках проверки

Чтобы линт реально запускался, внесены такие изменения (можно оставить или взять за основу):

1. **Подключение плагинов в base.js**  
   Правила из плагинов (import, perfectionist, unicorn, prettier) были указаны, но сами плагины не регистрировались. Добавлены импорты и блок `plugins` в base:
   - `eslint-plugin-import`, `eslint-plugin-perfectionist`, `eslint-plugin-unicorn`, `eslint-plugin-prettier`.

2. **Имена правил с префиксами плагинов**  
   - `prefer-array-find` → `unicorn/prefer-array-find`
   - `no-array-for-each` → `unicorn/no-array-for-each`
   - `sort-objects` → `perfectionist/sort-objects`
   - `sort-interfaces` → `perfectionist/sort-interfaces`
   - `sort-jsx-props` → `perfectionist/sort-jsx-props`
   - `prefer-query-selector` → `unicorn/prefer-query-selector`
   - `import/no-duplicate` → `import/no-duplicates`

3. **Правило `filename-case`**  
   В `eslint-plugin-filenames` такого правила нет; есть `filenames/match-regex`. Плагин к тому же не поддерживает flat config (ошибка «Rule must be an object with a `create` method»). Правило из base убрано. Если нужна проверка имён файлов — смотреть в сторону плагина с поддержкой flat config или отключить до появления подходящего.

4. **Правило `no-null`**  
   Убрано из base: в используемых конфигах/плагинах такого правила нет. При необходимости искать в других плагинах или в typescript-eslint.

5. **Type-aware правила**  
   `@typescript-eslint/await-thenable`, `no-floating-promises`, `no-misused-promises`, `strict-boolean-expressions`, `no-unnecessary-type-assertion` требуют `parserOptions.project` / projectService. Для `eslint.config.js` и других .js файлов вне tsconfig это приводило к падению. Сделано так:
   - из base эти правила убраны;
   - в `next.js` добавлен блок только для `**/*.ts` и `**/*.tsx` с `parserOptions: { projectService: true, tsconfigRootDir: process.cwd() }` и включением этих правил там. Для .js конфигов type-aware правила не применяются — ошибка уходит.

6. **Экспорт nest**  
   В `package.json` добавлен экспорт `"./nest": "./nest.js"`, чтобы приложение api могло подключать `@repo/eslint-config/nest` при переходе на общий конфиг.

---

## Рекомендации

- **apps/api:** сейчас использует свой `eslint.config.mjs`. Если хочешь единый стиль с репо, можно перейти на `@repo/eslint-config/nest` и при необходимости донастроить только специфичные для api правила.
- **Prettier:** в корне есть `format` и `.prettierrc` с плагинами; при первом запуске `bun run format` убедись, что плагины установлены в корне (как в первом ревью).
- **Линт:** после правок `pnpm lint` / `bun run lint` в admin даёт 0 errors, 34 warnings (prettier + perfectionist). Часть можно автоматически поправить: `eslint . --fix` в приложении. При `--max-warnings 0` в скрипте линт будет падать, пока предупреждения не исправлены или порог не ослаблен.

---

## Итог

Конфиг после правок рабочий: плагины подключены, имена правил с префиксами, type-aware правила только для ts/tsx. Можно мержить с учётом рекомендаций выше; при желании часть правок (подключение плагинов и префиксы) можно оформить отдельным коммитом от тебя.
