const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sonnik-fotostrana1.vercel.app';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Сонник';
const publisherName =
  process.env.NEXT_PUBLIC_PUBLISHER_NAME ?? 'Фотострана';
const publisherUrl =
  process.env.NEXT_PUBLIC_PUBLISHER_URL ?? 'https://www.fotostrana.ru';

export function SiteJsonLd() {
  const graph = [
    {
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
      inLanguage: 'ru-RU',
      publisher: { '@id': `${siteUrl}#publisher` },
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}#publisher`,
      name: publisherName,
      url: publisherUrl,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
