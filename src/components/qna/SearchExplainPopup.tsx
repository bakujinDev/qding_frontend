import styles from "./SearchExplainPopup.module.scss";

export default function SearchExplainPopup() {
  return (
    <section className={styles.explainPopup}>
      <ul className={styles.explainList}>
        <li>
          <p className={styles.key}>[tag]</p>
          <p className={styles.value}>태그 검색</p>
        </li>
        <li>
          <p className={styles.key}>user:</p>
          <p className={styles.value}>작성자 검색</p>
        </li>
      </ul>
    </section>
  );
}
