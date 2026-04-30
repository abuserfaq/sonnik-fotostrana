import Link from 'next/link';

import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton';
import { loadArticles } from '@/lib/articles-store';

export const revalidate = 0;

export default async function AdminHomePage() {
  const articles = [...(await loadArticles())].sort((a, b) =>
    a.title.localeCompare(b.title, 'ru'),
  );

  return (
    <main className="shell admin-page">
      <div className="admin-toolbar">
        <h1 className="admin-title">Сонник · админка</h1>
        <div className="admin-actions">
          <Link className="btn btn-primary" href="/admin/articles/new">
            Новая статья
          </Link>
          <Link className="btn btn-ghost" href="/admin/articles/bulk">
            Пакет из ключевиков
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
      <p className="admin-hint">
        Публичный контент читается из <code>content/symbols.json</code> локально
        или из Vercel Blob при <code>BLOB_READ_WRITE_TOKEN</code>.
      </p>
      <ul className="admin-list">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={`/admin/articles/${encodeURIComponent(a.slug)}/edit`}>
              {a.title}
            </Link>
            <span className="admin-slug">{a.slug}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
