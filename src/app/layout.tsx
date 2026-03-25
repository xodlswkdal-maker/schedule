import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '우리 일정 - 태인 & 소진',
  description: '의사 커플 스케줄 및 할 일 관리',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[var(--bg-warm)]">{children}</body>
    </html>
  );
}
