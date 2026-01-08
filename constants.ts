export const PREDEFINED_LOCATIONS: string[] = [
  "مقر ساهر - ابوظبي - عمارات",
  "مقر ساهر - أبوظبي - فيلا مدينة خليفة",
  "مقر ساهر - دبي - ابن سينا مول",
  "مقرات ساهر - أخرى"
];

export const CURRENT_YEAR: number = new Date().getFullYear();
export const END_YEAR: number = 2060;
export const YEARS: number[] = Array.from({ length: END_YEAR - CURRENT_YEAR + 1 }, (_, i) => CURRENT_YEAR + i);
