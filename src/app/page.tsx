"use client";
import FoodCalculator from "./component/FoodCalculator";
import Header from "./component/Header";

export default function Home() {

  return (
    <>
      <Header />
      <main className="py-8 px-4 max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">CalPlog</h1>
        <p className="text-center">１日のカロリーとタンパク質を簡単に計算・記録できるアプリです。</p>
        <FoodCalculator />
      </main>
    </>
  );
}