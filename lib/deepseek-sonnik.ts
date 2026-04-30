/**
 * Серверная генерация JSON-статьи сонника через DeepSeek Chat API.
 */

import type { SonnikArticle } from './article-types';

const DEFAULT_BASE = 'https://api.deepseek.com';

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).trim()}…`;
}

/** Системный промпт: только JSON без markdown. */
export const SONNIK_JSON_SYSTEM_PROMPT =
  'Отвечай ТОЛЬКО валидным JSON-объектом без текста до или после и без блоков Markdown. Никаких медицинских диагнозов и суеверных предсказаний дат. Тон спокойный, для взрослой русскоязычной аудитории.';

export function buildSonnikUserPrompt(theme: string, slugHint?: string): string {
  const themeSafe = truncate(theme.trim(), 400);
  const slugNote = slugHint
    ? `\nЖелаемый латинский slug (если уместно, иначе придумай один): "${truncate(slugHint.trim(), 80)}"`
    : '';

  return `Задача: описать символ или тему для сонника сайта Фотостраны — уникально, без копирования классических сонников дословно.

ТЕМА ИЛИ ОБРАЗ: "${themeSafe}"${slugNote}

ВАЖНО:
- Придумай уникальный латинский slug: только a-z 0-9 и дефис, длиной не более 60 символов.
- Общий объём текстов порядка 600–950 слов на все поля (не формальной подсчёта, главное — содержание).
- title — привлекательный H1 в стиле: «К чему снится …» / «Приснился …» и т.п.
- description — 1–2 предложения для meta description.
- lead — 2–4 предложения введения.
- miller, freud, folk — по 2–5 предложений; не путай школы: Миллер — бытовой классический сонник, Фрейд — психоаналитический подход, folk — народные приметы и устоявшиеся фразы (без «скоро умрёте» и токсичных утверждений).
- conclusion — практичный вывод без мистики как факта.
- keywords — массив 8–20 коротких русских фраз/слов для SEO (ключевики и синонимы поиска), без дублей, без общих только «сон» если можно конкретнее.

Верни СТРОГО объект с полями:
slug (string),
title (string),
description (string),
lead (string),
miller (string),
freud (string),
folk (string),
conclusion (string),
keywords (array of strings).`;
}

function extractJsonObject(raw: string): string {
  let t = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/im.exec(t);
  if (fence) t = fence[1].trim();
  const i = t.indexOf('{');
  const j = t.lastIndexOf('}');
  if (i >= 0 && j > i) return t.slice(i, j + 1);
  return t;
}

function isIsoDate(d: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(d);
}

export function parseSonnikArticleFromAi(
  raw: string,
  publishDateFallback: string,
): Partial<SonnikArticle> | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJsonObject(raw));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const o = parsed as Record<string, unknown>;
  const kw = Array.isArray(o.keywords)
    ? (o.keywords as unknown[])
        .map((x) => (typeof x === 'string' ? x.trim() : ''))
        .filter(Boolean)
    : [];

  const out: Partial<SonnikArticle> = {
    slug: typeof o.slug === 'string' ? o.slug.trim() : undefined,
    title: typeof o.title === 'string' ? o.title.trim() : undefined,
    description:
      typeof o.description === 'string' ? o.description.trim() : undefined,
    lead: typeof o.lead === 'string' ? o.lead.trim() : undefined,
    miller: typeof o.miller === 'string' ? o.miller.trim() : undefined,
    freud: typeof o.freud === 'string' ? o.freud.trim() : undefined,
    folk: typeof o.folk === 'string' ? o.folk.trim() : undefined,
    conclusion:
      typeof o.conclusion === 'string' ? o.conclusion.trim() : undefined,
    keywords: kw,
    datePublished:
      typeof o.datePublished === 'string' && isIsoDate(o.datePublished)
        ? o.datePublished
        : publishDateFallback,
    dateModified:
      typeof o.dateModified === 'string' && isIsoDate(o.dateModified)
        ? o.dateModified
        : publishDateFallback,
  };
  return out;
}

export async function deepseekSonnikJson(prompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY не задан');
  }
  const base = (process.env.DEEPSEEK_BASE_URL ?? DEFAULT_BASE).replace(
    /\/+$/,
    '',
  );
  const model =
    process.env.DEEPSEEK_MODEL?.trim()?.replace(/\s+/g, '') || 'deepseek-chat';

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SONNIK_JSON_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      max_tokens: 4096,
      temperature: 0.55,
    }),
  });

  if (!res.ok) {
    const errText = truncate(await res.text(), 600);
    throw new Error(`DeepSeek HTTP ${res.status}: ${errText}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string | null } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('DeepSeek: пустой ответ модели');
  }
  return content.trim();
}
