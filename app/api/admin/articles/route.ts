import { NextResponse } from 'next/server';

import type { SonnikArticle } from '@/lib/article-types';
import { mergeArticleDraft } from '@/lib/article-merge';
import { isValidSlug, loadArticles, saveArticles } from '@/lib/articles-store';

export const runtime = 'nodejs';

const MAX_BODY = 400_000;

export async function GET() {
  try {
    const articles = await loadArticles();
    const safe = articles.map((a) => ({
      slug: a.slug,
      title: a.title,
      dateModified: a.dateModified,
      keywordsCount: a.keywords?.length ?? 0,
    }));
    return NextResponse.json({ ok: true, articles: safe });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Ошибка загрузки';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) {
      return NextResponse.json({ ok: false, error: 'Too large' }, { status: 413 });
    }
    const patch = JSON.parse(raw) as Partial<SonnikArticle>;
    const slugIn = typeof patch.slug === 'string' ? patch.slug.trim() : '';
    if (!isValidSlug(slugIn)) {
      return NextResponse.json(
        { ok: false, error: 'Нужен корректный slug' },
        { status: 400 },
      );
    }
    const articles = await loadArticles();
    if (articles.some((a) => a.slug === slugIn)) {
      return NextResponse.json(
        { ok: false, error: 'Статья с таким slug уже есть' },
        { status: 409 },
      );
    }
    const merged = mergeArticleDraft(undefined, patch, slugIn);
    if ('error' in merged) {
      return NextResponse.json(
        { ok: false, error: merged.error },
        { status: 400 },
      );
    }
    articles.push(merged);
    await saveArticles(articles);
    return NextResponse.json({ ok: true, article: merged });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Ошибка создания';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
