import { NextResponse } from 'next/server';

import type { SonnikArticle } from '@/lib/article-types';
import {
  buildSonnikUserPrompt,
  deepseekSonnikJson,
  parseSonnikArticleFromAi,
} from '@/lib/deepseek-sonnik';

export const runtime = 'nodejs';

/** Генерация черновика через DeepSeek */
export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 12_000) {
      return NextResponse.json({ ok: false, error: 'Too large' }, { status: 413 });
    }
    let body: { theme?: string; suggestedSlug?: string };
    try {
      body = JSON.parse(raw) as { theme?: string; suggestedSlug?: string };
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
    }
    const theme = typeof body.theme === 'string' ? body.theme.trim() : '';
    if (theme.length < 2 || theme.length > 600) {
      return NextResponse.json(
        { ok: false, error: 'Укажите тему 2–600 символов' },
        { status: 400 },
      );
    }
    const suggestedSlug =
      typeof body.suggestedSlug === 'string'
        ? body.suggestedSlug.trim()
        : undefined;
    const publishDateFallback = new Date().toISOString().slice(0, 10);
    const prompt = buildSonnikUserPrompt(theme, suggestedSlug);
    const aiText = await deepseekSonnikJson(prompt);
    const draft = parseSonnikArticleFromAi(aiText, publishDateFallback);
    if (!draft || !draft.slug || !draft.title) {
      return NextResponse.json(
        { ok: false, error: 'Модель вернула неподходящий JSON' },
        { status: 502 },
      );
    }
    const article = draft as Partial<SonnikArticle>;
    return NextResponse.json({ ok: true, draft: article });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Ошибка генерации';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
