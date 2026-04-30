const links = [
  { id: 'lead', label: 'Введение' },
  { id: 'miller-heading', label: 'Миллер' },
  { id: 'freud-heading', label: 'Фрейд' },
  { id: 'folk-heading', label: 'Народный' },
  { id: 'sum-heading', label: 'Вывод' },
] as const;

export function ArticleToc() {
  return (
    <nav className="article-toc" aria-label="На этой странице">
      <p className="article-toc-title">На странице</p>
      <ul className="article-toc-list">
        {links.map((l) => (
          <li key={l.id}>
            <a href={`#${l.id}`}>{l.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
