import type { WizardMetaResponse } from "~/lib/api-types";
import type { WizardFormState } from "~/lib/wizard-state";
import styles from "./Step.module.css";

interface StepFeaturesProps {
  state: WizardFormState;
  meta: WizardMetaResponse;
  onChange: (patch: Partial<WizardFormState>) => void;
}

export function StepFeatures({ state, meta, onChange }: StepFeaturesProps) {
  const toggle = (id: WizardFormState["featuresRequired"][number]) => {
    const isSelected = state.featuresRequired.includes(id);
    onChange({
      featuresRequired: isSelected
        ? state.featuresRequired.filter((f) => f !== id)
        : [...state.featuresRequired, id],
    });
  };

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>4. Обов'язкові опції</h2>

      <div className={styles.checkGrid}>
        {meta.availableFeatures.map((feature) => (
          <label key={feature.id} className={styles.checkLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={state.featuresRequired.includes(feature.id)}
              onChange={() => toggle(feature.id)}
            />
            <span>{feature.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
