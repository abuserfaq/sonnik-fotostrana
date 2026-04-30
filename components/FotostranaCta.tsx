const defaultHref =
  process.env.NEXT_PUBLIC_FS_CTA_URL ?? 'https://www.fotostrana.ru';

export function FotostranaCta() {
  return (
    <aside className="cta" aria-label="Приглашение на Фотострану">
      <h2 className="cta-title">Расскажи сон другу</h2>
      <p className="cta-text">
        Обсуди сон в привычном кругу — найди друзей и единомышленников на{' '}
        <strong>Фотостране</strong>.
      </p>
      <a className="cta-button" href={defaultHref} rel="noopener">
        Перейти на Фотострану
      </a>
    </aside>
  );
}
