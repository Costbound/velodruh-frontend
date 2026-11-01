import { Link } from "react-router";
import type { Route } from "./+types/bike-detail";
import { fetchBikeDetail } from "~/lib/api-client";
import styles from "./bike-detail.module.css";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Велосипед — VeloDruh" }];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const bike = await fetchBikeDetail(params.slug);
  return { bike };
}

export function HydrateFallback() {
  return (
    <main className={styles.page}>
      <div className={styles.loading}>Завантаження моделі…</div>
    </main>
  );
}

const SPEC_LABELS: Record<string, string> = {
  brakeType: "Гальма",
  drivetrain: "Трансмісія",
  wheelSize: "Діаметр коліс",
  weightKg: "Вага (кг)",
  frameMaterial: "Матеріал рами",
  ridingPosition: "Посадка",
  hasRackMounts: "Кріплення багажника",
  hasFenderMounts: "Кріплення крил",
  suspensionFork: "Амортизаційна вилка",
};

function formatSpecValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Так" : "Ні";
  return String(value);
}

export default function BikeDetail({ loaderData }: Route.ComponentProps) {
  const { bike } = loaderData;

  return (
    <main className={styles.page}>
      <Link to="/bikes" className={styles.backLink}>
        ← Назад до каталогу
      </Link>

      <div className={styles.header}>
        {bike.imageUrl && (
          <img
            src={bike.imageUrl}
            alt={bike.name}
            className={styles.image}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        <div>
          <h1 className={styles.name}>{bike.name}</h1>
          <p className={styles.meta}>
            {bike.brand.name} · {bike.category} · {bike.modelYear}
          </p>
          <p className={styles.price}>
            від {bike.bestPriceUah.toLocaleString("uk-UA")} ₴
          </p>
        </div>
      </div>

      <p className={styles.description}>{bike.description}</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Характеристики</h2>
        <div className={styles.specGrid}>
          {Object.entries(bike.specs).map(([key, value]) => (
            <div key={key} className={styles.specCard}>
              <div className={styles.specLabel}>{SPEC_LABELS[key] ?? key}</div>
              <div className={styles.specValue}>{formatSpecValue(value)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Розміри та пропозиції магазинів</h2>
        <div className={styles.variants}>
          {bike.variants.map((variant) => (
            <div key={variant.sizeLabel} className={styles.variantCard}>
              <h3 className={styles.variantTitle}>
                Розмір {variant.sizeLabel} ({variant.numericSizeCm} см)
              </h3>
              <p className={styles.variantGeometry}>
                Stack {variant.stackMm} мм · Reach {variant.reachMm} мм · Зріст{" "}
                {variant.minRiderHeightCm}–{variant.maxRiderHeightCm} см
              </p>

              <div className={styles.offers}>
                {variant.offers.map((offer) => (
                  <div key={offer.shopSlug} className={styles.offer}>
                    <div>
                      <div className={styles.offerShop}>{offer.shopName}</div>
                      <div
                        className={styles.offerStock}
                        data-in-stock={offer.inStock}
                      >
                        {offer.inStock ? "В наявності" : "Немає в наявності"}
                      </div>
                    </div>
                    <div className={styles.offerPriceBlock}>
                      <div className={styles.offerPrice}>
                        {offer.priceUah.toLocaleString("uk-UA")} ₴
                      </div>
                      <a
                        href={offer.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.offerLink}
                      >
                        Перейти в магазин
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
