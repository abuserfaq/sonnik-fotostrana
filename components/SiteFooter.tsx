import Link from 'next/link';

import { ShareBlock } from '@/components/ShareBlock';

import { getFotostranaMainUrl } from '@/lib/site-config';

export function SiteFooter() {
  const year = new Date().getFullYear();
  const fsUrl = getFotostranaMainUrl();
  return (
    <footer className="site-footer">
      <div className="shell site-footer-inner">
        <div className="site-footer-col">
          <p className="site-footer-title">Сонник</p>
          <p className="site-footer-muted">
            Толкования носят ознакомительный характер и не заменяют помощь
            специалиста.
          </p>
          <a
            className="site-fs-back site-fs-back--footer"
            href={fsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Вернуться в Фотострану
          </a>
          <ShareBlock variant="default" className="site-footer-share" />
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
