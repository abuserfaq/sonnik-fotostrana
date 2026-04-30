import Link from 'next/link';

type Props = { siteName: string };

export function SiteHeader({ siteName }: Props) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand">
          <span className="site-brand-mark" aria-hidden="true" />
          <span className="site-brand-text">{siteName}</span>
        </Link>
        <nav className="site-nav" aria-label="Основная навигация">
          <Link href="/sonnik">Символы</Link>
          <Link href="/o-proekte">О проекте</Link>
        </nav>
      </div>
    </header>
  );
}
