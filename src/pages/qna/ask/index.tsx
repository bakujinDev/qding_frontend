import { IPostQuestion } from "@/api/qna";
import styles from "./ask.module.scss";
import { useForm } from "react-hook-form";

export default function Ask() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IPostQuestion>();

  return (
    <main className={styles.ask}>
      <section className={`${styles.titleSec} ${styles.contSec}`}>
        <article className={styles.contArea}>
          <div className={styles.keyBox}>
            <h1 className={styles.key}>제목</h1>

            <p className={styles.explain}>
              제목이 구체적일수록 빠른 답변을 얻을 수 있어요!
            </p>
          </div>

          <div className={styles.valueBox}>
            <div className={styles.inputBox}>
              <input
                {...register("title", {
                  required: "제목을 입력해주세요",
                  minLength: { value: 8, message: "8자 이상 입력해주세요" },
                })}
                placeholder="예) html의 <strong>과 <em>은 어떻게 다른가요?"
              />
            </div>
          </div>
        </article>

        <article className={styles.tipArea}></article>
      </section>
    </main>
  );
}
