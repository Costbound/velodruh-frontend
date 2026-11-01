import type {
  ApiErrorBody,
  BikeDetailDto,
  BikeListFilters,
  BikeListResponse,
  RecommendedBikeFilters,
  WizardEvaluateRequest,
  WizardEvaluateResponse,
  WizardMetaResponse,
} from "./api-types";
import { env } from "./env";

const API_BASE_URL = env.VELODRUH_API_BASE_URL.replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: ApiErrorBody["details"];

  constructor(status: number, body: Partial<ApiErrorBody>) {
    super(body.error ?? `HTTP ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.details = body.details;
  }
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const raw = await response.text();
  const body = raw ? JSON.parse(raw) : {};

  if (!response.ok) {
    throw new ApiError(response.status, body as Partial<ApiErrorBody>);
  }

  return body as T;
}

export function fetchWizardMeta(): Promise<WizardMetaResponse> {
  return apiRequest<WizardMetaResponse>("/api/v1/wizard/meta");
}

export function evaluateWizard(
  payload: WizardEvaluateRequest,
): Promise<WizardEvaluateResponse> {
  return apiRequest<WizardEvaluateResponse>("/api/v1/wizard/evaluate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function searchBikes(
  filters: BikeListFilters,
): Promise<BikeListResponse> {
  const qs = bikeFiltersToSearchParams(filters);
  const query = qs.toString();
  return apiRequest<BikeListResponse>(
    `/api/v1/bikes${query ? `?${query}` : ""}`,
  );
}

export function fetchBikeDetail(slug: string): Promise<BikeDetailDto> {
  return apiRequest<BikeDetailDto>(`/api/v1/bikes/${encodeURIComponent(slug)}`);
}

/** Converts typed bike filters into the query string shape expected by GET /api/v1/bikes. */
export function bikeFiltersToSearchParams(
  filters: BikeListFilters,
): URLSearchParams {
  const params = new URLSearchParams();
  const set = (key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length === 0) return;
      params.set(key, value.join(","));
      return;
    }
    params.set(key, String(value));
  };

  set("category", filters.category);
  set("brand", filters.brand);
  set("sizeLabel", filters.sizeLabel);
  set("riderHeightCm", filters.riderHeightCm);
  set("gender", filters.gender);
  set("minPriceUah", filters.minPriceUah);
  set("maxPriceUah", filters.maxPriceUah);
  set("brakeType", filters.brakeType);
  set("frameMaterial", filters.frameMaterial);
  set("ridingPosition", filters.ridingPosition);
  set("wheelSize", filters.wheelSize);
  set("hasRackMounts", filters.hasRackMounts);
  set("hasFenderMounts", filters.hasFenderMounts);
  set("suspensionFork", filters.suspensionFork);
  set("maxWeightKg", filters.maxWeightKg);
  set("inStockOnly", filters.inStockOnly);
  set("sortBy", filters.sortBy);

  return params;
}

/** Maps the wizard's recommendedFilters shape onto the GET /api/v1/bikes filter shape. */
export function recommendedFiltersToBikeFilters(
  filters: RecommendedBikeFilters,
): BikeListFilters {
  return {
    category: filters.category,
    sizeLabel: filters.sizeLabel,
    riderHeightCm: filters.riderHeightCm,
    gender: filters.gender,
    minPriceUah: filters.minPriceUah,
    maxPriceUah: filters.maxPriceUah,
    ridingPosition: filters.ridingPosition,
    brakeType: filters.brakeTypes,
    hasRackMounts: filters.hasRackMounts,
    hasFenderMounts: filters.hasFenderMounts,
    suspensionFork: filters.suspensionFork,
    inStockOnly: filters.inStockOnly,
    sortBy: "price_asc",
  };
}

/** Parses a URLSearchParams (from the current route URL) back into typed bike filters. */
export function searchParamsToBikeFilters(
  params: URLSearchParams,
): BikeListFilters {
  const getBool = (key: string): boolean | undefined => {
    const v = params.get(key);
    if (v === null) return undefined;
    return v === "true" || v === "1";
  };
  const getNum = (key: string): number | undefined => {
    const v = params.get(key);
    if (v === null || v === "") return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  };

  return {
    category:
      (params.get("category") as BikeListFilters["category"]) ?? undefined,
    brand: params.get("brand") ?? undefined,
    sizeLabel:
      (params.get("sizeLabel") as BikeListFilters["sizeLabel"]) ?? undefined,
    riderHeightCm: getNum("riderHeightCm"),
    gender: (params.get("gender") as BikeListFilters["gender"]) ?? undefined,
    minPriceUah: getNum("minPriceUah"),
    maxPriceUah: getNum("maxPriceUah"),
    brakeType: params.get("brakeType")
      ? (params.get("brakeType")!.split(",") as BikeListFilters["brakeType"])
      : undefined,
    frameMaterial:
      (params.get("frameMaterial") as BikeListFilters["frameMaterial"]) ??
      undefined,
    ridingPosition:
      (params.get("ridingPosition") as BikeListFilters["ridingPosition"]) ??
      undefined,
    wheelSize: params.get("wheelSize") ?? undefined,
    hasRackMounts: getBool("hasRackMounts"),
    hasFenderMounts: getBool("hasFenderMounts"),
    suspensionFork: getBool("suspensionFork"),
    maxWeightKg: getNum("maxWeightKg"),
    inStockOnly: getBool("inStockOnly"),
    sortBy: (params.get("sortBy") as BikeListFilters["sortBy"]) ?? undefined,
  };
}
