import type { Metadata } from 'next';
import { FotostranaCta } from '@/components/FotostranaCta';
import { SymbolSearch } from '@/components/SymbolSearch';
import { getAllArticles } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Все символы',
  description:
    'Алфавитный список символов сонника: вода, бывший, змея и другие. Поиск по названию.',
};

export default function SonnikIndexPage() {
  const sorted = [...getAllArticles()].sort((a, b) =>
    a.title.localeCompare(b.title, 'ru'),
  );

  return (
    <main className="shell page-block">
      <h1 className="page-title">Символы сонника</h1>
      <p className="lead">
        Найдите образ из сна. Список будет расти по мере добавления статей.
      </p>
      <SymbolSearch articles={sorted} />
      <FotostranaCta />
    </main>
  );
}
