import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteJsonLd } from '@/components/SiteJsonLd';
import { fontDisplay, fontSans } from './fonts';
import './globals.css';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sonnik-fotostrana1.vercel.app';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Сонник';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — толкование снов`,
    template: `%s — ${siteName}`,
  },
  description:
    'Сонник: к чему снятся вода, змея, бывший и сотни других символов. Миллер, Фрейд, народные сонники.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${fontSans.variable} ${fontDisplay.variable}`}
      >
        <SiteJsonLd />
        <SiteHeader siteName={siteName} />
        <div className="layout-main">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
