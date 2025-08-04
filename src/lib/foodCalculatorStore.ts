import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sampleFoods } from '../data/sampleFoods';
import { FoodEntryInput, FreeEntry, CalculationResult } from '../types';

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

// エントリの型定義は types/index.ts から import

// ストアの状態とアクション
interface FoodCalculatorStore {
  entries: FoodEntryInput[];
  freeEntries: FreeEntry[];
  result: CalculationResult | null;
  sampleFoods: typeof sampleFoods;
  
  // アクション
  addEntry: () => void;
  addFreeEntry: () => void;
  updateEntry: (index: number, key: keyof FoodEntryInput, value: string) => void;
  updateFreeEntry: (index: number, key: keyof FreeEntry, value: string) => void;
  removeEntry: (index: number) => void;
  removeFreeEntry: (index: number) => void;
  calculate: () => void;
  resetEntries: () => void;
}

export const useFoodCalculatorStore = create<FoodCalculatorStore>()(
  persist(
    (set, get) => ({
      entries: [{ foodId: sampleFoods[0]?.id || "", grams: "", units: "" }],
      freeEntries: [{ name: "", calories: "", protein: "" }],
      result: null,
      sampleFoods,

      addEntry: () => set(state => ({
        entries: [...state.entries, { foodId: sampleFoods[0]?.id || "", grams: "", units: "" }]
      })),

      addFreeEntry: () => set(state => ({
        freeEntries: [...state.freeEntries, { name: "", calories: "", protein: "" }]
      })),

      updateEntry: (index, key, value) => set(state => ({
        entries: state.entries.map((entry, i) => 
          i === index ? { ...entry, [key]: value } : entry
        )
      })),

      updateFreeEntry: (index, key, value) => set(state => ({
        freeEntries: state.freeEntries.map((entry, i) => 
          i === index ? { ...entry, [key]: value } : entry
        )
      })),

      removeEntry: (index) => set(state => ({
        entries: state.entries.filter((_, i) => i !== index)
      })),

      removeFreeEntry: (index) => set(state => ({
        freeEntries: state.freeEntries.filter((_, i) => i !== index)
      })),

      calculate: () => {
        const { entries, freeEntries } = get();
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

        set({
          result: { 
            calories: Math.round(totalCalories), 
            protein: Math.round(totalProtein * 10) / 10 
          }
        });
      },

      resetEntries: () => set({
        entries: [{ foodId: sampleFoods[0]?.id || "", grams: "", units: "" }],
        freeEntries: [{ name: "", calories: "", protein: "" }],
        result: null
      })
    }),
    {
      name: `calplog_entries_${getToday()}`, // 日付ベースのキー
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);