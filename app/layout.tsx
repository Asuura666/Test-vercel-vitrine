import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vitrine Lab — Vercel + Agent IA',
  description: 'POC de site vitrine déployable sur Vercel avec un agent IA server-side.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
