'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { SonnikArticle } from '@/lib/article-types';

import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton';

import '@/app/admin/admin.css';

const MAX_LINES = 35;
const BETWEEN_MS = 450;

type RowResult =
  | { line: string; status: 'created'; slug: string }
  | { line: string; status: 'skipped'; slug: string }
  | { line: string; status: 'error'; message: string };

function parseLines(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const s = raw.trim();
    if (s.length < 2 || s.length > 600) continue;
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= MAX_LINES) break;
  }
  return out;
}

function draftToPayload(
  d: Partial<SonnikArticle>,
): Partial<SonnikArticle> | null {
  const today = new Date().toISOString().slice(0, 10);
  const slug = String(d.slug ?? '').trim();
  const title = String(d.title ?? '').trim();
  if (!slug || !title) return null;
  const kws = Array.isArray(d.keywords)
    ? d.keywords
        .map((x) => String(x).trim().toLowerCase())
        .filter(Boolean)
    : [];
  return {
    slug,
    title,
    description: String(d.description ?? '').trim(),
    lead: String(d.lead ?? '').trim(),
    miller: String(d.miller ?? '').trim(),
    freud: String(d.freud ?? '').trim(),
    folk: String(d.folk ?? '').trim(),
    conclusion: String(d.conclusion ?? '').trim(),
    keywords: kws,
    datePublished:
      typeof d.datePublished === 'string' ? d.datePublished : today,
    dateModified: today,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function BulkGeneratePanel() {
  const router = useRouter();
  const [bulkText, setBulkText] = useState('');
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [results, setResults] = useState<RowResult[]>([]);
  const [summary, setSummary] = useState<string | null>(null);

  async function runBatch() {
    setSummary(null);
    const lines = parseLines(bulkText);
    if (lines.length === 0) {
      setSummary('Добавьте хотя бы одну строку (тема или ключевая фраза, 2–600 символов).');
      return;
    }

    setRunning(true);
    setResults([]);
    setProgress({ done: 0, total: lines.length });

    const acc: RowResult[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      setProgress({ done: i, total: lines.length });

      try {
        const genRes = await fetch('/api/admin/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ theme: line }),
        });
        const genData = (await genRes.json()) as {
          ok?: boolean;
          draft?: Partial<SonnikArticle>;
          error?: string;
        };
        if (!genRes.ok || !genData.ok || !genData.draft) {
          acc.push({
            line,
            status: 'error',
            message: genData.error ?? `Ошибка ИИ (HTTP ${genRes.status})`,
          });
          setResults([...acc]);
          continue;
        }

        const payload = draftToPayload(genData.draft);
        if (!payload) {
          acc.push({
            line,
            status: 'error',
            message: 'Модель вернула неполный черновик (нет slug/title)',
          });
          setResults([...acc]);
          continue;
        }

        const saveRes = await fetch('/api/admin/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        const saveData = (await saveRes.json()) as {
          ok?: boolean;
          error?: string;
          article?: SonnikArticle;
        };

        if (saveRes.status === 409) {
          acc.push({
            line,
            status: 'skipped',
            slug: String(payload.slug),
          });
        } else if (!saveRes.ok || !saveData.ok) {
          acc.push({
            line,
            status: 'error',
            message: saveData.error ?? `Сохранение HTTP ${saveRes.status}`,
          });
        } else {
          acc.push({
            line,
            status: 'created',
            slug: saveData.article?.slug ?? String(payload.slug),
          });
        }
        setResults([...acc]);
      } catch {
        acc.push({
          line,
          status: 'error',
          message: 'Сеть или сервер недоступны',
        });
        setResults([...acc]);
      }

      if (i < lines.length - 1) {
        await sleep(BETWEEN_MS);
      }
    }

    setProgress({ done: lines.length, total: lines.length });
    const created = acc.filter((r) => r.status === 'created').length;
    const skipped = acc.filter((r) => r.status === 'skipped').length;
    const errors = acc.filter((r) => r.status === 'error').length;
    setSummary(
      `Готово: создано ${created}, пропущено (уже есть slug) ${skipped}, ошибок ${errors}.`,
    );
    setRunning(false);
    router.refresh();
  }

  return (
    <main className="shell admin-page">
      <div className="admin-toolbar">
        <h1 className="admin-title">Пакет: ключевики → статьи</h1>
        <div className="admin-actions">
          <Link className="btn btn-ghost" href="/admin">
            К списку
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      <p className="admin-hint">
        Одна строка — одна тема для сонника (как в поиске: «к чему снится …», «приснился …»).
        Для каждой строки вызывается DeepSeek, затем статья сразу сохраняется в хранилище (Blob
        или локальный JSON). Максимум {MAX_LINES} уникальных строк за запуск.
      </p>

      <section className="admin-form" style={{ marginBottom: '1.5rem' }}>
        <label>
          Список тем / ключевиков
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={14}
            disabled={running}
            placeholder={
              'к чему снится чёрная кошка\nприснился змей\nсонник вода толкование'
            }
          />
        </label>
        <div className="admin-row">
          <button
            type="button"
            className="btn btn-primary"
            disabled={running}
            onClick={runBatch}
          >
            {running
              ? `Идёт генерация… ${progress.done}/${progress.total}`
              : 'Сгенерировать и сохранить все'}
          </button>
        </div>
        {summary ? (
          <p className="admin-msg ok" style={{ marginTop: '0.5rem' }}>
            {summary}
          </p>
        ) : null}
      </section>

      {results.length > 0 ? (
        <section>
          <h2 className="page-title" style={{ fontSize: '1rem' }}>
            Результат
          </h2>
          <ul className="admin-bulk-log">
            {results.map((r, idx) => (
              <li key={`${idx}-${r.line.slice(0, 24)}`}>
                {r.status === 'created' ? (
                  <>
                    <span className="admin-bulk-ok">✓</span>{' '}
                    <Link
                      href={`/admin/articles/${encodeURIComponent(r.slug)}/edit`}
                    >
                      {r.line}
                    </Link>
                    <span className="admin-slug">{r.slug}</span>
                  </>
                ) : r.status === 'skipped' ? (
                  <>
                    <span className="admin-bulk-skip">—</span> {r.line}
                    <span className="admin-slug">уже есть: {r.slug}</span>
                  </>
                ) : (
                  <>
                    <span className="admin-bulk-err">!</span> {r.line}
                    <span className="admin-slug">{r.message}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
