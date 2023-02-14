import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import FlagIcon from "@mui/icons-material/Flag";
import HistoryIcon from "@mui/icons-material/History";
import { timeDifference } from "@/lib/time";
import styles from "./AnswerSec.module.scss";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IPostComment, postQuestionComment } from "@/api/qna";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddComment from "@/components/common/AddComment";
import { commentRuleList } from "@/lib/forum";

interface IProps {
  questionId: string;
  data: any;
}

export default function AnswerSec({ questionId, data }: IProps) {
  const queryClient = useQueryClient();

  const [addCommentMode, setAddCommentMode] = useState<boolean>(false);

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   reset,
  // } = useForm<IPostComment>({
  //   defaultValues: {
  //     questionId: `${questionId}`,
  //   },
  // });

  // const commentMutation = useMutation(postQuestionComment, {
  //   onSuccess: (res) => {
  //     reset();
  //     queryClient.refetchQueries(["postQuery", `${questionId}`]);
  //   },
  // });

  // function commentSubmit({ content }: IPostComment) {
  //   commentMutation.mutate({
  //     questionId: `${questionId}`,
  //     content,
  //   });
  // }

  return (
    <section className={styles.answerSec}>
      <article className={styles.contArea}>
        <div className={styles.utilBox}>
          <button
            className={`${styles.upBtn} ${styles.voteBtn}`}
            onClick={() => {}}
          >
            <ThumbUpAltIcon />
          </button>

          <p>{data.votes}</p>

          <button
            className={`${styles.downBtn} ${styles.voteBtn}`}
            onClick={() => {}}
          >
            <ThumbDownAltIcon />
          </button>

          <button className={styles.historyBtn} onClick={() => {}}>
            <HistoryIcon />
          </button>

          <button className={styles.flagBtn} onClick={() => {}}>
            <FlagIcon />
          </button>
        </div>

        <div className={styles.contCont}>
          <div className={styles.quillBox}>
            <ReactQuill
              className={`${styles.quill} readOnlyQuill`}
              readOnly={true}
              modules={{ toolbar: false }}
              value={data.content}
            />
          </div>

          <div className={styles.utilBar}>
            <div className={styles.btnBox}>
              <button className={styles.editBtn} onClick={() => {}}>
                수정하기
              </button>

              <button className={styles.followBtn} onClick={() => {}}>
                알람받기
              </button>

              <button className={styles.shareBtn} onClick={() => {}}>
                공유하기
              </button>
            </div>

            <div className={styles.profBox}>
              <img src={data.editor?.avatar || data.creator.avatar} alt="" />
              <p className={styles.name}>
                {data.editor?.name || data.creator.name}
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* <article className={styles.commentArea}>
        <ul className={styles.commentList}>
          {data.question_comments
            ? data.question_comments.map((v: any, i: number) => (
                <li key={i}>
                  <div className={styles.utilBox}>
                    <button
                      className={`${styles.upBtn} ${styles.voteBtn}`}
                      onClick={() => {}}
                    >
                      <ThumbUpAltIcon />
                    </button>

                    <p>{data.votes}</p>

                    <button
                      className={`${styles.downBtn} ${styles.voteBtn}`}
                      onClick={() => {}}
                    >
                      <ThumbDownAltIcon />
                    </button>

                    <button className={styles.flagBtn} onClick={() => {}}>
                      <FlagIcon />
                    </button>
                  </div>

                  <div className={styles.contBox}>
                    <p className={styles.content}>{v.content} -</p>
                    <p className={styles.name}>{v.creator.name}</p>
                    <p className={styles.updatedAt}>
                      {timeDifference(data.updated_at)}
                    </p>
                  </div>
                </li>
              ))
            : null}
        </ul>

        <AddComment
          addCommentMode={addCommentMode}
          setAddCommentMode={setAddCommentMode}
          register={register}
          handleSubmit={handleSubmit}
          commentSubmit={commentSubmit}
          ruleList={commentRuleList}
        />
      </article> */}
    </section>
  );
}

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
  }
);
