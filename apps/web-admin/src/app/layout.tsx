import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Noeve Admin',
  description: 'Manage orders, products, and fulfillment',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
