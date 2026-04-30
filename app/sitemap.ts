import type { MetadataRoute } from 'next';
import { getAllSlugsAsync } from '@/lib/content';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sonnik.fotostrana.ru';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastMod = new Date();
  const staticPaths = ['', '/sonnik', '/o-proekte'];
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path || '/'}`,
    lastModified: lastMod,
    changeFrequency: 'weekly',
    priority:
      path === '' ? 1 : path === '/sonnik' ? 0.9 : path === '/o-proekte' ? 0.65 : 0.8,
  }));

  for (const slug of await getAllSlugsAsync()) {
    entries.push({
      url: `${siteUrl}/sonnik/${slug}`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  return entries;
}
