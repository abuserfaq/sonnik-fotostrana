import Link from 'next/link';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="shell site-footer-inner">
        <div className="site-footer-col">
          <p className="site-footer-title">Сонник</p>
          <p className="site-footer-muted">
            Толкования носят ознакомительный характер и не заменяют помощь
            специалиста.
          </p>
        </div>
        <div className="site-footer-col site-footer-links">
          <Link href="/">Главная</Link>
          <Link href="/sonnik">Все символы</Link>
          <Link href="/o-proekte">О проекте</Link>
        </div>
      </div>
      <p className="site-footer-copy shell">
        © {year} · проект для аудитории Фотостраны
      </p>
    </footer>
  );
}
