import type { WizardMetaResponse } from "~/lib/api-types";
import type { WizardFormState } from "~/lib/wizard-state";
import styles from "./Step.module.css";

interface StepUsageProps {
  state: WizardFormState;
  meta: WizardMetaResponse;
  onChange: (patch: Partial<WizardFormState>) => void;
}

type SurfaceKey = "asphalt" | "gravel" | "offroad";

export function StepUsage({ state, meta, onChange }: StepUsageProps) {
  const adjustSurface = (changed: SurfaceKey, nextValue: number) => {
    const current = {
      asphalt: state.asphalt,
      gravel: state.gravel,
      offroad: state.offroad,
    };
    const remaining = 100 - nextValue;
    const others = (Object.keys(current) as SurfaceKey[]).filter(
      (k) => k !== changed,
    );
    const sumOthers = others.reduce((acc, k) => acc + current[k], 0) || 1;

    const next: Record<SurfaceKey, number> = {
      ...current,
      [changed]: Math.max(0, nextValue),
    };
    let allocated = 0;
    others.forEach((k, idx) => {
      if (idx === others.length - 1) {
        next[k] = Math.max(0, remaining - allocated);
      } else {
        const share = Math.round((current[k] / sumOthers) * remaining);
        next[k] = Math.max(0, share);
        allocated += next[k];
      }
    });

    onChange({
      asphalt: next.asphalt,
      gravel: next.gravel,
      offroad: next.offroad,
    });
  };

  const total = Math.round(state.asphalt + state.gravel + state.offroad);

  return (
    <div className={styles.step}>
      <h2 className={styles.stepTitle}>
        3. Покриття катання та мета (разом {total}%)
      </h2>

      {meta.ridingSurfaces.map((surface) => (
        <div className={styles.field} key={surface.id}>
          <div className={styles.fieldRow}>
            <span className={styles.fieldLabel}>{surface.label}</span>
            <span className={styles.fieldValue}>{state[surface.id]}%</span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={0}
            max={100}
            value={state[surface.id]}
            onChange={(e) => adjustSurface(surface.id, Number(e.target.value))}
          />
        </div>
      ))}

      <div className={styles.grid2}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Бажана посадка</span>
          <select
            className={styles.select}
            value={state.ridingPosition}
            onChange={(e) =>
              onChange({
                ridingPosition: e.target
                  .value as WizardFormState["ridingPosition"],
              })
            }
          >
            {meta.ridingPositions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Головна мета</span>
          <select
            className={styles.select}
            value={state.primaryGoal}
            onChange={(e) =>
              onChange({
                primaryGoal: e.target.value as WizardFormState["primaryGoal"],
              })
            }
          >
            {meta.ridingGoals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
