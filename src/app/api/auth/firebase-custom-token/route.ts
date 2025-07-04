import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/authOptions';

// Firebase Admin SDK の初期化に必要なモジュール
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// サービスアカウントキーの情報を個別の環境変数から読み込む
// Vercelに設定する環境変数名と一致させる
const FIREBASE_ADMIN_SDK_PROJECT_ID = process.env.FIREBASE_ADMIN_SDK_PROJECT_ID;
const FIREBASE_ADMIN_SDK_CLIENT_EMAIL = process.env.FIREBASE_ADMIN_SDK_CLIENT_EMAIL;
const FIREBASE_ADMIN_SDK_PRIVATE_KEY = process.env.FIREBASE_ADMIN_SDK_PRIVATE_KEY;

// Firebase Admin SDK を初期化する
// getApps().length で、既に初期化されている場合はスキップする
if (!getApps().length) {
  // すべての環境変数が設定されているかチェック
  if (!FIREBASE_ADMIN_SDK_PROJECT_ID || !FIREBASE_ADMIN_SDK_CLIENT_EMAIL || !FIREBASE_ADMIN_SDK_PRIVATE_KEY) {
    console.error("Firebase Admin SDK の環境変数が不足しています。デプロイ環境のVercelなどで設定されているか確認してください。");
    // 環境変数が設定されていない場合は、エラーを投げて初期化を中断
    throw new Error("Firebase Admin SDK の環境変数が設定されていません。");
  }

  try {
    // 個別の環境変数を使って cert() に渡すオブジェクトを生成
    initializeApp({
      credential: cert({
        projectId: FIREBASE_ADMIN_SDK_PROJECT_ID,
        clientEmail: FIREBASE_ADMIN_SDK_CLIENT_EMAIL,
        privateKey: FIREBASE_ADMIN_SDK_PRIVATE_KEY,
      }),
    });
    console.log("Firebase Admin SDK が正常に初期化されました。");
  } catch (e) {
    console.error("Firebase Admin SDK の初期化に失敗しました。プライベートキーの形式を確認してください。", e);
    // 初期化に失敗したら、ここでエラーを投げてAPIリクエストを失敗させる
    throw new Error("Firebase Admin SDK の初期化エラー: プライベートキーの形式が不正です。");
  }
}

// GET リクエストハンドラ
export async function GET(req: NextRequest) {
  try {
    // NextAuth.js のサーバーサイドセッションを取得
    const session = await getServerSession(authOptions);

    // セッションがない、またはユーザーのメールアドレスがない場合は認証エラーを返す
    if (!session || !session.user?.email) {
      console.warn('カスタムトークン生成リクエスト: ユーザーが認証されていません、またはメールアドレスがありません。');
      return NextResponse.json({ error: 'Unauthorized: User not authenticated or email missing.' }, { status: 401 });
    }

    // Firebase Admin SDK を使ってカスタムトークンを生成
    const customToken = await getAuth().createCustomToken(session.user.email, {
        email: session.user.email,
        email_verified: true,
    });

    // 生成したカスタムトークンをクライアントに返す
    return NextResponse.json({ token: customToken });

  } catch (error) {
    console.error('カスタムトークン生成中にエラーが発生しました:', error);
    if (error instanceof Error && error.message.includes("Firebase Admin SDK の初期化エラー")) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}