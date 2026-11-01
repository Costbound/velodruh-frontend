import { useLocation, useNavigate } from "react-router";
import type { Route } from "./+types/bikes";
import {
  bikeFiltersToSearchParams,
  searchBikes,
  searchParamsToBikeFilters,
} from "~/lib/api-client";
import type { BikeListFilters } from "~/lib/api-types";
import { BikeCard } from "~/components/bikes/BikeCard";
import { FilterPanel } from "~/components/bikes/FilterPanel";
import styles from "./bikes.module.css";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Каталог велосипедів — VeloDruh" }];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const filters = searchParamsToBikeFilters(url.searchParams);
  const result = await searchBikes(filters);
  return { filters, result };
}

export function HydrateFallback() {
  return (
    <main className={styles.page}>
      <div className={styles.loading}>Завантаження каталогу…</div>
    </main>
  );
}

export default function Bikes({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { filters, result } = loaderData;

  const applyFilters = (next: BikeListFilters) => {
    const params = bikeFiltersToSearchParams(next);
    navigate(`/bikes${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <main className={styles.page}>
      <div className={styles.headRow}>
        <h1 className={styles.title}>Каталог велосипедів</h1>
        <span className={styles.count}>Знайдено: {result.total}</span>
      </div>

      <div className={styles.layout}>
        <FilterPanel
          key={location.search}
          filters={filters}
          onApply={applyFilters}
        />

        <div className={styles.results}>
          {result.items.length === 0 ? (
            <div className={styles.empty}>
              За заданими параметрами велосипедів не знайдено. Спробуйте
              розширити фільтри.
            </div>
          ) : (
            <div className={styles.cards}>
              {result.items.map((bike) => (
                <BikeCard key={bike.slug} bike={bike} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
