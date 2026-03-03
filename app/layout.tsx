import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Brazil Visible',
    default: 'Brazil Visible',
  },
  description:
    'Discover and explore 93+ public APIs from Brazil — government data, finance, geolocation, and more.',
  metadataBase: new URL('https://brazilvisible.org'),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-dark.svg', media: '(prefers-color-scheme: light)' },
      { url: '/icon-light.svg', media: '(prefers-color-scheme: dark)' },
    ],
  },
  alternates: {
    canonical: 'https://brazilvisible.org',
    languages: { 'pt-BR': 'https://brazilvisible.org' },
  },
  openGraph: {
    title: 'Brazil Visible',
    description:
      'Discover and explore 93+ public APIs from Brazil — government data, finance, geolocation, and more.',
    url: 'https://brazilvisible.org',
    siteName: 'Brazil Visible',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Brazil Visible — Catálogo de Dados Públicos Brasileiros',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brazil Visible',
    description:
      'Discover and explore 93+ public APIs from Brazil — government data, finance, geolocation, and more.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={jakarta.variable}>
      <body className="font-sans bg-white dark:bg-dark-bg text-neutral-900 dark:text-neutral-200 antialiased">
        <ThemeProvider attribute="class" defaultTheme="light">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-neutral-900 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white dark:focus:bg-white dark:focus:text-neutral-900"
          >
            Pular para o conteúdo
          </a>
          <Navbar />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
