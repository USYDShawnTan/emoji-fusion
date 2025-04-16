import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emoji Fusion',
  description: '将两个emoji合成为一个的有趣工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  );
} 