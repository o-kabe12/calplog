import { RecordType } from "@/types";

export default function RecordCard({ record }: { record: RecordType }){
  return (
    <div
    key={record.date}
    className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:border-gray-200 transition-colors duration-200"
    >
      <h3 className="text-sm font-medium text-gray-500 mb-3">
        記録日: {record.date}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">
            総摂取カロリー
          </div>
          <div className="text-xl font-bold text-gray-900">
            {record.calories}
            <span className="text-base font-medium ml-1">kcal</span>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">総タンパク質</div>
          <div className="text-xl font-bold text-gray-900">
            {record.protein}
            <span className="text-base font-medium ml-1">g</span>
          </div>
        </div>
      </div>
    </div>
  )
}