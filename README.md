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

- Прод-домен: **`https://sonnik.fotostrana.ru`** (в Vercel → Domains: привязать субдомен, DNS — CNAME на Vercel).
- **`NEXT_PUBLIC_SITE_URL`** в Environment Variables должен быть `https://sonnik.fotostrana.ru`.

- **Root Directory**: корень этого репозитория (не подпапка).
- Задайте те же переменные, что в `.env.example`, в разделе Environment Variables проекта.

## Ключевые слова (SEO)

У каждой статьи поле `keywords` в `content/symbols.json` — это **ручной** слой (точные формулировки и хвосты).

Автоматически к ним добавляются типовые запросы (`к чему снится …`, `сонник …`, `приснилось …` и т.д.) в **`lib/keywords.ts`** — их попадают в **meta keywords** и в **Schema.org `Article.keywords`**, плюс улучшают **поиск по каталогу** на `/sonnik`.

Для массовой генерации в JSON достаточно 5–15 смысловых фраз из Wordstat/подсказок; остальное покроет `buildSearchKeywords`.
