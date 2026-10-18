import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const jost = localFont({
  src: [
    { path: './fonts/jost-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/jost-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/jost-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-jost',
  display: 'swap',
});

const serif = localFont({
  src: [
    { path: './fonts/source-serif-4-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/source-serif-4-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/source-serif-4-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-serif',
  preload: false,
  display: 'swap',
});

const oswald = localFont({
  src: './fonts/oswald-500.woff2',
  weight: '500',
  variable: '--font-oswald',
  display: 'swap',
});

const caveat = localFont({
  src: './fonts/caveat-500.woff2',
  weight: '500',
  variable: '--font-caveat',
  preload: false,
  display: 'swap',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

const title = 'Кварта — свежий кофе из Минска';
const description =
  'Небольшая обжарка в Минске: партии по 5 кг, обжарка по четвергам, доставка по пятницам. Подписка и разовые заказы.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: 'website',
    locale: 'ru_BY',
    siteName: 'Кварта',
    title,
    description,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Кварта — обжарка кофе в Минске' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body
        className={`${jost.variable} ${serif.variable} ${oswald.variable} ${caveat.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
