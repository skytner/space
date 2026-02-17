# Ревью: `feature/map` #2

**Scope:** Map settings (popover, слои, режим 2D/3D), api-contracts (CelestialType), ui (Popover, IconButton, Checkbox), MapModeProvider controlled.

---

## Что хорошо

- Настройки карты вынесены в единый state `MapSettings` (mode + objects по слоям), контекст `MapModeProvider` управляется извне — без дублирования состояния.
- Константы и переводы в `constants/settings`, `helpers/translations`; типы в `types/settings` с опорой на `@repo/api-contracts`.
- Закрытие попапа по клику снаружи и по `onTransitionEnd` для анимации выхода.
- `IconButton` и `Checkbox` в ui — понятный API, `forwardRef` где нужно.
- `Popover` в ui с placement, click-outside и aria — можно переиспользовать в других местах.

---

## Важно

### 1. IconButton не пробрасывает `aria-expanded` и `aria-haspopup`

**Файлы:** `packages/ui/src/IconButton.tsx`, `apps/web/modules/map/components/MapSettingsButton.tsx`.

В `MapSettingsButton` в `IconButton` передаются `aria-expanded={open}` и `aria-haspopup="dialog"`, но в `IconButtonProps` этих полей нет, и на внутренний `<button>` они не попадают. Для попапа/диалога эти атрибуты нужны для доступности.

**Что сделать:** в `IconButton` добавить в тип опциональные `aria-expanded?: boolean` и `aria-haspopup?: "dialog" | "menu" | "listbox" | "tree" | "grid"` (или `string`) и пробросить их на `<button>`. Альтернатива — принять `React.ButtonHTMLAttributes<...>` через rest и пробросить остальное на кнопку.

---

### 2. Опечатка в api-contracts: `Enitity` → `Entity`

**Файлы:** `packages/api-contracts/src/types/entity.ts`, `packages/api-contracts/src/types/celestials.ts`.

Интерфейс назван `Enitity` (пропущена буква). Используется в `celestials.ts` в `Celestial extends Enitity`.

**Что сделать:** переименовать `Enitity` в `Entity` в обоих файлах (и при необходимости во всём репо по поиску).

---

## Рекомендации

### 3. Единый попап: ui Popover vs своя логика в MapSettings

**Файл:** `apps/web/modules/map/components/MapSettings.tsx`.

Сейчас попап настроек реализован своим состоянием (`open`, `visible`), своим click-outside и разметкой. В `packages/ui` уже есть `Popover` с `open`/`onOpenChange`, триггером и click-outside.

**Рекомендация:** для единообразия и переиспользования можно перевести Map settings на `<Popover trigger={<MapSettingsButton ... />} open={open} onOpenChange={setOpen}>...</Popover>`. Не обязательно в этом PR — можно вынести в отдельную задачу.

---

### 4. Чекбоксы слоёв: нативный input vs ui Checkbox

**Файл:** `apps/web/modules/map/components/MapSettingsPopover.tsx`.

Список слоёв рендерится через нативный `<input type="checkbox">` и `<label>`. В ui есть компонент `Checkbox` с `checked`/`onCheckedChange` и стилями.

**Опционально:** заменить на `<Checkbox checked={...} onCheckedChange={...}>{OBJECT_LABELS[layer]}</Checkbox>` для единого стиля и поведения с остальным приложением.

---

## Мелочи

- **MapSettingsPopover:** `role="dialog"` и `aria-label` на контейнере попапа — ок. У триггера после правки п.1 появятся `aria-expanded` и `aria-haspopup`.
- **DEFAULT_MAP_SETTINGS:** часть слоёв (galaxy, comet, asteroid, pulsar, blackHole) по умолчанию `false` — ок, если так задумано.
- **api-contracts:** экспорт через `src/types` и `src/index.ts` — структура понятная.

---

## Итог

| Приоритет | Действие |
|-----------|----------|
| **Нужно** | П.1 — проброс `aria-expanded`/`aria-haspopup` в IconButton; п.2 — переименовать Enitity → Entity. |
| **По желанию** | П.3 — перевести Map settings на ui Popover; п.4 — использовать ui Checkbox в списке слоёв. |

После правок п.1 и п.2 можно мержить.
