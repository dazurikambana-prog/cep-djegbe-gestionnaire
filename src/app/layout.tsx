import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CEP DJEGBE - Gestionnaire',
  description: 'Gestionnaire d\'évaluation CM2 - Centre DJEGBE',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}