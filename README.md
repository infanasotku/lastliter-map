# LastLiter map demo

Минимальное Vue 3 + TypeScript приложение с Leaflet, подложкой Yandex Tiles API
и двумя захардкоженными станциями.

## Запуск

```sh
npm install
npm run dev
```

Production-сборка:

```sh
npm run build
```

Runtime-конфигурация загружается из `public/config.js` до основного приложения,
аналогично `konv/front`. Ключ Tiles API остаётся клиентским и доступен браузеру.

## Структура

```text
src/
├── assets/scss/            # глобальные стили, переменные и mixins
├── components/             # Vue-компоненты
├── config/                 # чтение runtime-конфигурации
├── container.ts            # composition root / сборка зависимостей
├── domain/                 # доменная модель станции
├── features/stations/
│   ├── controller.ts       # модель экрана
│   ├── ports.ts            # интерфейс repository
│   ├── service.ts          # сценарий и преобразование данных
│   └── types.ts            # presentation-модель
├── infra/
│   ├── map/                # Leaflet-адаптер
│   └── stations/           # статический repository демо-данных
└── App.vue                 # полноэкранная карта и UI поверх неё
```

`api/sources/recent_comments.md` содержит комментарии только для станции
`474954443` и не содержит координат. Для неё используются последние доступные
координаты соответствующего OSM-объекта. Вторая станция и её координаты взяты из
`api/sources/nearby.md`.

Для совместимости с Leaflet у Yandex Tiles API явно запрашивается проекция
`web_mercator`. Обязательный официальный логотип Яндекса расположен поверх карты
и ведёт на Яндекс Карты. Стандартный attribution-control Leaflet отключён.
