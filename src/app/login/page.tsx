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
    <main className="flex flex-col items-center gap-10 justify-center h-screen">
      <h1 className="text-3xl font-bold text-center">CalPlog</h1>
      <p>Googleアカウントでログインしてください</p>
      <button
        onClick={() => signIn("google")}
        className="bg-blue-500 text-white rounded p-2 cursor-pointer hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Googleでログイン
      </button>
    </main>
  );
}
