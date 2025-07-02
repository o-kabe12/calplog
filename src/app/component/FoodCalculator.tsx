"use client";
import { sampleFoods } from "../../data/sampleFoods";
import { useState, useEffect } from "react";
import { SaveButton } from "./SaveButton";

// 今日の日付（YYYY-MM-DD）
const today = new Date().toISOString().slice(0, 10);
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

  // ローカルストレージから復元
  useEffect(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEY);
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    const savedFree = localStorage.getItem(STORAGE_FREE_KEY);
    if (savedFree) setFreeEntries(JSON.parse(savedFree));
  }, []);
  // ローカルストレージへ保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);
  useEffect(() => {
    localStorage.setItem(STORAGE_FREE_KEY, JSON.stringify(freeEntries));
  }, [freeEntries]);

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
  };

  return (
    <div className="mt-8 space-y-4 w-full sm:w-fit sm:min-w-[500px] mx-auto">
          {/* プルダウン入力欄 */}
          {entries.map((entry, index) => {
            const food = sampleFoods.find(f => f.id === entry.foodId);
            const isUnit = food && food.unitType === '個';
            return (
              <div key={index} className="flex items-center gap-2 flex-wrap">
                <select
                  className="border rounded px-2 py-1 w-full sm:w-auto"
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
                    className="border rounded px-2 py-1 w-24"
                    placeholder="個数"
                    value={entry.units || ""}
                    onChange={e => handleChange(index, "units", e.target.value)}
                  />
                ) : (
                  <input
                    type="number"
                    min="0"
                    className="border rounded px-2 py-1 w-24"
                    placeholder="グラム数"
                    value={entry.grams}
                    onChange={e => handleChange(index, "grams", e.target.value)}
                  />
                )}
                <button
                  type="button"
                  className="block bg-red-500 text-white rounded px-3 py-1 cursor-pointer hover:opacity-70 transition duration-300 ease-in-out"
                  onClick={() => setEntries(entries.filter((_, i) => i !== index))}
                >－</button>
              </div>
            );
          })}
          <button
            type="button"
            className="block bg-blue-500 text-white rounded px-3 py-1 cursor-pointer hover:opacity-70 transition duration-300 ease-in-out"
            onClick={addEntry}
            >＋ 食材を追加</button>

          {/* 自由入力欄 */}
          <div className="mt-6 mb-2 font-bold">自分で食材を入力</div>
          {freeEntries.map((entry, index) => (
            <div key={index} className="flex flex-wrap gap-2 items-end my-4">
              <input
                className="block w-full border rounded px-2 py-1 w-32"
                placeholder="食材名"
                value={entry.name}
                onChange={e => handleFreeChange(index, "name", e.target.value)}
              />
              <input
                type="number"
                min="0"
                className="border rounded px-2 py-1 w-28"
                placeholder="カロリー"
                value={entry.calories}
                onChange={e => handleFreeChange(index, "calories", e.target.value)}
              />
              <input
                type="number"
                min="0"
                className="border rounded px-2 py-1 w-28"
                placeholder="たんぱく質"
                value={entry.protein}
                onChange={e => handleFreeChange(index, "protein", e.target.value)}
              />
              <button
                type="button"
                className="block bg-red-500 text-white rounded px-3 py-1 cursor-pointer hover:opacity-70 transition duration-300 ease-in-out"
                onClick={() => setFreeEntries(freeEntries.filter((_, i) => i !== index))}
              >－</button>
            </div>
          ))}
          <button
            type="button"
            className="block bg-orange-500 text-white rounded px-3 py-1 cursor-pointer hover:opacity-70 transition duration-300 ease-in-out"
            onClick={addFreeEntry}
          >＋ 自由入力欄を追加</button>

          <button
            className="block mt-6 mx-auto bg-green-600 text-white rounded px-4 py-2 cursor-pointer hover:opacity-70 transition duration-300 ease-in-out"
            onClick={handleCalculate}
          >出力</button>
          {result && (
            <>
              <div className="mt-6 w-full bg-gray-100 p-4 rounded">
                <p className="text-lg font-bold text-center">
                  総カロリー: {result.calories} kcal ／ 総タンパク質: {result.protein} g
                </p>
              </div>
              <SaveButton result={result} />
            </>
          )}
    </div>
  );
}