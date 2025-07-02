"use client";
import Header from "../component/Header";

export default function Home() {

  return (
    <>
      <Header />
      <main className="py-8 px-4 max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-bold text-center mb-4">こんにちは！<br />マイページへようこそ</h1>
        <p className="text-center">ここでは、あなたのログの記録を確認できます。</p>
      </main>
    </>
  );
}