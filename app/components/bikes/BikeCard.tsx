import { Link } from "react-router";
import type { BikeDetailDto } from "~/lib/api-types";
import styles from "./BikeCard.module.css";

interface BikeCardProps {
  bike: BikeDetailDto;
}

export function BikeCard({ bike }: BikeCardProps) {
  const offersCount = bike.variants.reduce(
    (acc, v) => acc + v.offers.length,
    0,
  );

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {bike.imageUrl ? (
          <img
            src={bike.imageUrl}
            alt={bike.name}
            className={styles.image}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true">
            🚲
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.headRow}>
          <div>
            <h3 className={styles.name}>{bike.name}</h3>
            <p className={styles.meta}>
              {bike.brand.name} · {bike.category} · {bike.modelYear}
            </p>
          </div>
          <div className={styles.price}>
            {bike.bestPriceUah.toLocaleString("uk-UA")} ₴
            <div className={styles.offersCount}>{offersCount} пропозицій</div>
          </div>
        </div>

        <ul className={styles.highlights}>
          {bike.keyHighlights.slice(0, 3).map((h) => (
            <li key={h}>✓ {h}</li>
          ))}
        </ul>

        <Link to={`/bikes/${bike.slug}`} className={styles.detailLink}>
          Повна картка та ціни →
        </Link>
      </div>
    </article>
  );
}
