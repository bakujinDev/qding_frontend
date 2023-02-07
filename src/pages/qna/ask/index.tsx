import { IPostQuestion } from "@/api/qna";
import styles from "./ask.module.scss";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import Seo from "@/components/Seo";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

export default function Ask() {
  const editorRef = useRef<HTMLDivElement>(null);

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

  console.log(watch("content"));

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
            <h3 className={styles.key}>좋은 제목 짓는법</h3>

            <div className={styles.valueBox}>
              <ul className={styles.valueList}>
                <li>문제를 파악 할 수 있는 제목 작성하기</li>
                <li>질문 내용을 작성한 다음 제목을 한번 더 생각해보기</li>
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
              <ReactQuill
                theme="snow"
                value={watch("content")}
                onChange={(e) => setValue("content", e)}
                modules={modules}
                formats={formats}
              />
            </div>
          </article>

          <article className={styles.tipArea}>
            <h3 className={styles.key}>빠른 답변을 부르는 제목 짓는법</h3>

            <div className={styles.valueBox}>
              <ul className={styles.valueList}>
                <li>문제를 파악 할 수 있는 제목 작성하기</li>
                <li>질문 내용을 작성한 다음 제목을 한번 더 생각해보기</li>
              </ul>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "code-block"],
    ["link", "image"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header",
  "bold",
  "italic",
  "code-block",
  "image",
  "link",
  "list",
  "bullet",
];
