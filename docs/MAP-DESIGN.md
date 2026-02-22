# Карта — дизайн и схема

Визуальная и структурная схема карты: слои, данные, координаты, сценарии.

---

## 1. Экран карты (макет)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  [2D] [3D]    Layers: [✓ Stars] [✓ Grid] [✓ Markers]         [🔍] [⚙]     │  ← Тулбар
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ·              ·         ★                                              │
│  ·   ·   ★       ·    ·         ·                                          │
│        ·     ·   ·         ·        ·      ← Слой 1: звёзды + сетка (canvas)│
│  ·       [🛸]      ·    ·   ·                                               │
│    ·   ·     ·         [🪐]    ·     ·    ← Слой 2: маркеры (DOM или canvas)│
│  ·     ·    ·   ·   ·      [🔭]   ·                                         │
│    ·        ·    ·   ·         ·                                            │
│                                                                             │
│  ◀────────────────── pan (drag) ──────────────────▶                        │
│                                                                             │
│  Клик по маркеру → карточка / боковая панель                                │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Слои (z-index и ответственность)

```mermaid
flowchart TB
    subgraph Z1["z: 0 — Слой 1: Фон"]
        A[Canvas: звёзды]
        B[Сетка]
        C[Градиент]
    end
    subgraph Z2["z: 1 — Слой 2: Контент карты"]
        D[Маркеры]
        E[Иконки + подписи]
    end
    subgraph Z3["z: 10 — Слой 3: UI"]
        F[Тулбар]
        G[Карточка выбранного]
        H[Панели]
    end

    Z1 --> Z2
    Z2 --> Z3
```

| Слой | Содержимое | Рендер |
|------|------------|--------|
| **1** | Звёзды, сетка, градиент | Canvas |
| **2** | Маркеры (точки, иконки, label) | DOM или второй Canvas |
| **3** | Тулбар, tooltip, панели | DOM |

---

## 3. Модель данных (сущности)

```mermaid
erDiagram
    MapViewState ||--o| Pan : has
    MapViewState ||--o| Zoom : has
    MapViewState ||--o| MapLayers : has
    MapLayers ||--o| starsVisible : boolean
    MapLayers ||--o| gridVisible : boolean
    MapLayers ||--o| markersVisible : boolean

    MapMarker ||--o| id : string
    MapMarker ||--o| worldX : number
    MapMarker ||--o| worldY : number
    MapMarker ||--o| label : string
    MapMarker ||--o| type : MarkerType
    MapMarker ||--o| description : string

    MapViewState ||--o{ MapMarker : displays
    SelectedMarker ||--o| MapMarker : references

    MapViewState {
        number panX
        number panY
        number zoom
    }

    MapMarker {
        string id
        number worldX
        number worldY
        string label
        MarkerType type
        string description
    }

    MarkerType {
        "ship"
        "station"
        "planet"
        "custom"
    }
```

---

## 4. Координаты: мир ↔ экран

```mermaid
flowchart LR
    subgraph World["Мировые координаты"]
        W["(worldX, worldY)"]
    end
    subgraph View["Состояние вида"]
        P["panX, panY"]
        Z["zoom"]
    end
    subgraph Screen["Экран (px)"]
        S["(screenX, screenY)"]
    end

    W --> T["worldToScreen()"]
    P --> T
    Z --> T
    T --> S

    S --> U["screenToWorld()"]
    P --> U
    Z --> U
    U --> W
```

**Формула (2D, zoom = 1):**

- `screenX = worldX - panX`
- `screenY = worldY - panY`
- `worldX = screenX + panX`
- `worldY = screenY + panY`

При zoom: домножать на `scale` и учитывать центр вида.

---

## 5. Поток данных и взаимодействия

```mermaid
flowchart TB
    subgraph User["Пользователь"]
        U1[Drag карты]
        U2[Клик по маркеру]
        U3[Переключение слоёв]
    end

    subgraph State["Состояние"]
        S1["panX, panY"]
        S2["selectedMarkerId"]
        S3["layers: stars, grid, markers"]
    end

    subgraph Render["Рендер"]
        R1[CanvasMap]
        R2[MarkersLayer]
        R3[Toolbar]
        R4[MarkerCard]
    end

    U1 --> S1
    U2 --> S2
    U3 --> S3

    S1 --> R1
    S1 --> R2
    S2 --> R4
    S3 --> R1
    S3 --> R2
    S3 --> R3
```

---

## 6. Сценарий: выбор маркера

```mermaid
sequenceDiagram
    participant User
    participant MarkersLayer
    participant State
    participant MarkerCard

    User->>MarkersLayer: клик по маркеру
    MarkersLayer->>State: setSelectedMarkerId(id)
    State->>MarkersLayer: re-render (highlight)
    State->>MarkerCard: show(marker)
    MarkerCard->>User: карточка с деталями
    User->>MarkerCard: закрыть / клик мимо
    MarkerCard->>State: setSelectedMarkerId(null)
```

---

## 7. Порядок реализации

```mermaid
flowchart LR
    A["1. Типы:\nMapMarker, MapViewState,\nMapLayers"] --> B["2. worldToScreen\n/ screenToWorld"]
    B --> C["3. Слой маркеров\n(DOM поверх canvas)"]
    C --> D["4. Клик + selectedMarkerId\n+ карточка"]
    D --> E["5. Тулбар слоёв\n(вкл/выкл звёзды, сетка, маркеры)"]
```

| Шаг | Что сделать |
|-----|-------------|
| 1 | Типы: `MapMarker`, `MarkerType`, `MapViewState`, `MapLayers`. Мок-массив маркеров. |
| 2 | Функции пересчёта координат с учётом pan (и zoom при появлении). |
| 3 | Контейнер поверх canvas, маркеры как DOM-элементы с позицией из `worldToScreen`. |
| 4 | State выбранного маркера, клик по маркеру, отображение карточки/панели. |
| 5 | Чекбоксы/переключатели слоёв в тулбаре, проброс в CanvasMap и слой маркеров. |

---

## 8. Структура компонентов (дерево)

```
MapView
├── MapModeProvider
│   ├── ToggleMapMode (2D/3D)
│   └── MapModeResolver
│       └── CanvasMap (звёзды, сетка)
├── MarkersLayer          ← поверх canvas, overflow: hidden
│   └── MapMarkerItem[]   (position from worldToScreen)
├── MapToolbar            ← слои, поиск, настройки
└── MarkerCard | SidePanel   ← при selectedMarkerId
```

---

Готово: одна схема в одном MD — макет экрана, слои, модель данных, координаты, поток и порядок реализации.
