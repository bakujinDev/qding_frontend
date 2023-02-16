import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import FlagIcon from "@mui/icons-material/Flag";
import HistoryIcon from "@mui/icons-material/History";
import { chk5MFromNow, timeDifference } from "@/lib/time";
import styles from "./AnswerSec.module.scss";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  deleteAnswerComment,
  editAnswerComment,
  IEditAnswerComment,
  IPostAnswerComment,
  postAnswerComment,
} from "@/api/qna";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddComment from "@/components/common/AddComment";
import { commentRuleList } from "@/lib/forum";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import useUser from "@/lib/user";

interface IProps {
  questionId: string;
  data: any;
}

export default function AnswerSec({ questionId, data }: IProps) {
  const queryClient = useQueryClient();

  const { user } = useUser();

  const [commentMode, setCommentMode] = useState(false);

  const commentForm = useForm<IPostAnswerComment>({
    defaultValues: {
      answerId: `${data.pk}`,
    },
  });

  const editCommentMutation = useMutation(editAnswerComment, {
    onSuccess: (res) => {
      commentForm.reset();
      queryClient.refetchQueries(["postQuery", `${questionId}`]);
    },
  });

  function editCommentSubmit({ content }: IEditAnswerComment) {
    editCommentMutation.mutate({
      commentId: `${commentMode}`,
      content,
    });
  }

  const deleteCommentMutation = useMutation(deleteAnswerComment, {
    onSuccess: (res) => {
      queryClient.refetchQueries(["postQuery", `${questionId}`]);
    },
  });

  const postCommentMutation = useMutation(postAnswerComment, {
    onSuccess: (res) => {
      commentForm.reset();
      queryClient.refetchQueries(["postQuery", `${questionId}`]);
    },
  });

  function postCommentSubmit({ content }: IPostAnswerComment) {
    postCommentMutation.mutate({
      answerId: `${data.pk}`,
      content,
    });
  }

  useEffect(() => {
    if (!commentMode) commentForm.reset();
    editCommentMutation.reset();
    postCommentMutation.reset();
  }, [commentMode]);

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

          <div className={styles.bottomBar}>
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
        </div>
      </article>

      <article className={styles.commentArea}>
        <ul className={styles.commentList}>
          {data.answer_comments
            ? data.answer_comments.map((v: any, i: number) => (
                <li key={i}>
                  <div className={styles.utilBox}>
                    <button
                      className={`${styles.upBtn} ${styles.voteBtn}`}
                      onClick={() => {}}
                    >
                      <ThumbUpAltIcon />
                    </button>

                    {data.votes === 0 ? null : <p>{data.votes}</p>}

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
                      {timeDifference(v.updated_at)}
                    </p>

                    {v?.creator?.id === user?.pk &&
                    chk5MFromNow(v.created_at) ? (
                      <>
                        <button
                          className={`${styles.editBtn} ${styles.nonCircleBtn}`}
                          onClick={() => {
                            setCommentMode(v.pk);
                            commentForm.setValue("content", v.content);
                          }}
                        >
                          <EditIcon />
                        </button>

                        <button
                          className={`${styles.delBtn} ${styles.circleBtn}`}
                          onClick={() =>
                            deleteCommentMutation.mutate({
                              commentId: `${v.pk}`,
                            })
                          }
                        >
                          <CloseIcon />
                        </button>
                      </>
                    ) : null}
                  </div>
                </li>
              ))
            : null}
        </ul>

        <AddComment
          commentMode={commentMode}
          setCommentMode={setCommentMode}
          form={commentForm}
          editCommentSubmit={editCommentSubmit}
          postCommentSubmit={postCommentSubmit}
          ruleList={commentRuleList}
          error={editCommentMutation.error || postCommentMutation.error}
        />
      </article>
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
