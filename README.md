# Сонник (Next.js / Vercel)

Микросайт сонника для субдомена: SSG-страницы, sitemap, Schema.org, CTA на Фотострану.

## Локально

```bash
npm install
npm run dev
```

Сервер по умолчанию: порт `3010` (см. `package.json`).

## Переменные окружения

Скопируйте `.env.example` в `.env.local` и подставьте продакшен-URL.

## Деплой на Vercel

- **Root Directory**: корень этого репозитория (не подпапка).
- Задайте те же переменные, что в `.env.example`, в разделе Environment Variables проекта.

## Контент

Статьи в `content/symbols.json`. Замените/дополните массив статей после батч-генерации.
