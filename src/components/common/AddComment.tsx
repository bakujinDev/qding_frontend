import { SubmitHandler, UseFormReturn } from "react-hook-form";
import styles from "./AddComment.module.scss";

interface IProps {
  commentMode: any;
  setCommentMode: Function;
  form: UseFormReturn<any>;
  editCommentSubmit: SubmitHandler<any>;
  postCommentSubmit: SubmitHandler<any>;
  ruleList?: Array<string>;
  error: any;
}

export default function AddComment({
  commentMode,
  setCommentMode,
  form,
  editCommentSubmit,
  postCommentSubmit,
  ruleList,
  error,
}: IProps) {
  return (
    <div className={styles.addCommentCont}>
      {commentMode ? (
        <>
          {commentMode === "add" ? (
            <div className={styles.addModeBox}>
              <form
                className={styles.commentForm}
                onSubmit={form.handleSubmit(postCommentSubmit)}
              >
                <div className={styles.inputBox}>
                  <textarea
                    {...form.register("content", {
                      required: "댓글을 입력해주세요",
                      minLength: {
                        value: 8,
                        message: "8자 이상 입력해주세요",
                      },
                    })}
                    placeholder="8자 이상 입력해주세요"
                  />
                </div>

                <div className={styles.btnBox}>
                  <button className={styles.addBtn}>댓글 달기</button>

                  <button
                    className={styles.cancelBtn}
                    onClick={() => setCommentMode(false)}
                  >
                    취소
                  </button>
                </div>
              </form>

              <p className={styles.error}>
                {form.formState.errors?.content?.message ||
                  error?.response.data.detail}
              </p>

              {ruleList ? (
                <ul className={styles.ruleList}>
                  {ruleList.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <div className={styles.addModeBox}>
              <form
                className={styles.commentForm}
                onSubmit={form.handleSubmit(editCommentSubmit)}
              >
                <div className={styles.inputBox}>
                  <textarea
                    {...form.register("content", {
                      required: "댓글을 입력해주세요",
                      minLength: { value: 8, message: "8자 이상 입력해주세요" },
                    })}
                    placeholder="8자 이상 입력해주세요"
                  />
                </div>

                <div className={styles.btnBox}>
                  <button className={styles.addBtn}>댓글 수정</button>

                  <button
                    className={styles.cancelBtn}
                    onClick={() => setCommentMode(false)}
                  >
                    취소
                  </button>
                </div>
              </form>

              <p className={styles.error}>
                {form.formState.errors?.content?.message ||
                  error?.response.data.detail}
              </p>
            </div>
          )}
        </>
      ) : (
        <button
          className={styles.commentModeBtn}
          onClick={() => setCommentMode("add")}
        >
          댓글 달기
        </button>
      )}
    </div>
  );
}
