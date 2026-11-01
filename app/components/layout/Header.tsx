import { Link, NavLink } from "react-router";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">
            🚲
          </span>
          <span className={styles.brandText}>
            VeloDruh
            <span className={styles.brandTag}>підбір велосипеда</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Основна навігація">
          <NavLink
            to="/bikes"
            className={({ isActive }) =>
              isActive
                ? `${styles.navLink} ${styles.navLinkActive}`
                : styles.navLink
            }
          >
            Каталог
          </NavLink>
          <Link to="/wizard" className={styles.cta}>
            Пройти підбір
          </Link>
        </nav>
      </div>
    </header>
  );
}
