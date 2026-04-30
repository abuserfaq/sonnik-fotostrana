import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'О проекте',
  description:
    'Как устроен сонник, источники толкований и ограничения материалов.',
};

export default function AboutPage() {
  return (
    <main className="shell page-block">
      <h1 className="page-title">О проекте</h1>
      <div className="prose-plain">
        <p>
          Этот раздел — справочник по образам снов. Тексты создаются для
          взрослой аудитории и структурированы так, чтобы было удобно читать с
          телефона и находить ответы в поиске.
        </p>
        <p>
          Блоки «Миллер», «Фрейд» и «народный сонник» обобщают распространённые
          трактовки и не подменяют оригинальные издания. Если вам нужна
          клиническая помощь, обратитесь к врачу или психологу.
        </p>
        <p>
          Проект связан с экосистемой{' '}
          <a href="https://www.fotostrana.ru" rel="noopener">
            Фотостраны
          </a>
          : мы приглашаем обсуждать сны с друзьями в привычной соцсети.
        </p>
        <p>
          <Link href="/sonnik">К каталогу символов</Link>
        </p>
      </div>
    </main>
  );
}
