import type {
  BikeCategory,
  BikeSortBy,
  BrakeType,
  FrameMaterial,
  FrameSizeLabel,
  RiderGender,
  RidingPosition,
} from "./api-types";

export const CATEGORY_OPTIONS: Array<{ value: BikeCategory; label: string }> = [
  { value: "GRAVEL", label: "Гравійний (Gravel)" },
  { value: "ROAD", label: "Шосейний (Road)" },
  { value: "MTB_HARDTAIL", label: "Гірський хардтейл (MTB)" },
  { value: "CITY_COMMUTER", label: "Міський ком'ютер" },
  { value: "TOURING", label: "Туринговий" },
  { value: "HYBRID", label: "Гібрид" },
];

export const GENDER_OPTIONS: Array<{ value: RiderGender; label: string }> = [
  { value: "UNISEX", label: "Унісекс" },
  { value: "MALE", label: "Чоловіча" },
  { value: "FEMALE", label: "Жіноча" },
];

export const SIZE_LABEL_OPTIONS: FrameSizeLabel[] = ["XS", "S", "M", "L", "XL"];

export const BRAKE_TYPE_OPTIONS: Array<{ value: BrakeType; label: string }> = [
  { value: "HYDRAULIC_DISC", label: "Гідравлічні дискові" },
  { value: "MECHANICAL_DISC", label: "Механічні дискові" },
  { value: "RIM", label: "Ободні" },
];

export const FRAME_MATERIAL_OPTIONS: Array<{
  value: FrameMaterial;
  label: string;
}> = [
  { value: "ALUMINUM", label: "Алюміній" },
  { value: "CARBON", label: "Карбон" },
  { value: "STEEL", label: "Сталь" },
];

export const RIDING_POSITION_OPTIONS: Array<{
  value: RidingPosition;
  label: string;
}> = [
  { value: "SPORT", label: "Спортивна" },
  { value: "COMFORTABLE", label: "Комфортна" },
  { value: "UPRIGHT", label: "Вертикальна" },
];

export const SORT_BY_OPTIONS: Array<{ value: BikeSortBy; label: string }> = [
  { value: "price_asc", label: "Ціна: спочатку дешевші" },
  { value: "price_desc", label: "Ціна: спочатку дорожчі" },
  { value: "weight_asc", label: "Вага: спочатку легші" },
  { value: "year_desc", label: "Рік: спочатку новіші" },
];
