import type { Metadata } from 'next';

import { FotostranaCta } from '@/components/FotostranaCta';
import { ShareBlock } from '@/components/ShareBlock';
import { SymbolSearch } from '@/components/SymbolSearch';
import { loadArticles } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Все символы',
  description:
    'Алфавитный список символов сонника: вода, бывший, змея и другие. Поиск по названию.',
};

export default async function SonnikIndexPage() {
  const all = await loadArticles();
  const sorted = [...all].sort((a, b) =>
    a.title.localeCompare(b.title, 'ru'),
  );

  return (
    <main className="shell page-block">
      <h1 className="page-title">Символы сонника</h1>
      <p className="lead">
        Найдите образ из сна. Список будет расти по мере добавления статей.
      </p>
      <div className="page-inline-share">
        <ShareBlock
          sharePath="/sonnik"
          title="Сонник — все символы"
        />
      </div>
      <SymbolSearch articles={sorted} />
      <FotostranaCta />
    </main>
  );
}
