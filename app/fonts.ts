import { Cormorant_Garamond, Manrope } from 'next/font/google';

export const fontSans = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

export const fontDisplay = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  weight: ['400', '600', '700'],
  display: 'swap',
});
