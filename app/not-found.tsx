import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="shell page-block">
      <h1 className="page-title">Страница не найдена</h1>
      <p className="lead">
        Возможно, ссылка устарела или символ ещё не добавлен в сонник.
      </p>
      <p>
        <Link href="/">На главную</Link>
        {' · '}
        <Link href="/sonnik">Все символы</Link>
      </p>
    </main>
  );
}
