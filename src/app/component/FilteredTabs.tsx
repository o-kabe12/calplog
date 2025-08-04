interface FilteredTabsProps {
  recordMonthList: string[];
  selectedMonth: string;
  handleMonthClick: (month: string) => void;
  filterAllValue: string;
}

export default function FilteredTabs({ 
  recordMonthList, 
  selectedMonth, 
  handleMonthClick, 
  filterAllValue 
}: FilteredTabsProps) {
  const getButtonStyles = (isActive: boolean) => {
    const baseStyles = "rounded-3xl px-4 py-2 transition-colors duration-400 md:cursor-pointer";
    const activeStyles = "bg-blue-600 text-white md:hover:bg-blue-500";
    const inactiveStyles = "bg-gray-100 md:hover:bg-gray-200";
    
    return `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`;
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <button 
        onClick={() => handleMonthClick(filterAllValue)}
        className={getButtonStyles(selectedMonth === filterAllValue)}
      >
        全て
      </button>
      {recordMonthList.map((month) => (
        <button 
          key={month}
          onClick={() => handleMonthClick(month)}
          className={getButtonStyles(selectedMonth === month)}
        >
          {month}
        </button>
      ))} 
    </div>
  );
}