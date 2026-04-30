import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/ArticleJsonLd';
import { ArticleToc } from '@/components/ArticleToc';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FotostranaCta } from '@/components/FotostranaCta';
import {
  getAllSlugs,
  getArticleBySlug,
  type SonnikArticle,
} from '@/lib/content';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sonnik.example.com';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Сонник';
const publisherName =
  process.env.NEXT_PUBLIC_PUBLISHER_NAME ?? 'Фотострана';
const publisherUrl =
  process.env.NEXT_PUBLIC_PUBLISHER_URL ?? 'https://www.fotostrana.ru';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return { title: 'Не найдено' };
  }
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/sonnik/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/sonnik/${article.slug}`,
      type: 'article',
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
    },
  };
}

function ArticleBody({ article }: { article: SonnikArticle }) {
  return (
    <article className="article">
      <h1>{article.title}</h1>
      <p className="meta">
        Обновлено {article.dateModified}
        <span aria-hidden="true"> · </span>
        <span>{siteName}</span>
      </p>
      <p id="lead">{article.lead}</p>
      <section aria-labelledby="miller-heading">
        <h2 id="miller-heading">По соннику Миллера</h2>
        <p>{article.miller}</p>
      </section>
      <section aria-labelledby="freud-heading">
        <h2 id="freud-heading">По Фрейду</h2>
        <p>{article.freud}</p>
      </section>
      <section aria-labelledby="folk-heading">
        <h2 id="folk-heading">Народный сонник</h2>
        <p>{article.folk}</p>
      </section>
      <section aria-labelledby="sum-heading">
        <h2 id="sum-heading">Как понять свой сон</h2>
        <p>{article.conclusion}</p>
      </section>
    </article>
  );
}

export default async function SonnikArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <main className="shell page-block">
      <ArticleJsonLd
        article={article}
        siteUrl={siteUrl}
        siteName={siteName}
        publisherName={publisherName}
        publisherUrl={publisherUrl}
      />
      <BreadcrumbJsonLd
        siteUrl={siteUrl}
        items={[
          { name: 'Главная', path: '/' },
          { name: 'Сонник', path: '/sonnik' },
          { name: article.title, path: `/sonnik/${article.slug}` },
        ]}
      />
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Сонник', href: '/sonnik' },
          { label: article.title },
        ]}
      />
      <div className="article-layout">
        <ArticleBody article={article} />
        <div className="article-toc-wrap">
          <ArticleToc />
        </div>
      </div>
      <FotostranaCta />
      <p className="footer-note">
        Информация обобщённая. При частых тревожных снах обратитесь к
        специалисту.
      </p>
    </main>
  );
}
