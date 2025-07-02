import { FoodItem } from '../types';

export const sampleFoods: FoodItem[] = [
  {
    id: '2',
    name: 'ご飯（白米）',
    caloriesPer100g: 168,
    proteinPer100g: 2.5,
  },
  {
    id: '1',
    name: '鶏むね肉',
    caloriesPer100g: 195,
    proteinPer100g: 24,
  },
  {
    id: '13',
    name: '鶏もも肉（皮付き）',
    caloriesPer100g: 190,
    proteinPer100g: 16.6,
  },
  {
    id: '3',
    name: '卵',
    caloriesPer100g: 151,
    proteinPer100g: 12.3,
    unitType: '個', // 1個あたり
    perUnit: 50,   // 1個=50g換算
  },
  {
    id: '4',
    name: '豆腐',
    caloriesPer100g: 72,
    proteinPer100g: 6.6,
  },
  {
    id: '5',
    name: 'サーモン',
    caloriesPer100g: 208,
    proteinPer100g: 20.4,
  },
  {
    id: '6',
    name: 'ブロッコリー',
    caloriesPer100g: 33,
    proteinPer100g: 4.3,
  },
  {
    id: '7',
    name: 'アボカド',
    caloriesPer100g: 176,
    proteinPer100g: 2.5,
  },
  {
    id: '8',
    name: '牛乳',
    caloriesPer100g: 61,
    proteinPer100g: 3.3,
  },
  {
    id: '9',
    name: 'バナナ',
    caloriesPer100g: 86,
    proteinPer100g: 1.1,
  },
  {
    id: '10',
    name: '牛肉（もも肉、赤身）',
    caloriesPer100g: 165,
    proteinPer100g: 21.7,
  },
  {
    id: '11',
    name: '豚肉（もも肉、脂身つき）',
    caloriesPer100g: 221,
    proteinPer100g: 19.5,
  },
  {
    id: '12',
    name: '納豆',
    caloriesPer100g: 190,
    proteinPer100g: 16.5,
    unitType: '個', // 1パックあたり
    perUnit: 40,   // 1パック=40g換算
  },
];
