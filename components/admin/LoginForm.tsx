'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import '@/app/admin/admin.css';

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Не удалось войти');
        return;
      }
      router.push(nextPath);
      router.refresh();
    } catch {
      setError('Сетевая ошибка');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell admin-page" style={{ paddingTop: '3rem' }}>
      <h1 className="admin-title">Вход в админку</h1>
      <p className="admin-hint">
        Доступ по паролю. Сессия 8 часов, cookie httpOnly, SameSite=Lax.
      </p>
      <form className="admin-form" onSubmit={onSubmit} style={{ maxWidth: '24rem' }}>
        <label>
          Пароль
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '…' : 'Войти'}
        </button>
        {error ? <p className="admin-msg error">{error}</p> : null}
      </form>
    </main>
  );
}
