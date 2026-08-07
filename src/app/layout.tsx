import type { Metadata } from 'next';
import { Toaster } from '../components/ui/sonner';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Infinity - AI Startup Analyst',
  description: 'AI-powered startup analysis platform helping investors make smarter, faster decisions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#070b18]">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
