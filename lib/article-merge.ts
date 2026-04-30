import type { SonnikArticle } from './article-types';

import { isValidSlug } from './articles-store';

/** Нормализация перед сохранением */
export function mergeArticleDraft(
  existing: SonnikArticle | undefined,
  patch: Partial<SonnikArticle>,
  slugFallback: string,
): SonnikArticle | { error: string } {
  const slug = (patch.slug ?? existing?.slug ?? slugFallback).trim();
  if (!isValidSlug(slug)) {
    return { error: 'Неверный slug: только латиница, цифры и дефис.' };
  }

  const today = new Date().toISOString().slice(0, 10);
  const base: SonnikArticle = existing ?? {
    slug,
    title: '',
    description: '',
    lead: '',
    miller: '',
    freud: '',
    folk: '',
    conclusion: '',
    keywords: [],
    datePublished: today,
    dateModified: today,
  };

  const mergedKeywords =
    normalizeKeywords(patch.keywords ?? base.keywords) ??
    [];

  const next: SonnikArticle = {
    ...base,
    slug,
    title: (patch.title ?? base.title).trim(),
    description: (patch.description ?? base.description).trim(),
    lead: (patch.lead ?? base.lead).trim(),
    miller: (patch.miller ?? base.miller).trim(),
    freud: (patch.freud ?? base.freud).trim(),
    folk: (patch.folk ?? base.folk).trim(),
    conclusion: (patch.conclusion ?? base.conclusion).trim(),
    keywords: mergedKeywords,
    datePublished:
      isDate(patch.datePublished) && patch.datePublished
        ? patch.datePublished
        : base.datePublished || today,
    dateModified:
      isDate(patch.dateModified) && patch.dateModified
        ? patch.dateModified
        : today,
  };

  if (!next.title) return { error: 'Нужен заголовок title.' };
  if (!next.description) return { error: 'Нужно краткое описание description.' };
  if (!next.lead) return { error: 'Нужен lead.' };
  if (next.keywords.length === 0) {
    return { error: 'Нужен хотя бы один ключевик.' };
  }

  const maxChunk = 20_000;
  for (const field of [
    'title',
    'description',
    'lead',
    'miller',
    'freud',
    'folk',
    'conclusion',
  ] as const) {
    if (next[field].length > maxChunk) {
      return { error: `Поле ${field} слишком длинное.` };
    }
  }

  return next;
}

function isDate(s: unknown): s is string {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function normalizeKeywords(kw: unknown): string[] {
  if (!Array.isArray(kw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of kw) {
    if (typeof x !== 'string') continue;
    const k = x.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!k || k.length > 100 || seen.has(k)) continue;
    seen.add(k);
    out.push(k);
    if (out.length > 50) break;
  }
  return out;
}
