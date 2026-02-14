import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mashaail SMS - مدرسة مشاعل مسقط الخاصة',
  description: 'School Management System for Mashaail Muscat Private School',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {/* Animated dreamy background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="dream-orb orb-1" />
          <div className="dream-orb orb-2" />
          <div className="dream-orb orb-3" />
          <div className="dream-orb orb-4" />
          <div className="dream-orb orb-5" />
        </div>

        {children}
      </body>
    </html>
  );
}
