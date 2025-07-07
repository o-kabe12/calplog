"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/mypage/");
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          CalPlog
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Googleアカウントでログインしてください
        </p>
        <button
          onClick={() => signIn("google")}
          className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Googleでログイン
        </button>
      </div>
    </main>
  );
}
