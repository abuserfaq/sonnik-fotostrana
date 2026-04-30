import { NextResponse } from 'next/server';

import type { SonnikArticle } from '@/lib/article-types';
import { mergeArticleDraft } from '@/lib/article-merge';
import { loadArticles, saveArticles } from '@/lib/articles-store';

export const runtime = 'nodejs';

const MAX_BODY = 400_000;

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const articles = await loadArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) {
    return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, article });
}

export async function PUT(request: Request, { params }: Props) {
  try {
    const { slug } = await params;
    const articles = await loadArticles();
    const existing = articles.find((a) => a.slug === slug);
    if (!existing) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }
    const raw = await request.text();
    if (raw.length > MAX_BODY) {
      return NextResponse.json({ ok: false, error: 'Too large' }, { status: 413 });
    }
    const patch = JSON.parse(raw) as Partial<SonnikArticle>;
    const merged = mergeArticleDraft(existing, patch, slug);
    if ('error' in merged) {
      return NextResponse.json(
        { ok: false, error: merged.error },
        { status: 400 },
      );
    }
    const remaining = articles.filter((a) => a.slug !== slug);
    if (remaining.some((a) => a.slug === merged.slug)) {
      return NextResponse.json(
        { ok: false, error: 'Slug уже занят' },
        { status: 409 },
      );
    }
    remaining.push(merged);
    await saveArticles(remaining);
    return NextResponse.json({ ok: true, article: merged });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Ошибка сохранения';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  try {
    const { slug } = await params;
    const articles = await loadArticles();
    if (articles.length <= 1) {
      return NextResponse.json(
        { ok: false, error: 'Нельзя удалить единственную статью' },
        { status: 400 },
      );
    }
    const next = articles.filter((a) => a.slug !== slug);
    if (next.length === articles.length) {
      return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    }
    await saveArticles(next);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Ошибка удаления';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
