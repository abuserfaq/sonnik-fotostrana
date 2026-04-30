import type { SonnikArticle } from '@/lib/article-types';
import { buildSearchKeywords } from '@/lib/keywords';

type Props = {
  article: SonnikArticle;
  siteUrl: string;
  siteName: string;
  publisherName: string;
  publisherUrl: string;
};

export function ArticleJsonLd({
  article,
  siteUrl,
  siteName,
  publisherName,
  publisherUrl,
}: Props) {
  const url = `${siteUrl}/sonnik/${article.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Organization',
      name: publisherName,
      url: publisherUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      url: publisherUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: buildSearchKeywords(article).join(', '),
    inLanguage: 'ru-RU',
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  siteUrl,
  items,
}: {
  siteUrl: string;
  items: { name: string; path: string }[];
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${siteUrl}${it.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
