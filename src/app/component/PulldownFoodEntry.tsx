import { useFoodCalculatorStore } from "@/lib/foodCalculatorStore";
import { FoodEntryInput } from "@/types";

export default function PulldownFoodEntry({ entries, updateEntry, removeEntry, addEntry }: { entries: FoodEntryInput[], updateEntry: (index: number, key: keyof FoodEntryInput, value: string) => void, removeEntry: (index: number) => void, addEntry: () => void }){
  const sampleFoods = useFoodCalculatorStore(state => state.sampleFoods);

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => {
        const food = sampleFoods.find(f => f.id === entry.foodId);
        const isUnit = food && food.unitType === '個';
        return (
          <div key={index} className="flex items-center gap-2 flex-wrap bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm">
            <select
              className="border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              value={entry.foodId}
              onChange={e => updateEntry(index, "foodId", e.target.value)}
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
                onChange={e => updateEntry(index, "units", e.target.value)}
              />
            ) : (
              <input
                type="number"
                min="0"
                className="border border-gray-200 rounded-lg px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                placeholder="g"
                value={entry.grams}
                onChange={e => updateEntry(index, "grams", e.target.value)}
              />
            )}
            <button
              type="button"
              className="ml-auto bg-red-500 text-white rounded-lg px-3 py-2 hover:bg-red-600 transition cursor-pointer"
              onClick={() => removeEntry(index)}
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
  )
}