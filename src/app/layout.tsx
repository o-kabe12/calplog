import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./component/providers";
import { FirebaseInitializer } from "@/components/FirebaseInitializer"; 

export const metadata: Metadata = {
  title: "CalPlog - TOP",
  description: "カロリーとタンパク質を簡単に計算・記録できるアプリです。",
  keywords: ["カロリー", "タンパク質", "計算", "記録", "アプリ","calplog"],
  openGraph: {
    title: "CalPlog",
    description: "カロリーとタンパク質を簡単に計算・記録できるアプリです。",
    url: "https://calplog.vercel.app/",
    siteName: "CalPlog",
    images: [
      {
        url: "https://calplog.vercel.app/ogp.jpg",
        width: 1280,
        height: 670,
        alt: "CalPlog OGP Image"
      }
    ],
    locale: "ja_JP",
    type: "website"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <FirebaseInitializer>
            {children}
          </FirebaseInitializer>
          </Providers>
      </body>
    </html>
  );
}
