import type { WizardMetaResponse } from "~/lib/api-types";
import type { WizardFormState } from "~/lib/wizard-state";
import styles from "./Step.module.css";

interface StepReviewProps {
  state: WizardFormState;
  meta: WizardMetaResponse;
}

export function StepReview({ state, meta }: StepReviewProps) {
  const goalLabel =
    meta.ridingGoals.find((g) => g.id === state.primaryGoal)?.label ??
    state.primaryGoal;
  const positionLabel =
    meta.ridingPositions.find((p) => p.id === state.ridingPosition)?.label ??
    state.ridingPosition;
  const featureLabels = state.featuresRequired.map(
    (id) => meta.availableFeatures.find((f) => f.id === id)?.label ?? id,
  );

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>5. Перевірте дані перед відправкою</h2>

      <div className={styles.summaryList}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Зріст / довжина ноги</span>
          <span className={styles.summaryValue}>
            {state.heightCm} см{" "}
            {state.inseamCm !== null ? `/ ${state.inseamCm} см` : ""}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Стать</span>
          <span className={styles.summaryValue}>{state.gender}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Бюджет</span>
          <span className={styles.summaryValue}>
            {state.minUah.toLocaleString("uk-UA")}–
            {state.maxUah.toLocaleString("uk-UA")} {meta.budgetLimits.currency}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Покриття</span>
          <span className={styles.summaryValue}>
            Асфальт {state.asphalt}% · Гравій {state.gravel}% · Бездоріжжя{" "}
            {state.offroad}%
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Посадка</span>
          <span className={styles.summaryValue}>{positionLabel}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Мета</span>
          <span className={styles.summaryValue}>{goalLabel}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Обов'язкові опції</span>
          <span className={styles.summaryValue}>
            {featureLabels.length > 0 ? featureLabels.join(", ") : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
