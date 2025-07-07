"use client";
import FoodCalculator from "./component/FoodCalculator";
import Header from "./component/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="py-12 px-6 max-w-[1200px] mx-auto w-full">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">
            CalPlog
          </h1>
          <p className="text-center text-gray-600 mb-12">
            １日のカロリーとタンパク質を簡単に計算・記録できるアプリです。
          </p>
          <FoodCalculator />
        </div>
      </main>
    </>
  );
}