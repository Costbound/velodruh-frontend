import { useState } from "react";
import {
  BRAKE_TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  GENDER_OPTIONS,
  RIDING_POSITION_OPTIONS,
  SIZE_LABEL_OPTIONS,
} from "~/lib/bike-filter-options";
import type {
  BrakeType,
  RecommendedBikeFilters,
  WizardEvaluateResponse,
} from "~/lib/api-types";
import styles from "./WizardResults.module.css";

interface WizardResultsProps {
  evaluation: WizardEvaluateResponse;
  onSearchCatalog: (filters: RecommendedBikeFilters) => void;
  onRestart: () => void;
}

export function WizardResults({
  evaluation,
  onSearchCatalog,
  onRestart,
}: WizardResultsProps) {
  const { analysis } = evaluation;
  const [filters, setFilters] = useState<RecommendedBikeFilters>(
    evaluation.recommendedFilters,
  );

  const set = <K extends keyof RecommendedBikeFilters>(
    key: K,
    value: RecommendedBikeFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleBrakeType = (value: BrakeType) => {
    const current = filters.brakeTypes ?? [];
    set(
      "brakeTypes",
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  };

  return (
    <div className={styles.results}>
      <div className={styles.analysisGrid}>
        <div className={styles.analysisCard}>
          <div className={styles.analysisLabel}>
            Рекомендований клас велосипеда
          </div>
          <div className={styles.analysisTitle}>
            {analysis.recommendedCategory.displayName}
          </div>
          <p className={styles.analysisText}>
            {analysis.recommendedCategory.reasoning}
          </p>
        </div>

        <div className={styles.analysisCard}>
          <div className={styles.analysisLabel}>Розмір рами</div>
          <div className={styles.analysisTitle}>
            {analysis.calculatedFrameSize.standardLabel}{" "}
            <span className={styles.analysisSub}>
              ({analysis.calculatedFrameSize.numericSize}{" "}
              {analysis.calculatedFrameSize.unit})
            </span>
          </div>
          <p className={styles.analysisText}>
            {analysis.calculatedFrameSize.sizeAdvice}
          </p>
          <span
            className={styles.confidenceBadge}
            data-level={analysis.calculatedFrameSize.confidence}
          >
            Точність:{" "}
            {analysis.calculatedFrameSize.confidence === "HIGH"
              ? "висока"
              : "середня"}
          </span>
        </div>
      </div>

      <div className={styles.paramsCard}>
        <h3 className={styles.paramsTitle}>Параметри підібраного велосипеда</h3>
        <p className={styles.paramsHint}>
          Можете скоригувати параметри перед пошуком у каталозі.
        </p>

        <div className={styles.paramsGrid}>
          <label className={styles.paramField}>
            <span className={styles.paramLabel}>Категорія</span>
            <select
              className={styles.select}
              value={filters.category}
              onChange={(e) =>
                set(
                  "category",
                  e.target.value as RecommendedBikeFilters["category"],
                )
              }
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.paramField}>
            <span className={styles.paramLabel}>Розмір рами</span>
            <select
              className={styles.select}
              value={filters.sizeLabel}
              onChange={(e) =>
                set(
                  "sizeLabel",
                  e.target.value as RecommendedBikeFilters["sizeLabel"],
                )
              }
            >
              {SIZE_LABEL_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.paramField}>
            <span className={styles.paramLabel}>Зріст райдера (см)</span>
            <input
              type="number"
              className={styles.input}
              min={140}
              max={215}
              value={filters.riderHeightCm}
              onChange={(e) => set("riderHeightCm", Number(e.target.value))}
            />
          </label>

          <label className={styles.paramField}>
            <span className={styles.paramLabel}>Стать</span>
            <select
              className={styles.select}
              value={filters.gender}
              onChange={(e) =>
                set(
                  "gender",
                  e.target.value as RecommendedBikeFilters["gender"],
                )
              }
            >
              {GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.paramField}>
            <span className={styles.paramLabel}>Ціна від</span>
            <input
              type="number"
              className={styles.input}
              min={0}
              step={1000}
              value={filters.minPriceUah}
              onChange={(e) => set("minPriceUah", Number(e.target.value))}
            />
          </label>

          <label className={styles.paramField}>
            <span className={styles.paramLabel}>Ціна до</span>
            <input
              type="number"
              className={styles.input}
              min={0}
              step={1000}
              value={filters.maxPriceUah}
              onChange={(e) => set("maxPriceUah", Number(e.target.value))}
            />
          </label>

          <label className={styles.paramField}>
            <span className={styles.paramLabel}>Посадка</span>
            <select
              className={styles.select}
              value={filters.ridingPosition}
              onChange={(e) =>
                set(
                  "ridingPosition",
                  e.target.value as RecommendedBikeFilters["ridingPosition"],
                )
              }
            >
              {RIDING_POSITION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.paramField}>
            <span className={styles.paramLabel}>Тільки в наявності</span>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={filters.inStockOnly}
              onChange={(e) => set("inStockOnly", e.target.checked)}
            />
          </label>
        </div>

        <fieldset className={styles.paramField}>
          <legend className={styles.paramLabel}>Гальма</legend>
          <div className={styles.checkRow}>
            {BRAKE_TYPE_OPTIONS.map((o) => (
              <label key={o.value} className={styles.checkLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={(filters.brakeTypes ?? []).includes(o.value)}
                  onChange={() => toggleBrakeType(o.value)}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.checkRow}>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={filters.hasRackMounts ?? false}
              onChange={(e) => set("hasRackMounts", e.target.checked)}
            />
            <span>Кріплення багажника</span>
          </label>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={filters.hasFenderMounts ?? false}
              onChange={(e) => set("hasFenderMounts", e.target.checked)}
            />
            <span>Кріплення крил</span>
          </label>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={filters.suspensionFork ?? false}
              onChange={(e) => set("suspensionFork", e.target.checked)}
            />
            <span>Амортизаційна вилка</span>
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primaryAction}
          onClick={() => onSearchCatalog(filters)}
        >
          Шукати в каталозі VeloDruh
        </button>

        <button
          type="button"
          className={styles.restartAction}
          onClick={onRestart}
        >
          ← Змінити відповіді
        </button>
      </div>
    </div>
  );
}
