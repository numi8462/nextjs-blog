import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  weight: ['500'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "YBlog",
  description: "Next.js와 Notion API를 활용한 개인 블로그",
  icons: {
    icon: './logo.svg', 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansKr.className}`}
      >
        {children}
      </body>
    </html>
  );
}
