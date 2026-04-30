'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { SonnikArticle } from '@/lib/content';
import { buildSearchKeywords } from '@/lib/keywords';

type Props = { articles: SonnikArticle[] };

export function SymbolSearch({ articles }: Props) {
  const [q, setQ] = useState('');
  const normalized = q.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!normalized) return articles;
    return articles.filter((a) => {
      const hay = `${a.title} ${buildSearchKeywords(a).join(' ')}`.toLowerCase();
      return hay.includes(normalized);
    });
  }, [articles, normalized]);

  return (
    <div className="symbol-search">
      <label className="symbol-search-label" htmlFor="symbol-q">
        Найти символ
      </label>
      <input
        id="symbol-q"
        className="symbol-search-input"
        type="search"
        placeholder="Например: вода, змея, бывший"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
      />
      <p className="symbol-search-meta" aria-live="polite">
        {filtered.length === articles.length
          ? `Всего: ${articles.length}`
          : `Найдено: ${filtered.length} из ${articles.length}`}
      </p>
      <ul className="symbol-rows">
        {filtered.map((a) => (
          <li key={a.slug}>
            <Link href={`/sonnik/${a.slug}`} className="symbol-row-link">
              <span className="symbol-row-title">{a.title}</span>
              <span className="symbol-row-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {filtered.length === 0 ? (
        <p className="symbol-search-empty">Ничего не найдено — смените запрос.</p>
      ) : null}
    </div>
  );
}
