import { IPostQuestion } from "@/api/qna";
import styles from "./ask.module.scss";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Seo from "@/components/Seo";
import "react-quill/dist/quill.snow.css";
import TextEditor from "@/components/common/TextEditor";

export default function Ask() {
  const [, set] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<IPostQuestion>();

  useEffect(() => {
    register("content", { required: true, minLength: 20 });
  }, [register]);

  function a() {
    let content: any = watch("content");

    if (!(content && content.ops)) return;

    let ops = content.ops;

    ops?.map((v: any, i: number) => {
      if (v.insert?.image) console.log("hi");
    });
  }
  a();

  return (
    <>
      <Seo title="질문하기" />
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

          <article className={styles.tipArea}>
            <h3 className={styles.key}>제목 잘 쓰는법</h3>

            <div className={styles.valueBox}>
              <ul className={styles.valueList}>
                <li>질문 제목에 의미가 담기도록 간결하게 작성하기</li>
                <li>구체적인 내용의 제목 작성하기</li>
                <li>질문의 핵심 단어를 포함하기</li>
              </ul>
            </div>
          </article>
        </section>

        <section className={`${styles.titleSec} ${styles.contSec}`}>
          <article className={styles.contArea}>
            <div className={styles.keyBox}>
              <h1 className={styles.key}>내용</h1>

              <p className={styles.explain}>문제의 내용을 작성해 주세요</p>
            </div>

            <div className={styles.valueBox}>
              <TextEditor
                value={watch("content")}
                setValue={(
                  value: string,
                  delta: any,
                  source: any,
                  editor: any
                ) => setValue("content", editor.getContents())}
              />
            </div>
          </article>

          <article className={styles.tipArea}>
            <h3 className={styles.key}>질문 내용 잘 쓰는법</h3>

            <div className={styles.valueBox}>
              <ul className={styles.valueList}>
                <li>개발 목표와 발생한 문제에 대해 설명하기</li>
                <li>
                  시도한 방식과 발생한 결과, 목표와 어떻게 다른지 설명하기
                </li>
                <li>코드와 에러메세지를 이미지가 아닌 텍스트로 올리기</li>
              </ul>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
