import { getFotostranaMainUrl } from '@/lib/site-config';

export function FotostranaCta() {
  const href = getFotostranaMainUrl();
  return (
    <aside className="cta" aria-label="Приглашение на Фотострану">
      <h2 className="cta-title">Расскажи сон другу</h2>
      <p className="cta-text">
        Обсуди сон в привычном кругу — найди друзей и единомышленников на{' '}
        <strong>Фотостране</strong>.
      </p>
      <a
        className="cta-button"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        Вернуться в Фотострану
      </a>
    </aside>
  );
}
