import Link from 'next/link';

import { ShareBlock } from '@/components/ShareBlock';

import { getFotostranaMainUrl } from '@/lib/site-config';

type Props = { siteName: string };

export function SiteHeader({ siteName }: Props) {
  const fsUrl = getFotostranaMainUrl();
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
        <div className="site-header-extras">
          <a
            className="site-fs-back"
            href={fsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Вернуться в Фотострану
          </a>
          <ShareBlock variant="compact" />
        </div>
      </div>
    </header>
  );
}
