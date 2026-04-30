'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { SonnikArticle } from '@/lib/article-types';

import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton';

import '@/app/admin/admin.css';

type Props =
  | {
      mode: 'new';
      initial: null;
    }
  | {
      mode: 'edit';
      initial: SonnikArticle;
      originalSlug: string;
    };

const empty = (): SonnikArticle => {
  const t = new Date().toISOString().slice(0, 10);
  return {
    slug: '',
    title: '',
    description: '',
    lead: '',
    miller: '',
    freud: '',
    folk: '',
    conclusion: '',
    keywords: [],
    datePublished: t,
    dateModified: t,
  };
};

export function ArticleEditor(props: Props) {
  const router = useRouter();
  const originalSlug = props.mode === 'edit' ? props.originalSlug : '';

  const [form, setForm] = useState<SonnikArticle>(() =>
    props.mode === 'edit' ? { ...props.initial } : empty(),
  );
  const [keywordsText, setKeywordsText] = useState(() =>
    props.mode === 'edit' ? props.initial.keywords.join('\n') : '',
  );
  const [genTheme, setGenTheme] = useState('');
  const [genSlugHint, setGenSlugHint] = useState('');
  const [msg, setMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  async function runGenerate() {
    setMsg(null);
    if (!genTheme.trim()) {
      setMsg({ type: 'error', text: 'Введите тему для ИИ' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          theme: genTheme.trim(),
          suggestedSlug: genSlugHint.trim() || undefined,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        draft?: Partial<SonnikArticle>;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.draft) {
        setMsg({ type: 'error', text: data.error ?? 'Ошибка генерации' });
        return;
      }
      const d = data.draft;
      const today = new Date().toISOString().slice(0, 10);
      const next: SonnikArticle = {
        slug: String(d.slug ?? form.slug).trim(),
        title: String(d.title ?? form.title).trim(),
        description: String(d.description ?? form.description).trim(),
        lead: String(d.lead ?? form.lead).trim(),
        miller: String(d.miller ?? form.miller).trim(),
        freud: String(d.freud ?? form.freud).trim(),
        folk: String(d.folk ?? form.folk).trim(),
        conclusion: String(d.conclusion ?? form.conclusion).trim(),
        keywords: Array.isArray(d.keywords) ? d.keywords.map(String) : form.keywords,
        datePublished:
          typeof d.datePublished === 'string' ? d.datePublished : today,
        dateModified: today,
      };
      setForm(next);
      setKeywordsText(next.keywords.join('\n'));
      setMsg({ type: 'ok', text: 'Черновик подставлен — проверьте и сохраните.' });
    } catch {
      setMsg({ type: 'error', text: 'Сеть или сервер недоступны' });
    } finally {
      setLoading(false);
    }
  }

  async function runSave() {
    setMsg(null);
    const kws = keywordsText
      .split(/[\n,]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const today = new Date().toISOString().slice(0, 10);
    const payload: Partial<SonnikArticle> = {
      ...form,
      keywords: kws,
      dateModified: today,
      datePublished: form.datePublished || today,
    };

    setLoading(true);
    try {
      if (props.mode === 'new') {
        const res = await fetch('/api/admin/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as {
          ok?: boolean;
          error?: string;
          article?: SonnikArticle;
        };
        if (!res.ok || !data.ok) {
          setMsg({ type: 'error', text: data.error ?? 'Ошибка сохранения' });
          return;
        }
        router.push(`/admin/articles/${encodeURIComponent(data.article!.slug)}/edit`);
        router.refresh();
        return;
      }

      const res = await fetch(
        `/api/admin/articles/${encodeURIComponent(originalSlug)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setMsg({ type: 'error', text: data.error ?? 'Ошибка сохранения' });
        return;
      }
      setMsg({ type: 'ok', text: 'Сохранено.' });
      if (payload.slug && payload.slug !== originalSlug) {
        router.replace(`/admin/articles/${encodeURIComponent(payload.slug)}/edit`);
      }
      router.refresh();
    } catch {
      setMsg({ type: 'error', text: 'Сеть недоступна' });
    } finally {
      setLoading(false);
    }
  }

  async function runDelete() {
    if (props.mode !== 'edit') return;
    if (!window.confirm(`Удалить «${props.initial.title}»?`)) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/articles/${encodeURIComponent(originalSlug)}`,
        { method: 'DELETE', credentials: 'include' },
      );
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setMsg({ type: 'error', text: data.error ?? 'Не удалось удалить' });
        return;
      }
      router.push('/admin');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell admin-page">
      <div className="admin-toolbar">
        <h1 className="admin-title">
          {props.mode === 'new' ? 'Новая статья' : 'Редактирование'}
        </h1>
        <div className="admin-actions">
          <Link className="btn btn-ghost" href="/admin">
            К списку
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      <section className="admin-form" style={{ marginBottom: '2rem' }}>
        <h2 className="page-title" style={{ fontSize: '1rem' }}>
          Генерация (DeepSeek)
        </h2>
        <label>
          Тема / образ сна
          <textarea
            value={genTheme}
            onChange={(e) => setGenTheme(e.target.value)}
            rows={3}
            placeholder="Например: к чему снится чёрная кошка в доме"
          />
        </label>
        <label>
          Подсказка slug (латиница, опционально)
          <input
            type="text"
            value={genSlugHint}
            onChange={(e) => setGenSlugHint(e.target.value)}
            placeholder="chernaya-koshka"
            autoComplete="off"
          />
        </label>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={loading}
          onClick={runGenerate}
        >
          Сгенерировать черновик
        </button>
      </section>

      <div className="admin-form">
        <label>
          slug (латиница, дефис)
          <input
            type="text"
            value={form.slug}
            onChange={(e) =>
              setForm((f) => ({ ...f, slug: e.target.value.trim() }))
            }
            required
            autoComplete="off"
          />
        </label>
        <label>
          title
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </label>
        <label>
          description
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            required
          />
        </label>
        <label>
          lead
          <textarea
            value={form.lead}
            onChange={(e) => setForm((f) => ({ ...f, lead: e.target.value }))}
            required
          />
        </label>
        <label>
          Миллер
          <textarea
            value={form.miller}
            onChange={(e) =>
              setForm((f) => ({ ...f, miller: e.target.value }))
            }
            required
          />
        </label>
        <label>
          Фрейд
          <textarea
            value={form.freud}
            onChange={(e) => setForm((f) => ({ ...f, freud: e.target.value }))}
            required
          />
        </label>
        <label>
          Народный
          <textarea
            value={form.folk}
            onChange={(e) => setForm((f) => ({ ...f, folk: e.target.value }))}
            required
          />
        </label>
        <label>
          Вывод
          <textarea
            value={form.conclusion}
            onChange={(e) =>
              setForm((f) => ({ ...f, conclusion: e.target.value }))
            }
            required
          />
        </label>
        <label>
          Ключевики (с новой строки или через запятую)
          <textarea
            value={keywordsText}
            onChange={(e) => setKeywordsText(e.target.value)}
            rows={5}
            required
          />
        </label>
        <div className="admin-row">
          <label style={{ flex: 1 }}>
            datePublished
            <input
              type="date"
              value={form.datePublished}
              onChange={(e) =>
                setForm((f) => ({ ...f, datePublished: e.target.value }))
              }
            />
          </label>
          <label style={{ flex: 1 }}>
            dateModified
            <input
              type="date"
              value={form.dateModified}
              onChange={(e) =>
                setForm((f) => ({ ...f, dateModified: e.target.value }))
              }
            />
          </label>
        </div>

        <div className="admin-row" style={{ marginTop: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            disabled={loading}
            onClick={runSave}
          >
            Сохранить
          </button>
          {props.mode === 'edit' ? (
            <button
              type="button"
              className="btn btn-ghost"
              disabled={loading}
              onClick={runDelete}
            >
              Удалить
            </button>
          ) : null}
        </div>
        {msg ? (
          <p className={`admin-msg ${msg.type === 'error' ? 'error' : 'ok'}`}>
            {msg.text}
          </p>
        ) : null}
      </div>
    </main>
  );
}
