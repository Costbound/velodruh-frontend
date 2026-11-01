import { Link } from "react-router";
import type { Route } from "./+types/home";
import styles from "./home.module.css";

export function meta({}: Route.MetaArgs) {
  const title = "VeloDruh — розумний підбір велосипеда за 5 кроків";
  const description =
    "Пройдіть короткий опитувальник і отримайте точний розмір рами, рекомендований клас велосипеда та найкращі ціни від перевірених веломагазинів України.";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
  ];
}

const FEATURES = [
  {
    icon: "📐",
    title: "Точний розмір рами",
    text: "Розраховуємо ростовку за зростом та довжиною ноги, щоб посадка була безпечною й комфортною.",
  },
  {
    icon: "🧭",
    title: "Персональні рекомендації",
    text: "Враховуємо бюджет, тип покриття, посадку та обов'язкові опції — і підбираємо відповідний клас велосипеда.",
  },
  {
    icon: "🏷️",
    title: "Актуальні ціни",
    text: "Порівнюємо пропозиції перевірених магазинів і показуємо найвигіднішу ціну в наявності.",
  },
  {
    icon: "🎛️",
    title: "Гнучкі фільтри",
    text: "Після опитувальника можна вручну змінити будь-який параметр пошуку й одразу побачити нові результати.",
  },
];

const STEPS = [
  { n: 1, title: "Фізичні параметри", text: "Зріст, довжина ноги та стать." },
  { n: 2, title: "Бюджет", text: "Мінімальна й максимальна ціна в гривнях." },
  {
    n: 3,
    title: "Покриття та ціль",
    text: "Асфальт, гравій, бездоріжжя та мета катання.",
  },
  { n: 4, title: "Посадка", text: "Спортивна, комфортна чи вертикальна." },
  {
    n: 5,
    title: "Обов'язкові опції",
    text: "Багажник, дискові гальма, амортизаційна вилка тощо.",
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>Безкоштовний сервіс підбору</span>
          <h1 className={styles.title}>
            Знайдіть свій ідеальний велосипед за{" "}
            <span className={styles.accent}>5 кроків</span>
          </h1>
          <p className={styles.subtitle}>
            VeloDruh аналізує ваші фізичні параметри, бюджет і стиль катання,
            розраховує розмір рами та підбирає моделі з найкращими цінами від
            перевірених магазинів.
          </p>
          <div className={styles.heroActions}>
            <Link to="/wizard" className={styles.primaryCta}>
              Пройти опитувальник
            </Link>
            <Link to="/bikes" className={styles.secondaryCta}>
              Переглянути каталог
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="features-heading">
        <h2 id="features-heading" className={styles.sectionTitle}>
          Чому VeloDruh
        </h2>
        <div className={styles.featureGrid}>
          {FEATURES.map((f) => (
            <article key={f.title} className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden="true">
                {f.icon}
              </span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureText}>{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="steps-heading">
        <h2 id="steps-heading" className={styles.sectionTitle}>
          Як це працює
        </h2>
        <ol className={styles.stepsList}>
          {STEPS.map((s) => (
            <li key={s.n} className={styles.stepItem}>
              <span className={styles.stepNumber}>{s.n}</span>
              <div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepText}>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Готові знайти свій велосипед?</h2>
        <p className={styles.ctaText}>
          Опитувальник займає менше хвилини та одразу покаже відповідні моделі.
        </p>
        <Link to="/wizard" className={styles.primaryCta}>
          Почати підбір
        </Link>
      </section>
    </main>
  );
}
