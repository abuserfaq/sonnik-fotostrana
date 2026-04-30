import type { Metadata, Viewport } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteJsonLd } from '@/components/SiteJsonLd';
import { YandexMetrika } from '@/components/YandexMetrika';
import { fontDisplay, fontSans } from './fonts';
import './globals.css';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sonnik.fotostrana.ru';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0c0e12',
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
        <YandexMetrika />
      </body>
    </html>
  );
}
