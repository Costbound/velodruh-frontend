import { useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/wizard";
import { fetchWizardMeta } from "~/lib/api-client";
import { WizardFlow } from "~/components/wizard/WizardFlow";
import styles from "./wizard.module.css";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Опитувальник підбору велосипеда — VeloDruh" }];
}

export async function clientLoader() {
  const meta = await fetchWizardMeta();
  return { meta };
}

export function HydrateFallback() {
  return (
    <main className={styles.page}>
      <div className={styles.loading}>Завантаження опитувальника…</div>
    </main>
  );
}

export default function Wizard({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Підбір велосипеда</h1>
        <p className={styles.subtitle}>
          Дайте відповідь на кілька запитань — ми розрахуємо розмір рами та
          підберемо відповідний клас велосипеда.
        </p>
      </div>

      {globalError && <div className={styles.errorBanner}>{globalError}</div>}

      <WizardFlow
        meta={loaderData.meta}
        onSubmitError={(e) => setGlobalError(e)}
        onSearchCatalog={(searchParams) => {
          navigate(`/bikes?${searchParams.toString()}`);
        }}
      />
    </main>
  );
}
