import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './global.css';
import { ThemeProvider } from '@/components/ThemeContext';
import AuthProvider from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BoardMaster - Your Board Exam Review Companion',
  description: 'Comprehensive board exam review platform with practice questions and progress tracking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
