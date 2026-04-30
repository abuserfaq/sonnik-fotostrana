/** Кэш публичного каталога /sonnik между запросами (ISR). */
export const revalidate = 120;

export default function SonnikSectionLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
