# Code review: `feature/map` #1

**Ветка:** `feature/map`  
**Scope:** Новая главная (Home + карточки), страница /map с 2D-картой звёзд, модули home/map, правки в packages/ui.

---

## Критично (баг)

### 1. HomeLinkCard — ссылка не из пропсов // done

**Файл:** `apps/web/modules/home/components/HomeLinkCard.tsx`

Компонент принимает проп `link`, но в разметке используется жёстко заданный `href="/map"`. При добавлении новых карточек с разными `link` все ведут на `/map`.

**Исправление:** заменить на `href={link}`:

```tsx
<Link href={link} className={styles.cardAction}>
```

---

## Важно

### 2. Дублирование RNG и генерации звёзд // done

**Файлы:**  
`apps/web/modules/home/components/AnimatedSpaceBaыckground.tsx` и  
`apps/web/modules/map/components/CanvasMap.tsx`

Функция `mulberry32` и логика генерации звёзд (разные по контракту: одна с twinkle/phase/speed, другая с layer) скопированы. При изменении семантики или багов придётся править в двух местах.

**Рекомендация:** вынести общий RNG (и при желании базовую генерацию точек) в общий модуль, например `apps/web/modules/shared/utils/random.ts` или `canvasUtils.ts`, и импортировать в оба компонента. Конкретные поля звёзд (phase/speed vs layer) оставить в каждом компоненте.

---

### 3. CSS: лишние стили и дублирование  // done

**Файл:** `apps/web/modules/home/styles/HomeLinkCard.module.css`

В файле стилей карточки описаны и `.card`, и `.cardGrid`. Сетка используется только в `HomeLinkCardGrid`, который подключает `HomeLinkCardGrid.module.css` со своим `.cardGrid`. Получается два определения `.cardGrid` и неиспользуемые правила в `HomeLinkCard.module.css`.

**Рекомендация:** удалить из `HomeLinkCard.module.css` блок `.cardGrid` и связанные с ним медиазапросы; оставить только стили самой карточки (`.card`, `.cardHeader`, `.cardIcon` и т.д.).

---

### 4. Состояние режима карты не используется // done

**Файлы:**  
`apps/web/modules/map/components/ToggleMapMode.tsx`,  
`apps/web/modules/map/view/MapView.tsx`

`ToggleMapMode` хранит `mode` (2d/3d) в `useState`, но это значение никуда не передаётся: `MapView` рендерит только `CanvasMap` без пропа режима. 3D пока отключён — это ок для первого шага, но переключатель не влияет на отображение.

**Рекомендация:** когда будете делать 2D/3D переключение — поднять `mode` в `MapView` (или контекст) и передавать в `CanvasMap`; пока можно оставить как есть и добавить TODO, либо не рендерить переключатель до появления логики.

---

## Рекомендации (стиль, качество)

### 5. Newline в конце файлов // fix later

Во многих новых/изменённых файлах нет завершающего перевода строки (в т.ч. `app/map/page.module.css`, `MapView.tsx`, `ToggleMapMode.tsx`, `map/index.ts`, `modules/index.ts`, `HomeView.tsx`, `HomeLinkCard.tsx`, `HomeLinkCardGrid.tsx`, `cards.ts`, `card.ts`, несколько CSS-модулей). Обычно в проектах требуют newline at EOF.

**Действие:** добавить одну пустую строку в конец каждого такого файла (или включить правило в Prettier/ESLint).

---

### 6. Тип `HomeLinkCardProps`: запятые и опциональность // done

**Файл:** `apps/web/modules/home/types/card.ts`

- После `strIcon?: string` и `description?: string` нет запятых — для многострочного типа лучше ставить запятые для единообразия и меньшего diff при добавлении полей.
- `linkName` и `description` помечены как опциональные; в `cards.ts` они всегда заданы. Если карточка без них не предполагается, можно сделать поля обязательными или оставить опциональными и в компоненте не рендерить блок, если значения нет (сейчас `description` и `linkName` рендерятся без проверки — при `undefined` будет пустой текст).

**Действие:** добавить запятые; при желании — явную проверку/fallback для `linkName` и `description` в разметке.

---

### 7. Карта: только мышь, нет тача //done

**Файл:** `apps/web/modules/map/components/CanvasMap.tsx`

Pan/drag реализован через `mousedown` / `mousemove` / `mouseup`. На тач-устройствах это не сработает.

**Рекомендация:** позже добавить обработку `touchstart` / `touchmove` / `touchend` (с учётом `preventDefault` при необходимости) или единый слой через Pointer Events, чтобы карта была удобна на мобильных.

---

### 8. Доступность (a11y) //done

- **CanvasMap:** `role="application"` и `aria-label="Карта"` заданы — хорошо.
- **ToggleButton (packages/ui):** кнопки переключателя имеют `role="tab"`. Обычно `tab` используется в связке с `tablist` и `tabpanel`; для группы переключателей часто используют `role="group"` у контейнера и кнопки без `tab`, либо `menuitemradio`. Стоит свериться с макетом/дизайном и при необходимости скорректировать роль и разметку.

---

## Мелочи

- **MapView.tsx:** импорт стилей — `'../styles/MapView.module.css'` (одинарные кавычки); в проекте в целом встречаются и двойные. Имеет смысл унифицировать (например, по правилу ESLint `quotes`).
- **ToggleMapMode.tsx:** импорт `ToggleButton from "@repo/ui/ToggleButton"` — лишний пробел перед `from`; пакет экспортирует `./*` → `./src/*.tsx`, путь корректен.

---

## Итог

| Приоритет | Что сделать |
|-----------|-------------|
| **Обязательно** | П.1 — использовать `href={link}` в `HomeLinkCard`. |
| **Желательно** | П.2 — вынести общий RNG/звёзды в shared-модуль; п.3 — убрать лишний `.cardGrid` из `HomeLinkCard.module.css`; п.5 — добавить newline at EOF в затронутые файлы. |
| **Потом** | П.4 — связать mode с картой или оставить TODO; п.6 — запятые в типах и при необходимости проверки в карточке; п.7 — поддержка тача/pointer для карты; п.8 — уточнить роли для ToggleButton. |

После исправления п.1 ветку можно мержить; остальное — по возможностям в этом же PR или отдельными задачами.
