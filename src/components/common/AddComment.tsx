import styles from "./AddComment.module.scss";

interface IProps {
  addCommentMode: Boolean;
  setAddCommentMode: Function;
  register: any;
  handleSubmit: Function;
  commentSubmit: Function;
  ruleList?: Array<string>;
}

export default function AddComment({
  addCommentMode,
  setAddCommentMode,
  register,
  handleSubmit,
  commentSubmit,
  ruleList,
}: IProps) {
  return (
    <div className={styles.addCommentCont}>
      {addCommentMode ? (
        <>
          {ruleList ? (
            <ul className={styles.ruleList}>
              {ruleList.map((v, i) => (
                <li key={i}>{v}</li>
              ))}
            </ul>
          ) : null}

          <form
            className={styles.commentForm}
            onSubmit={handleSubmit(commentSubmit)}
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

            <button className={styles.addBtn}>댓글 달기</button>
          </form>
        </>
      ) : (
        <button
          className={styles.commentModeBtn}
          onClick={() => setAddCommentMode(true)}
        >
          댓글 달기
        </button>
      )}
    </div>
  );
}
