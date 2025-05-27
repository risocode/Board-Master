import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/common/ThemeContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { Analytics } from "@vercel/analytics/next";
import './global.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Board Exam Review Questions',
  description: 'Comprehensive board exam review questions for various courses. Practice and prepare for your board exams with our extensive question bank.',
  keywords: 'board exam, review questions, practice test, exam preparation, professional licensure',
  authors: [{ name: 'Risoca' }],
  creator: 'Risoca',
  publisher: 'Risoca',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Board Exam Review Questions',
    description: 'Comprehensive board exam review questions for various courses',
    type: 'website',
    locale: 'en_US',
    siteName: 'Board Exam Review Questions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Board Exam Review Questions',
    description: 'Comprehensive board exam review questions for various courses',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1482729173853463" crossOrigin="anonymous"></script>
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Board Master" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  );
}