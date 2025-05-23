import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css';
import { ThemeProvider } from '@/components/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Board Exam Review Questions',
  description: 'Practice questions for various board exams in the Philippines',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
