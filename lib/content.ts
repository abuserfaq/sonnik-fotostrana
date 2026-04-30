import symbolsData from '@/content/symbols.json';

export type SonnikArticle = {
  slug: string;
  title: string;
  description: string;
  lead: string;
  miller: string;
  freud: string;
  folk: string;
  conclusion: string;
  keywords: string[];
  datePublished: string;
  dateModified: string;
};

type SymbolsFile = { articles: SonnikArticle[] };

const file = symbolsData as SymbolsFile;

export function getAllArticles(): SonnikArticle[] {
  return file.articles;
}

export function getArticleBySlug(slug: string): SonnikArticle | undefined {
  return file.articles.find((a) => a.slug === slug);
}

export function getAllSlugs(): string[] {
  return file.articles.map((a) => a.slug);
}
