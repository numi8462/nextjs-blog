import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Noto_Sans_KR } from 'next/font/google';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
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
