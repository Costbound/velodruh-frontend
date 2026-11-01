import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p>
          © {new Date().getFullYear()} VeloDruh. Розумний підбір велосипедів.
        </p>
        <p className={styles.muted}>
          Ціни та наявність партнерських магазинів оновлюються автоматично.
        </p>
      </div>
    </footer>
  );
}
