import styles from "./AddComment.module.scss";

interface IProps {
  commentMode: any;
  setCommentMode: Function;
  register: any;
  handleSubmit: Function;
  editCommentSubmit: Function;
  postCommentSubmit: Function;
  ruleList?: Array<string>;
  error: any;
}

export default function AddComment({
  commentMode,
  setCommentMode,
  register,
  handleSubmit,
  editCommentSubmit,
  postCommentSubmit,
  ruleList,
  error,
}: IProps) {
  console.log(error?.response.data.detail);
  return (
    <div className={styles.addCommentCont}>
      {commentMode ? (
        <>
          {commentMode === "add" ? (
            <div className={styles.addModeBox}>
              <form
                className={styles.commentForm}
                onSubmit={handleSubmit(postCommentSubmit)}
              >
                <div className={styles.inputBox}>
                  <textarea
                    {...register("content", {
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

              {ruleList ? (
                <ul className={styles.ruleList}>
                  {ruleList.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              ) : null}

              <p className={styles.error}>{error?.response.data.detail}</p>
            </div>
          ) : (
            <div className={styles.addModeBox}>
              <form
                className={styles.commentForm}
                onSubmit={handleSubmit(editCommentSubmit)}
              >
                <div className={styles.inputBox}>
                  <textarea
                    {...register("content", {
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

              <p className={styles.error}>{error?.response.data.detail}</p>
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
