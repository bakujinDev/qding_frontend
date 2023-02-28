import styles from "./notFound.module.scss";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useRouter } from "next/router";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className={styles.notFound}>
      <section className={styles.contSec}>
        <article className={styles.titleArea}>
          <h1 className={styles.title}>아직 만들어지지 않은 페이지에요</h1>
          <h3 className={styles.explain}>
            <strong onClick={() => router.push("/qna")}>여기</strong>를 눌러
            <br />
            새로운 질문들을 만날 수 있어요!
          </h3>
        </article>

        <article className={styles.contArea}>
          <SentimentDissatisfiedIcon
            fontSize="inherit"
            onClick={() => router.push("/qna")}
          />
        </article>
      </section>
    </main>
  );
}
