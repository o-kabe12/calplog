export interface FoodItem {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  unitType?: 'g' | '個'; // 追加: 単位の種類
  perUnit?: number;      // 追加: 1個あたりのグラム数
}

export interface FoodEntry {
  foodId: string;
  quantityInGrams: number;
  calculatedCalories: number;
  calculatedProtein: number;
}

export interface DailyRecord {
  id: string;
  userId: string;
  date: string;
  foodEntries: FoodEntry[];
  totalCalories: number;
  totalProtein: number;
}
