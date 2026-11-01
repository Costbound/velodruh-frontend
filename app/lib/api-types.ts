// Types mirror the VeloDruh backend contracts (see velodruh-backend/api.md).

export type BikeCategory =
  | "GRAVEL"
  | "ROAD"
  | "MTB_HARDTAIL"
  | "CITY_COMMUTER"
  | "TOURING"
  | "HYBRID";

export type RiderGender = "UNISEX" | "MALE" | "FEMALE";
export type RidingPosition = "SPORT" | "COMFORTABLE" | "UPRIGHT";
export type FrameSizeLabel = "XS" | "S" | "M" | "L" | "XL";
export type BrakeType = "HYDRAULIC_DISC" | "MECHANICAL_DISC" | "RIM";
export type FrameMaterial = "ALUMINUM" | "CARBON" | "STEEL";
export type PrimaryGoal = "commuting" | "fitness" | "touring" | "recreation";
export type RequiredFeature =
  | "RACK_MOUNTS"
  | "FENDER_MOUNTS"
  | "DISC_BRAKES"
  | "HYDRAULIC_BRAKES"
  | "SUSPENSION_FORK";
export type BikeSortBy =
  | "price_asc"
  | "price_desc"
  | "weight_asc"
  | "year_desc";

export interface WizardMetaResponse {
  heightRange: { min: number; max: number; unit: "cm" };
  inseamRange: { min: number; max: number; unit: "cm" };
  budgetLimits: {
    min: number;
    max: number;
    defaultMin: number;
    defaultMax: number;
    currency: "UAH";
  };
  ridingSurfaces: Array<{
    id: "asphalt" | "gravel" | "offroad";
    label: string;
    icon: string;
  }>;
  ridingGoals: Array<{ id: PrimaryGoal; label: string }>;
  ridingPositions: Array<{ id: RidingPosition; label: string }>;
  availableFeatures: Array<{ id: RequiredFeature; label: string }>;
}

export interface WizardEvaluateRequest {
  rider: {
    heightCm: number;
    inseamCm?: number;
    gender: RiderGender;
  };
  budget: {
    minUah: number;
    maxUah: number;
  };
  usage: {
    surfaceProportions: {
      asphalt: number;
      gravel: number;
      offroad: number;
    };
    ridingPosition: RidingPosition;
    primaryGoal: PrimaryGoal;
    featuresRequired: RequiredFeature[];
  };
}

export interface CalculatedFrameSize {
  standardLabel: FrameSizeLabel;
  numericSize: number;
  unit: "cm";
  confidence: "HIGH" | "MEDIUM";
  sizeAdvice: string;
}

export interface RecommendedBikeFilters {
  category: BikeCategory;
  sizeLabel: FrameSizeLabel;
  riderHeightCm: number;
  gender: RiderGender;
  minPriceUah: number;
  maxPriceUah: number;
  ridingPosition: RidingPosition;
  brakeTypes?: BrakeType[];
  hasRackMounts?: boolean;
  hasFenderMounts?: boolean;
  suspensionFork?: boolean;
  inStockOnly: boolean;
}

export interface WizardEvaluateResponse {
  analysis: {
    recommendedCategory: {
      type: BikeCategory;
      displayName: string;
      reasoning: string;
    };
    calculatedFrameSize: CalculatedFrameSize;
  };
  recommendedFilters: RecommendedBikeFilters;
}

export interface BikeOfferDto {
  shopName: string;
  shopSlug: string;
  priceUah: number;
  oldPriceUah: number | null;
  inStock: boolean;
  productUrl: string;
  affiliateUrl: string;
  lastCheckedAt: string;
}

export interface BikeVariantDto {
  sizeLabel: FrameSizeLabel;
  numericSizeCm: number;
  minRiderHeightCm: number;
  maxRiderHeightCm: number;
  minInseamCm: number;
  maxInseamCm: number;
  stackMm: number;
  reachMm: number;
  offers: BikeOfferDto[];
}

export interface BikeDetailDto {
  slug: string;
  name: string;
  brand: {
    slug: string;
    name: string;
    logoUrl: string | null;
    country: string | null;
  };
  category: BikeCategory;
  modelYear: number;
  description: string;
  gender: RiderGender;
  specs: {
    brakeType: BrakeType;
    drivetrain: string;
    wheelSize: string;
    weightKg: number;
    frameMaterial: FrameMaterial;
    ridingPosition: RidingPosition;
    hasRackMounts: boolean;
    hasFenderMounts: boolean;
    suspensionFork: boolean;
  };
  surfaceProfile: {
    asphaltScore: number;
    gravelScore: number;
    offroadScore: number;
  };
  imageUrl: string | null;
  keyHighlights: string[];
  bestPriceUah: number;
  variants: BikeVariantDto[];
}

export interface BikeListFilters {
  category?: BikeCategory;
  brand?: string;
  sizeLabel?: FrameSizeLabel;
  riderHeightCm?: number;
  gender?: RiderGender;
  minPriceUah?: number;
  maxPriceUah?: number;
  brakeType?: BrakeType[];
  frameMaterial?: FrameMaterial;
  ridingPosition?: RidingPosition;
  wheelSize?: string;
  hasRackMounts?: boolean;
  hasFenderMounts?: boolean;
  suspensionFork?: boolean;
  maxWeightKg?: number;
  inStockOnly?: boolean;
  sortBy?: BikeSortBy;
}

export interface BikeListResponse {
  items: BikeDetailDto[];
  total: number;
  appliedFilters: Record<string, unknown>;
}

export interface ApiErrorBody {
  error: string;
  code?: string;
  details?: Array<{ path: string; message: string }>;
}
