import type { SonnikArticle } from '@/lib/article-types';

/**
 * Дополняет ручные `article.keywords` типовыми поисковыми формулировками (рунет, сонники).
 * Используется в meta keywords и Schema.org Article.keywords.
 */
const MAX = 28;

const STOP_THEMES = new Set(
  [
    'сон',
    'сны',
    'снов',
    'сонник',
    'сонники',
    'толкование',
    'толкования',
    'смысл',
    'значение',
    'онлайн',
    'видеть',
    'приснилось',
  ].map((s) => s.toLowerCase()),
);

function norm(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/ё/g, 'е');
}

function pushUnique(out: string[], seen: Set<string>, raw: string) {
  const k = norm(raw);
  if (k.length < 2 || seen.has(k)) return;
  seen.add(k);
  out.push(k);
}

/** Первый осмысленный образ: не общие слова типа «сон». */
export function primaryTheme(article: SonnikArticle): string {
  for (const k of article.keywords) {
    const t = norm(k);
    if (t.length > 1 && !STOP_THEMES.has(t)) return t;
  }
  return norm(article.slug.replace(/-/g, ' '));
}

/** Доп. тематические слова (не стоп-слова), до 3 шт. */
function meaningfulThemes(article: SonnikArticle, primary: string): string[] {
  const uniq: string[] = [];
  const seen = new Set<string>();
  seen.add(primary);
  for (const k of article.keywords) {
    const t = norm(k);
    if (t.length < 2 || STOP_THEMES.has(t) || seen.has(t)) continue;
    seen.add(t);
    uniq.push(t);
    if (uniq.length >= 3) break;
  }
  return uniq.length ? uniq : [primary];
}

export function buildSearchKeywords(article: SonnikArticle): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const primary = primaryTheme(article);

  for (const k of article.keywords) {
    pushUnique(out, seen, k);
  }
  pushUnique(out, seen, primary);
  pushUnique(out, seen, article.slug.replace(/-/g, ' '));

  for (const t of meaningfulThemes(article, primary)) {
    [
      `к чему снится ${t}`,
      `сонник ${t}`,
      `${t} во сне`,
      `приснилось ${t}`,
      `приснился ${t}`,
      `приснилась ${t}`,
      `толкование сна ${t}`,
      `что означает сон ${t}`,
      `значение сна ${t}`,
    ].forEach((phrase) => pushUnique(out, seen, phrase));
  }

  pushUnique(out, seen, article.title.replace(/\s+/g, ' '));

  ['сонник', 'толкование снов'].forEach((g) => pushUnique(out, seen, g));

  return out.slice(0, MAX);
}
