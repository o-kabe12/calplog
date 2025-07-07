"use client";
import { sampleFoods } from "../../data/sampleFoods";
import { useState, useEffect, useRef } from "react";
import { SaveButton } from "./SaveButton";

// 今日の日付（YYYY-MM-DD、日本時間）
const getToday = () => {
  if (typeof window !== "undefined") {
    const todayStr = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replaceAll("/", "-");
    if (!window.name.startsWith("calplog_date_")) {
      window.name = `calplog_date_${todayStr}`;
    }
    return window.name.replace("calplog_date_", "");
  }
  // SSR時も日本時間で返す
  return new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replaceAll("/", "-");
};
const today = getToday();
const STORAGE_KEY = `calplog_entries_${today}`;
const STORAGE_FREE_KEY = `calplog_freeEntries_${today}`;

export default function FoodCalculator() {

  // プルダウン入力行
  const [entries, setEntries] = useState([
    { foodId: sampleFoods[0]?.id || "", grams: "", units: "" }
  ]);

  // 自由入力行
  const [freeEntries, setFreeEntries] = useState([
    { name: "", calories: "", protein: "" }
  ]);

  const [result, setResult] = useState<{ calories: number; protein: number } | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  // ローカルストレージから復元
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEntries = window.localStorage.getItem(STORAGE_KEY);
      if (savedEntries) setEntries(JSON.parse(savedEntries));
      const savedFree = window.localStorage.getItem(STORAGE_FREE_KEY);
      if (savedFree) setFreeEntries(JSON.parse(savedFree));
    }
  }, []);

  // ローカルストレージへ保存（出力ボタンでのみ保存）
  const saveToLocalStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    localStorage.setItem(STORAGE_FREE_KEY, JSON.stringify(freeEntries));
  };

  // プルダウン行追加
  const addEntry = () => {
    setEntries([
      ...entries,
      { foodId: sampleFoods[0]?.id || "", grams: "", units: "" }
    ]);
  };
  // 自由入力行追加
  const addFreeEntry = () => {
    setFreeEntries([...freeEntries, { name: "", calories: "", protein: "" }]);
  };

  // プルダウン行変更
  const handleChange = (index: number, key: "foodId" | "grams" | "units", value: string) => {
    const newEntries = [...entries];
    newEntries[index][key] = value;
    setEntries(newEntries);
  };
  // 自由入力行変更
  const handleFreeChange = (index: number, key: "name" | "calories" | "protein", value: string) => {
    const newFree = [...freeEntries];
    newFree[index][key] = value;
    setFreeEntries(newFree);
  };

  // 計算
  const handleCalculate = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    // プルダウン分
    entries.forEach(entry => {
      const food = sampleFoods.find(f => f.id === entry.foodId);
      if (!food) return;
      // 個数入力タイプ
      if (food.unitType === '個' && food.perUnit) {
        const units = parseFloat(entry.units);
        if (!isNaN(units)) {
          const grams = food.perUnit * units;
          totalCalories += (food.caloriesPer100g * grams) / 100;
          totalProtein += (food.proteinPer100g * grams) / 100;
        }
      } else {
        // グラム入力タイプ
        const grams = parseFloat(entry.grams);
        if (!isNaN(grams)) {
          totalCalories += (food.caloriesPer100g * grams) / 100;
          totalProtein += (food.proteinPer100g * grams) / 100;
        }
      }
    });
    // 自由入力分
    freeEntries.forEach(entry => {
      const cal = parseFloat(entry.calories);
      const pro = parseFloat(entry.protein);
      if (entry.name && !isNaN(cal) && !isNaN(pro)) {
        totalCalories += cal;
        totalProtein += pro;
      }
    });
    setResult({ calories: Math.round(totalCalories), protein: Math.round(totalProtein * 10) / 10 });
    saveToLocalStorage();
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="mt-10 space-y-6 w-full sm:w-fit sm:min-w-[500px] mx-auto">
      {/* プルダウン入力欄 */}
      <div className="space-y-3">
        {entries.map((entry, index) => {
          const food = sampleFoods.find(f => f.id === entry.foodId);
          const isUnit = food && food.unitType === '個';
          return (
            <div key={index} className="flex items-center gap-2 flex-wrap bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm">
              <select
                className="border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                value={entry.foodId}
                onChange={e => handleChange(index, "foodId", e.target.value)}
              >
                {sampleFoods.map(food => (
                  <option key={food.id} value={food.id}>{food.name}</option>
                ))}
              </select>
              {isUnit ? (
                <input
                  type="number"
                  min="0"
                  className="border border-gray-200 rounded-lg px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                  placeholder="個数"
                  value={entry.units || ""}
                  onChange={e => handleChange(index, "units", e.target.value)}
                />
              ) : (
                <input
                  type="number"
                  min="0"
                  className="border border-gray-200 rounded-lg px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                  placeholder="g"
                  value={entry.grams}
                  onChange={e => handleChange(index, "grams", e.target.value)}
                />
              )}
              <button
                type="button"
                className="ml-auto bg-red-500 text-white rounded-lg px-3 py-2 hover:bg-red-600 transition cursor-pointer"
                onClick={() => setEntries(entries.filter((_, i) => i !== index))}
              >－</button>
            </div>
          );
        })}
        <button
          type="button"
          className="w-full sm:w-auto bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition font-semibold cursor-pointer"
          onClick={addEntry}
        >＋ 食材を追加</button>
      </div>

      {/* 自由入力欄 */}
      <div className="mt-8 mb-2 font-bold text-gray-900">自分で食材を入力</div>
      <div className="space-y-3">
        {freeEntries.map((entry, index) => (
          <div key={index} className="flex flex-wrap gap-2 items-end bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm">
            <input
              className="block border border-gray-200 rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              placeholder="食材名"
              value={entry.name}
              onChange={e => handleFreeChange(index, "name", e.target.value)}
            />
            <input
              type="number"
              min="0"
              className="border border-gray-200 rounded-lg px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              placeholder="カロリー"
              value={entry.calories}
              onChange={e => handleFreeChange(index, "calories", e.target.value)}
            />
            <input
              type="number"
              min="0"
              className="border border-gray-200 rounded-lg px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              placeholder="たんぱく質"
              value={entry.protein}
              onChange={e => handleFreeChange(index, "protein", e.target.value)}
            />
            <button
              type="button"
              className="ml-auto bg-red-500 text-white rounded-lg px-3 py-2 hover:bg-red-600 transition cursor-pointer"
              onClick={() => setFreeEntries(freeEntries.filter((_, i) => i !== index))}
            >－</button>
          </div>
        ))}
        <button
          type="button"
          className="w-full sm:w-auto bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition font-semibold cursor-pointer"
          onClick={addFreeEntry}
        >＋ 自由入力欄を追加</button>
      </div>

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