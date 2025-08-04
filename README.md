# CalPlog (カロリーとタンパク質を出力するアプリ)

食材と数を選択して、カロリーとタンパク質を出力

## 技術スタック
- Next.js (v15.3.4)
- TypeScript (v5)
- Tailwind CSS (v4)
- NextAuth.js (v4.24.11)
- Firebase (v11.10.0)
- Zustand (v5.0.7)
- React Toastify (v11.0.5)
- SWR (v2.3.4)

## 仕様
- 食材とその数を選択して、カロリーとタンパク質を計算・出力します。
- NextAuth.js（Google認証）を使用してユーザー認証を行います。
- Firebase Firestoreを使用してデータベース機能を提供します。
- Zustandを使用してローカルストレージでの状態管理を行います。
- React Toastifyを使用して保存できたかの通知を表示します。
- SWRを使用してデータフェッチを行います。