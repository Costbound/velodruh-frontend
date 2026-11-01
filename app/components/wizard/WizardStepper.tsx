import styles from "./WizardStepper.module.css";

interface WizardStepperProps {
  labels: string[];
  currentIndex: number;
}

export function WizardStepper({ labels, currentIndex }: WizardStepperProps) {
  return (
    <ol className={styles.stepper} aria-label="Кроки опитувальника">
      {labels.map((label, i) => {
        const state =
          i < currentIndex ? "done" : i === currentIndex ? "active" : "pending";
        return (
          <li key={label} className={styles.step} data-state={state}>
            <span className={styles.bullet}>
              {i < currentIndex ? "✓" : i + 1}
            </span>
            <span className={styles.label}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
