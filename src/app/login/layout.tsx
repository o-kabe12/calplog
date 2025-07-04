import { FirebaseInitializer } from "@/components/FirebaseInitializer";
import { Providers } from "../component/providers";

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
