'use client';

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={async () => {
        await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
        window.location.href = '/admin/login';
      }}
    >
      Выйти
    </button>
  );
}
