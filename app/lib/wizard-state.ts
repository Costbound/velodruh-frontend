import type {
  FrameSizeLabel,
  PrimaryGoal,
  RequiredFeature,
  RiderGender,
  RidingPosition,
  WizardEvaluateRequest,
  WizardMetaResponse,
} from "./api-types";

export interface WizardFormState {
  heightCm: number;
  inseamCm: number | null;
  gender: RiderGender;
  minUah: number;
  maxUah: number;
  asphalt: number;
  gravel: number;
  offroad: number;
  ridingPosition: RidingPosition;
  primaryGoal: PrimaryGoal;
  featuresRequired: RequiredFeature[];
}

export function defaultWizardState(meta: WizardMetaResponse): WizardFormState {
  return {
    heightCm: Math.round((meta.heightRange.min + meta.heightRange.max) / 2),
    inseamCm: null,
    gender: "UNISEX",
    minUah: meta.budgetLimits.defaultMin,
    maxUah: meta.budgetLimits.defaultMax,
    asphalt: 60,
    gravel: 30,
    offroad: 10,
    ridingPosition: "COMFORTABLE",
    primaryGoal: meta.ridingGoals[0]?.id ?? "commuting",
    featuresRequired: [],
  };
}

export function toWizardEvaluateRequest(
  state: WizardFormState,
): WizardEvaluateRequest {
  return {
    rider: {
      heightCm: state.heightCm,
      inseamCm: state.inseamCm ?? undefined,
      gender: state.gender,
    },
    budget: {
      minUah: state.minUah,
      maxUah: state.maxUah,
    },
    usage: {
      surfaceProportions: {
        asphalt: state.asphalt,
        gravel: state.gravel,
        offroad: state.offroad,
      },
      ridingPosition: state.ridingPosition,
      primaryGoal: state.primaryGoal,
      featuresRequired: state.featuresRequired,
    },
  };
}

export function validateRiderStep(
  state: WizardFormState,
  meta: WizardMetaResponse,
): string[] {
  const errors: string[] = [];
  if (
    state.heightCm < meta.heightRange.min ||
    state.heightCm > meta.heightRange.max
  ) {
    errors.push(
      `Зріст має бути від ${meta.heightRange.min} до ${meta.heightRange.max} см`,
    );
  }
  if (
    state.inseamCm !== null &&
    (state.inseamCm < meta.inseamRange.min ||
      state.inseamCm > meta.inseamRange.max)
  ) {
    errors.push(
      `Довжина ноги має бути від ${meta.inseamRange.min} до ${meta.inseamRange.max} см`,
    );
  }
  return errors;
}

export function validateBudgetStep(
  state: WizardFormState,
  meta: WizardMetaResponse,
): string[] {
  const errors: string[] = [];
  if (
    state.minUah < meta.budgetLimits.min ||
    state.minUah > meta.budgetLimits.max
  ) {
    errors.push(
      `Мінімальна ціна має бути від ${meta.budgetLimits.min} до ${meta.budgetLimits.max}`,
    );
  }
  if (
    state.maxUah < meta.budgetLimits.min ||
    state.maxUah > meta.budgetLimits.max
  ) {
    errors.push(
      `Максимальна ціна має бути від ${meta.budgetLimits.min} до ${meta.budgetLimits.max}`,
    );
  }
  if (state.maxUah < state.minUah) {
    errors.push("Максимальна ціна має бути не меншою за мінімальну");
  }
  return errors;
}

export function validateUsageStep(state: WizardFormState): string[] {
  const errors: string[] = [];
  const sum = Math.round(state.asphalt + state.gravel + state.offroad);
  if (sum !== 100) {
    errors.push(`Сума покриттів має дорівнювати 100% (зараз ${sum}%)`);
  }
  return errors;
}

export const FRAME_SIZE_LABELS: FrameSizeLabel[] = ["XS", "S", "M", "L", "XL"];
