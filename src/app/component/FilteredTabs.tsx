export default function FilteredTabs({ recordMonthList, selectedMonth, handleMonthClick }:{ recordMonthList: string[], selectedMonth: string, handleMonthClick: (month: string) => void })
{
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <button 
        onClick={() => handleMonthClick("")}
        className={`rounded-3xl px-4 py-2 transition-colors duration-400 md:cursor-pointer ${selectedMonth === "" ? "bg-blue-600 text-white md:hover:bg-blue-500" : "bg-gray-100 md:hover:bg-gray-200"}`} 
      >
        全て
      </button>
      {recordMonthList.map((month) => (
        <button 
          onClick={() => handleMonthClick(month)}
          className={`rounded-3xl px-4 py-2 transition-colors duration-400 md:cursor-pointer ${selectedMonth === month ? "bg-blue-600 text-white md:hover:bg-blue-500" : "bg-gray-100 md:hover:bg-gray-200"}`} 
          key={month}
        >
          {month}
        </button>
      ))} 
    </div>
  )
}