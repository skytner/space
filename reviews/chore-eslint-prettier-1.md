# Code review: `chore/eslint-prettier` #1

**Ветка:** `chore/eslint-prettier`  
**Цель:** ESLint на весь проект (apps + packages) + настройка Prettier, максимально строго (в духе Java).

---

## Критично: линт сейчас не запускается

При `eslint .` в `apps/admin` (и любом приложении, использующем `@repo/eslint-config`) падает:

```text
TypeError: Key "rules": Key "injectable-should-be-provided": Could not find "injectable-should-be-provided" in plugin "@".
```

Причина: в `packages/eslint-config/base.js` включены правила, для которых в этом пакете **нет плагинов**. Base подключается к Next.js и React (admin, web, packages/ui), а не к API (Nest). Нужно либо добавить плагины, либо убрать/перенести правила.

---

## 1. Опечатки в названиях правил

**Файл:** `packages/eslint-config/base.js`

| Сейчас (ошибка)   | Нужно            |
|-------------------|------------------|
| `"comma-danger"`  | `"comma-dangle"` |
| `"import/no-cycl"`| `"import/no-cycle"` |

Исправь на правильные имена, иначе правила не применяются или дают неожиданное поведение.

---

## 2. Правила без установленных плагинов

Эти правила объявлены в base, но в `packages/eslint-config/package.json` нет соответствующих плагинов:

| Правило | Плагин (что поставить) |
|--------|-------------------------|
| `prettier/prettier` | `eslint-plugin-prettier` |
| `import/order`, `import/no-duplicate`, `import/no-cycle` | `eslint-plugin-import` |
| `filename-case` | например `eslint-plugin-filename-case` (или аналог) |
| `sort-objects`, `sort-interfaces`, `sort-jsx-props` | например `eslint-plugin-perfectionist` (проверь точные имена правил под своей версией) |
| `prefer-query-selector` | уточни пакет (часто в составе style/legacy плагинов) |
| `no-array-for-each` | `eslint-plugin-unicorn` |

**Что сделать:** для каждого правила из таблицы либо добавить нужный плагин в `packages/eslint-config` и подключить в base (или в next/react конфиге), либо временно убрать правило, пока плагин не добавлен. Иначе линт не стартует.

---

## 3. NestJS/ Angular-специфичные правила в общем base

В base включены правила, которые выглядят как из экосистемы Nest/Angular:

- `injectable-should-be-provided`
- `provided-injected-should-match-factory`
- `api-property-matches-property-optionality`
- `all-properties-have-explicit-defined`
- `param-decorator-name-matches-route-param`

Base используется только в **Next.js** и **React** (admin, web, packages/ui). Приложение **api** (Nest) использует свой `apps/api/eslint.config.mjs` и не тянет `@repo/eslint-config`. В итоге для admin/web ESLint ищет эти правила в плагине `"@"` и падает с ошибкой выше.

**Что сделать:** удалить эти правила из base. Если хочешь такой же уровень строгости для Nest API — вынеси их в отдельный конфиг (например `packages/eslint-config/nest.js`) и подключай только в `apps/api/eslint.config.mjs`, с нужными плагинами (@nestjs-eslint и т.д.) в api или в shared config.

---

## 4. Правило `complexity`

Сейчас: `"complexity": "error"`. Дефолтный лимит в ESLint — 20. Для «максимально строгого» стиля часто ставят ниже, например 10–15.

**Рекомендация:** задать явный порог, например:  
`"complexity": ["error", { "max": 15 }]`  
(или 10, по твоему вкусу). Так строгость будет предсказуемой и одинаковой для всех.

---

## 5. Prettier: плагины в `.prettierrc` не установлены в корне

В `.prettierrc` указаны плагины:

- `@ianvs/prettier-plugin-sort-imports`
- `prettier-plugin-tailwindcss`

В корневом `package.json` есть только `"prettier": "^3.7.4"`. Этих плагинов в workspace root нет, поэтому при запуске `pnpm format` (или `prettier --write "**/*.{ts,tsx,md}"`) Prettier может ругаться или не применять сортировку импортов и Tailwind.

**Что сделать:** добавить в корневой `package.json` в `devDependencies`:

- `@ianvs/prettier-plugin-sort-imports`
- `prettier-plugin-tailwindcss`

и переустановить зависимости. Либо убрать плагины из `.prettierrc`, если пока не нужны.

---

## 6. Prettier и единый стиль

Цель — «приблизиться к максимально строгому варианту как в Java». Сейчас:

- В base включено `"prettier/prettier": "error"` — хорошо: форматирование завязано на Prettier и будет падать при расхождениях.
- В `apps/api` свой `.prettierrc` с `endOfLine: "auto"`, а в корневом `.prettierrc` — `"endOfLine": "lf"`. Для единообразия лучше один источник правды (корневой `.prettierrc`) и при необходимости переопределения только в api через `overrides` по путям, чтобы не было расхождений между приложениями.

Рекомендация: оставить общий стиль в корне, в api при необходимости точечно переопределять только то, что реально нужно (и задокументировать причину).

---

## 7. Файлы не в коммите

- `.prettierrc` — не в git (untracked). Чтобы настройки Prettier применялись у всех и в CI, добавь его в репозиторий.
- Текущие изменения в `packages/eslint-config/base.js` тоже должны быть закоммичены в этой ветке, иначе в main попадёт конфиг без твоих правил.

---

## 8. Один стиль кавычек в конфиге

В base.js местами используются одинарные кавычки, местами двойные (`'error'` vs `"error"`). При включённом `quotes: ['error', 'single']` сам конфиг лучше привести к одному стилю (например везде `'single'`) для консистентности.

---

## Итог

| Приоритет | Что сделать |
|-----------|-------------|
| **Обязательно** | Исправить опечатки (comma-dangle, import/no-cycle). Убрать из base Nest/Angular-правила (п. 3) или перенести их в отдельный nest-конфиг с плагинами. По каждому правилу из п. 2 либо добавить плагин в eslint-config, либо убрать правило. Добавить в корень зависимости для Prettier-плагинов из .prettierrc (или убрать плагины из .prettierrc). Закоммитить .prettierrc и актуальный base.js. |
| **Желательно** | Задать явный порог для `complexity`. Унифицировать endOfLine и источник Prettier-настроек (корень vs api). Привести кавычки в base.js к одному стилю. |

После этого `pnpm lint` и `pnpm format` должны стабильно проходить по всему монорепо (admin, web, packages/ui, при необходимости — api с отдельным конфигом для Nest).
