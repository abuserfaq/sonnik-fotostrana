/** Главная Фотостраны (соцсеть). */
export function getFotostranaMainUrl(): string {
  return (
    process.env.NEXT_PUBLIC_FS_CTA_URL?.trim() || 'https://www.fotostrana.ru'
  );
}

/** Канонический origin сонника. */
export function getSiteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://sonnik.fotostrana.ru'
  ).replace(/\/+$/, '');
}

/** Полный URL страницы сонника для шаринга и canonical. */
export function absoluteSonnikUrl(path: string): string {
  const base = getSiteOrigin();
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
