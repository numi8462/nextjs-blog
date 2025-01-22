import type { Metadata } from "next";
import "./globals.css";
import { Noto_Sans_KR, Fugaz_One, Nanum_Gothic } from "next/font/google";

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
    description: "Next.js와 Notion API를 활용한 개인 블로그",
    icons: {
        icon: "https://raw.githubusercontent.com/numi8462/nextjs-blog/main/public/logo.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <head>
                <title>{`${metadata.title}`}</title> 
                <meta name="description" content={`${metadata.description}`} />
                {/* ... add other meta tags based on metadata or post data */}
                <meta name="og:url" content="https://numi8462.github.io/nextjs-blog/" />
                <meta name="og:type" content="website" />
                <meta name="og:description" content="nextjs를 활용한 개인 블로그" />
                <meta name="og:image" content="https://numi8462.github.io/nextjs-blog/public/blog.png" />
            </head>
            <body
                className={`${notoSansKr.className} ${fugaz_one.variable} ${nanum_gothic.variable}`}
            >
                {children}
            </body>
        </html>
    );
}
