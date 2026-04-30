import { notFound } from 'next/navigation';

import { ArticleEditor } from '@/components/admin/ArticleEditor';
import { loadArticles } from '@/lib/articles-store';

type Props = { params: Promise<{ slug: string }> };

export default async function EditArticlePage({ params }: Props) {
  const { slug } = await params;
  const articles = await loadArticles();
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <ArticleEditor mode="edit" initial={article} originalSlug={slug} />
  );
}
