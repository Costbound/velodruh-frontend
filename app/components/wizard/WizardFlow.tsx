import { useState } from "react";
import {
  bikeFiltersToSearchParams,
  evaluateWizard,
  recommendedFiltersToBikeFilters,
} from "~/lib/api-client";
import type {
  WizardEvaluateResponse,
  WizardMetaResponse,
} from "~/lib/api-types";
import {
  defaultWizardState,
  toWizardEvaluateRequest,
  validateBudgetStep,
  validateRiderStep,
  validateUsageStep,
  type WizardFormState,
} from "~/lib/wizard-state";
import { StepBudget } from "./StepBudget";
import { StepFeatures } from "./StepFeatures";
import { StepReview } from "./StepReview";
import { StepRider } from "./StepRider";
import { StepUsage } from "./StepUsage";
import { WizardResults } from "./WizardResults";
import { WizardStepper } from "./WizardStepper";
import styles from "./Wizard.module.css";

const STEP_LABELS = ["Параметри", "Бюджет", "Покриття", "Опції", "Підсумок"];

interface WizardFlowProps {
  meta: WizardMetaResponse;
  onSearchCatalog: (searchParams: URLSearchParams) => void;
  onSubmitError: (message: string) => void;
}

export function WizardFlow({
  meta,
  onSearchCatalog,
  onSubmitError,
}: WizardFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [state, setState] = useState<WizardFormState>(() =>
    defaultWizardState(meta),
  );
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<WizardEvaluateResponse | null>(
    null,
  );

  const update = (patch: Partial<WizardFormState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const validateCurrentStep = (): boolean => {
    let errors: string[] = [];
    if (stepIndex === 0) errors = validateRiderStep(state, meta);
    if (stepIndex === 1) errors = validateBudgetStep(state, meta);
    if (stepIndex === 2) errors = validateUsageStep(state);
    setStepErrors(errors);
    return errors.length === 0;
  };

  const goNext = () => {
    if (!validateCurrentStep()) return;
    setStepErrors([]);
    setStepIndex((i) => Math.min(i + 1, STEP_LABELS.length - 1));
  };

  const goBack = () => {
    setStepErrors([]);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    onSubmitError("");
    try {
      const result = await evaluateWizard(toWizardEvaluateRequest(state));
      setEvaluation(result);
    } catch (e) {
      onSubmitError(
        e instanceof Error ? e.message : "Не вдалося обробити анкету",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (evaluation) {
    return (
      <div className={styles.card}>
        <WizardResults
          evaluation={evaluation}
          onSearchCatalog={(filters) => {
            onSearchCatalog(
              bikeFiltersToSearchParams(
                recommendedFiltersToBikeFilters(filters),
              ),
            );
          }}
          onRestart={() => setEvaluation(null)}
        />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <WizardStepper labels={STEP_LABELS} currentIndex={stepIndex} />

      <div className={styles.stepBody}>
        {stepIndex === 0 && (
          <StepRider state={state} meta={meta} onChange={update} />
        )}
        {stepIndex === 1 && (
          <StepBudget state={state} meta={meta} onChange={update} />
        )}
        {stepIndex === 2 && (
          <StepUsage state={state} meta={meta} onChange={update} />
        )}
        {stepIndex === 3 && (
          <StepFeatures state={state} meta={meta} onChange={update} />
        )}
        {stepIndex === 4 && <StepReview state={state} meta={meta} />}
      </div>

      {stepErrors.length > 0 && (
        <ul className={styles.errorList}>
          {stepErrors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      <div className={styles.nav}>
        <button
          type="button"
          className={styles.navBack}
          onClick={goBack}
          disabled={stepIndex === 0 || submitting}
        >
          Назад
        </button>

        {stepIndex < STEP_LABELS.length - 1 ? (
          <button type="button" className={styles.navNext} onClick={goNext}>
            Далі
          </button>
        ) : (
          <button
            type="button"
            className={styles.navNext}
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Обробка…" : "Отримати рекомендації"}
          </button>
        )}
      </div>
    </div>
  );
}
