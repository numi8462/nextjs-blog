import type { Metadata } from "next";
import { Noto_Sans_KR, Fugaz_One, Nanum_Gothic } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
    weight: ["500"],
    subsets: ["latin"],
});

const fugaz_one = Fugaz_One({
    weight: ["400"],
    style: ["normal"],
    subsets: ["latin"],
    variable: "--fugaz",
});

const nanum_gothic = Nanum_Gothic({
    weight: ["400"],
    style: ["normal"],
    subsets: ["latin"],
    variable: "--nanum",
});

export const metadata: Metadata = {
    title: "Ylog",
    description: "Next.js와 Notion API를 활용한 개인 개발 블로그",
    icons: {
        icon: "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/logo.svg",
    },
    openGraph: {
        title: "Ylog",
        description: "Next.js와 Notion API를 활용한 개인 개발 블로그",
        images: [
            {
                url: "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/cover/blog.png",
                width: 1200,
                height: 630,
                alt: "Ylog Cover Image",
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body
                className={`${notoSansKr.className} ${fugaz_one.variable} ${nanum_gothic.variable}`}
            >
                {children}
            </body>
        </html>
    );
}