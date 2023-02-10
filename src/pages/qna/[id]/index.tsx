import Seo from "@/components/Seo";
import styles from "./qnaPosts.module.scss";

export default function QnaPosts() {
  return (
    <>
      <Seo title="질문하기" />

      <main className={styles.qnaPosts}></main>
    </>
  );
}
