import { useState } from "react";
import {
  BRAKE_TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  FRAME_MATERIAL_OPTIONS,
  GENDER_OPTIONS,
  RIDING_POSITION_OPTIONS,
  SIZE_LABEL_OPTIONS,
  SORT_BY_OPTIONS,
} from "~/lib/bike-filter-options";
import type { BikeListFilters, BrakeType } from "~/lib/api-types";
import styles from "./FilterPanel.module.css";

interface FilterPanelProps {
  filters: BikeListFilters;
  onApply: (filters: BikeListFilters) => void;
}

export function FilterPanel({ filters, onApply }: FilterPanelProps) {
  const [draft, setDraft] = useState<BikeListFilters>(filters);

  const set = <K extends keyof BikeListFilters>(
    key: K,
    value: BikeListFilters[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const toggleBrakeType = (value: BrakeType) => {
    const current = draft.brakeType ?? [];
    set(
      "brakeType",
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(draft);
  };

  const handleReset = () => {
    const cleared: BikeListFilters = { sortBy: "price_asc" };
    setDraft(cleared);
    onApply(cleared);
  };

  return (
    <form className={styles.panel} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Фільтри</h2>

      <label className={styles.field}>
        <span className={styles.label}>Категорія</span>
        <select
          className={styles.select}
          value={draft.category ?? ""}
          onChange={(e) =>
            set(
              "category",
              (e.target.value || undefined) as BikeListFilters["category"],
            )
          }
        >
          <option value="">Будь-яка</option>
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Бренд</span>
        <input
          className={styles.input}
          type="text"
          placeholder="напр. pride"
          value={draft.brand ?? ""}
          onChange={(e) => set("brand", e.target.value || undefined)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Розмір рами</span>
        <select
          className={styles.select}
          value={draft.sizeLabel ?? ""}
          onChange={(e) =>
            set(
              "sizeLabel",
              (e.target.value || undefined) as BikeListFilters["sizeLabel"],
            )
          }
        >
          <option value="">Будь-який</option>
          {SIZE_LABEL_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Зріст райдера (см)</span>
        <input
          className={styles.input}
          type="number"
          min={140}
          max={215}
          value={draft.riderHeightCm ?? ""}
          onChange={(e) =>
            set(
              "riderHeightCm",
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Стать</span>
        <select
          className={styles.select}
          value={draft.gender ?? ""}
          onChange={(e) =>
            set(
              "gender",
              (e.target.value || undefined) as BikeListFilters["gender"],
            )
          }
        >
          <option value="">Будь-яка</option>
          {GENDER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.fieldRow2}>
        <label className={styles.field}>
          <span className={styles.label}>Ціна від</span>
          <input
            className={styles.input}
            type="number"
            min={0}
            value={draft.minPriceUah ?? ""}
            onChange={(e) =>
              set(
                "minPriceUah",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Ціна до</span>
          <input
            className={styles.input}
            type="number"
            min={0}
            value={draft.maxPriceUah ?? ""}
            onChange={(e) =>
              set(
                "maxPriceUah",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </label>
      </div>

      <fieldset className={styles.field}>
        <legend className={styles.label}>Гальма</legend>
        <div className={styles.checkStack}>
          {BRAKE_TYPE_OPTIONS.map((o) => (
            <label key={o.value} className={styles.checkLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={(draft.brakeType ?? []).includes(o.value)}
                onChange={() => toggleBrakeType(o.value)}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className={styles.field}>
        <span className={styles.label}>Матеріал рами</span>
        <select
          className={styles.select}
          value={draft.frameMaterial ?? ""}
          onChange={(e) =>
            set(
              "frameMaterial",
              (e.target.value || undefined) as BikeListFilters["frameMaterial"],
            )
          }
        >
          <option value="">Будь-який</option>
          {FRAME_MATERIAL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Посадка</span>
        <select
          className={styles.select}
          value={draft.ridingPosition ?? ""}
          onChange={(e) =>
            set(
              "ridingPosition",
              (e.target.value ||
                undefined) as BikeListFilters["ridingPosition"],
            )
          }
        >
          <option value="">Будь-яка</option>
          {RIDING_POSITION_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Діаметр коліс</span>
        <input
          className={styles.input}
          type="text"
          placeholder='напр. 28"'
          value={draft.wheelSize ?? ""}
          onChange={(e) => set("wheelSize", e.target.value || undefined)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Макс. вага (кг)</span>
        <input
          className={styles.input}
          type="number"
          min={0}
          step={0.1}
          value={draft.maxWeightKg ?? ""}
          onChange={(e) =>
            set(
              "maxWeightKg",
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
        />
      </label>

      <div className={styles.checkStack}>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={draft.hasRackMounts ?? false}
            onChange={(e) =>
              set("hasRackMounts", e.target.checked || undefined)
            }
          />
          <span>Кріплення багажника</span>
        </label>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={draft.hasFenderMounts ?? false}
            onChange={(e) =>
              set("hasFenderMounts", e.target.checked || undefined)
            }
          />
          <span>Кріплення крил</span>
        </label>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={draft.suspensionFork ?? false}
            onChange={(e) =>
              set("suspensionFork", e.target.checked || undefined)
            }
          />
          <span>Амортизаційна вилка</span>
        </label>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={draft.inStockOnly ?? false}
            onChange={(e) => set("inStockOnly", e.target.checked || undefined)}
          />
          <span>Тільки в наявності</span>
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Сортування</span>
        <select
          className={styles.select}
          value={draft.sortBy ?? "price_asc"}
          onChange={(e) =>
            set("sortBy", e.target.value as BikeListFilters["sortBy"])
          }
        >
          {SORT_BY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.actions}>
        <button type="submit" className={styles.applyBtn}>
          Застосувати
        </button>
        <button type="button" className={styles.resetBtn} onClick={handleReset}>
          Скинути
        </button>
      </div>
    </form>
  );
}
