"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase"; // auth が正しくインポートされていることを確認

interface FirebaseInitializerProps {
  children: React.ReactNode;
}

export const FirebaseInitializer: React.FC<FirebaseInitializerProps> = ({ children }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    // auth オブジェクトが存在しない場合は何もしない
    // auth は getAuth(app) の結果なので、存在しないことは稀だけど、念のため
    if (!auth) {
      console.warn("Firebase Auth instance is not available.");
      return;
    }

    // セッションが読み込み中（"loading"）ではない場合のみ処理
    if (status !== "loading") {
      async function authenticateFirebase() {
        // NextAuth.jsでログイン済み（"authenticated"）の場合、かつFirebase Authに未ログインの場合
        if (status === "authenticated" && session?.user && !auth.currentUser) {
          console.log("NextAuth.jsセッションあり。Firebaseカスタムトークンを取得中...");
          try {
            const res = await fetch("/api/auth/firebase-custom-token");
            if (!res.ok) {
              const errorText = await res.text();
              console.error("Failed to fetch Firebase custom token:", res.status, errorText);
              return;
            }
            const data = await res.json();
            const customToken = data.token;

            if (customToken) {
              await signInWithCustomToken(auth, customToken);
              console.log("Firebase Authentication にサインイン成功！");
            }
          } catch (error) {
            console.error("Firebase Authentication サインインエラー:", error);
          }
        } else if (status === "unauthenticated" && auth.currentUser) {
          // NextAuth.jsセッションが切れ、Firebase Authにはまだログインしている場合
          // 必要であればここで Firebase Auth からもサインアウトする
          // await auth.signOut();
          console.log("NextAuth.jsセッションなし。Firebase Authentication からログアウトが必要かもしれません。");
        }
      }
      authenticateFirebase();
    }
  }, [session, status]); // 依存配列から auth を削除し、冒頭で null チェックを行う
  // auth オブジェクトは通常 useEffect の外部で初期化され、変化しないため依存配列から除外しても問題ないことが多い
  // もしauthがnullになりうる場合は、!authで早期returnするか、auth?.currentUserのようにオプショナルチェイニングを使う
  return <>{children}</>;
};