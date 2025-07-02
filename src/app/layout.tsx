import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./component/providers";

export const metadata: Metadata = {
  title: "CalPlog - TOP",
  description: "カロリーとタンパク質を簡単に計算・記録できるアプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
