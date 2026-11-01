import type { WizardMetaResponse } from "~/lib/api-types";
import type { WizardFormState } from "~/lib/wizard-state";
import styles from "./Step.module.css";

interface StepRiderProps {
  state: WizardFormState;
  meta: WizardMetaResponse;
  onChange: (patch: Partial<WizardFormState>) => void;
}

const GENDERS: Array<{ id: WizardFormState["gender"]; label: string }> = [
  { id: "UNISEX", label: "Унісекс" },
  { id: "MALE", label: "Чоловіча" },
  { id: "FEMALE", label: "Жіноча" },
];

export function StepRider({ state, meta, onChange }: StepRiderProps) {
  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>1. Фізичні параметри</h2>

      <div className={styles.field}>
        <div className={styles.fieldRow}>
          <span className={styles.fieldLabel}>Зріст</span>
          <span className={styles.fieldValue}>{state.heightCm} см</span>
        </div>
        <input
          type="range"
          className={styles.slider}
          min={meta.heightRange.min}
          max={meta.heightRange.max}
          value={state.heightCm}
          onChange={(e) => onChange({ heightCm: Number(e.target.value) })}
        />
      </div>

      <div className={styles.field}>
        <div className={styles.fieldRow}>
          <span className={styles.fieldLabel}>
            Довжина ноги (inseam), опціонально
          </span>
          <span className={styles.fieldValue}>
            {state.inseamCm !== null ? `${state.inseamCm} см` : "не вказано"}
          </span>
        </div>
        <input
          type="range"
          className={styles.slider}
          min={meta.inseamRange.min}
          max={meta.inseamRange.max}
          value={
            state.inseamCm ??
            Math.round((meta.inseamRange.min + meta.inseamRange.max) / 2)
          }
          onChange={(e) => onChange({ inseamCm: Number(e.target.value) })}
        />
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>Стать</span>
        <div className={styles.pillGroup}>
          {GENDERS.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`${styles.pill} ${state.gender === g.id ? styles.pillActive : ""}`}
              onClick={() => onChange({ gender: g.id })}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
