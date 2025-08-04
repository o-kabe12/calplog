import { FreeEntry } from "@/types";

export default function FreeFoodEntry({ freeEntries, updateFreeEntry, removeFreeEntry, addFreeEntry }: { freeEntries: FreeEntry[], updateFreeEntry: (index: number, key: keyof FreeEntry, value: string) => void, removeFreeEntry: (index: number) => void, addFreeEntry: () => void }){
  return (
    <>
      <div className="mt-8 mb-2 font-bold text-gray-900">自分で食材を入力</div>
      <div className="space-y-3">
        {freeEntries.map((entry, index) => (
          <div key={index} className="flex flex-wrap gap-2 items-end bg-white border border-gray-100 rounded-lg px-4 py-3 shadow-sm">
            <input
              className="block border border-gray-200 rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              placeholder="食材名"
              value={entry.name}
              onChange={e => updateFreeEntry(index, "name", e.target.value)}
            />
            <input
              type="number"
              min="0"
              className="border border-gray-200 rounded-lg px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              placeholder="カロリー"
              value={entry.calories}
              onChange={e => updateFreeEntry(index, "calories", e.target.value)}
            />
            <input
              type="number"
              min="0"
              className="border border-gray-200 rounded-lg px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              placeholder="たんぱく質"
              value={entry.protein}
              onChange={e => updateFreeEntry(index, "protein", e.target.value)}
            />
            <button
              type="button"
              className="ml-auto bg-red-500 text-white rounded-lg px-3 py-2 hover:bg-red-600 transition cursor-pointer"
              onClick={() => removeFreeEntry(index)}
            >－</button>
          </div>
        ))}
        <button
          type="button"
          className="w-full sm:w-auto bg-gray-900 text-white rounded-lg px-4 py-2 hover:bg-gray-800 transition font-semibold cursor-pointer"
          onClick={addFreeEntry}
        >＋ 自由入力欄を追加</button>
      </div>
    </>
  )
}