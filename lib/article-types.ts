/** Тип записи сонника (общий для сайта и админки). */
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
