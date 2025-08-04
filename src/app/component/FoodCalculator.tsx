"use client";
import { useRef } from "react";
import { SaveButton } from "./SaveButton";
import { useFoodCalculatorStore } from "../../lib/foodCalculatorStore";
import PulldownFoodEntry from "./PulldownFoodEntry";
import FreeFoodEntry from "./FreeFoodEntry";

export default function FoodCalculator() {
  const {
    entries,
    freeEntries,
    result,
    addEntry,
    addFreeEntry,
    updateEntry,
    updateFreeEntry,
    removeEntry,
    removeFreeEntry,
    calculate
  } = useFoodCalculatorStore();

  const resultRef = useRef<HTMLDivElement | null>(null);

  // 計算処理を実行してスクロール
  const handleCalculate = () => {
    calculate();
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="mt-10 space-y-6 w-full sm:w-fit sm:min-w-[500px] mx-auto">

      <PulldownFoodEntry 
        entries={entries} 
        updateEntry={updateEntry} 
        removeEntry={removeEntry} 
        addEntry={addEntry} 
      />

      <FreeFoodEntry 
        freeEntries={freeEntries} 
        updateFreeEntry={updateFreeEntry} 
        removeFreeEntry={removeFreeEntry} 
        addFreeEntry={addFreeEntry} 
      />

      <button
        className="block w-full sm:w-auto mt-8 mx-auto bg-green-700 text-white rounded-lg px-6 py-3 font-bold hover:bg-green-800 transition text-lg cursor-pointer"
        onClick={handleCalculate}
      >出力</button>
      <div ref={resultRef} />
      {result && (
        <>
          <div className="mt-8 w-full bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
            <p className="text-xl font-bold text-center text-gray-900">
              総カロリー: <span className="text-green-700">{result.calories} kcal</span> ／ 総タンパク質: <span className="text-blue-700">{result.protein} g</span>
            </p>
          </div>
          <SaveButton result={result} />
        </>
      )}
    </div>
  );
}