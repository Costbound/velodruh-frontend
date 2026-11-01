import type { WizardMetaResponse } from "~/lib/api-types";
import type { WizardFormState } from "~/lib/wizard-state";
import styles from "./Step.module.css";

interface StepBudgetProps {
  state: WizardFormState;
  meta: WizardMetaResponse;
  onChange: (patch: Partial<WizardFormState>) => void;
}

export function StepBudget({ state, meta, onChange }: StepBudgetProps) {
  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>
        2. Бюджет ({meta.budgetLimits.currency})
      </h2>

      <div className={styles.grid2}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Мінімальна ціна</span>
          <input
            type="number"
            className={styles.numberInput}
            min={meta.budgetLimits.min}
            max={meta.budgetLimits.max}
            step={1000}
            value={state.minUah}
            onChange={(e) => onChange({ minUah: Number(e.target.value) })}
          />
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Максимальна ціна</span>
          <input
            type="number"
            className={styles.numberInput}
            min={meta.budgetLimits.min}
            max={meta.budgetLimits.max}
            step={1000}
            value={state.maxUah}
            onChange={(e) => onChange({ maxUah: Number(e.target.value) })}
          />
        </div>
      </div>
      <p className={styles.fieldLabel}>
        Допустимий діапазон: {meta.budgetLimits.min.toLocaleString("uk-UA")}–
        {meta.budgetLimits.max.toLocaleString("uk-UA")}{" "}
        {meta.budgetLimits.currency}
      </p>
    </div>
  );
}
