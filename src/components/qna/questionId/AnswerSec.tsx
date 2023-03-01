import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import FlagIcon from "@mui/icons-material/Flag";
import HistoryIcon from "@mui/icons-material/History";
import { chk5MFromNow, timeDifference } from "../../../lib/time";
import styles from "./AnswerSec.module.scss";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  IPostAnswerComment,
  postAnswerComment,
  deleteAnswerComment,
  editAnswerComment,
  IEditAnswerComment,
  voteAnswer,
} from "../../../api/qna/answer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddComment from "../../../components/common/AddComment";
import { commentRuleList, onClickShareBtn } from "../../../lib/forum";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/store";
import { toast } from "react-toastify";
import CheckIcon from "@mui/icons-material/Check";
import { choiceAnswer } from "../../../api/qna/question";
import { subscribeNotification } from "../../../api/notification";
import { useRouter } from "next/router";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface IQuestion {
  id: string | string[];
  title: string;
}

interface IProps {
  question: IQuestion;
  data: any;
  canSelectAnswer: boolean | undefined;
}

export default function AnswerSec({ question, data, canSelectAnswer }: IProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useSelector((state: AppState) => state.common.userInfo);

  const [commentMode, setCommentMode] = useState(false);

  const commentForm = useForm<IPostAnswerComment>({
    defaultValues: {
      answerId: `${data.pk}`,
    },
  });

  const voteMutation = useMutation(voteAnswer, {
    onSuccess: (res) => {
      console.log(res.data);
      queryClient.refetchQueries(["post", `${question?.id}`]);
    },
    onError: (err: any) => {
      toast(err.response.data.detail);
    },
  });

  const choiceAnswerMutation = useMutation(choiceAnswer, {
    onSuccess: (res) => {
      toast("답변 선택이 완료 되었어요");
      queryClient.refetchQueries(["post", `${question?.id}`]);
    },
    onError: (err: any) => toast(err?.response?.data),
  });

  const subscribeNotificationMutation = useMutation(subscribeNotification, {
    onSuccess: (res) => {
      console.log(res.message);
      if (res.message === "create") toast("알림 목록에 추가되었어요");
      else if (res.message === "remove") toast("알림 목록에 제외되었어요");

      queryClient.refetchQueries(["post", `${question?.id}`]);
    },
  });

  const editCommentMutation = useMutation(editAnswerComment, {
    onSuccess: (res) => {
      commentForm.reset();
      queryClient.refetchQueries(["post", `${question?.id}`]);
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
      queryClient.refetchQueries(["post", `${question?.id}`]);
    },
  });

  const postCommentMutation = useMutation(postAnswerComment, {
    onSuccess: (res) => {
      commentForm.reset();
      queryClient.refetchQueries(["post", `${question?.id}`]);
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
    <section className={styles.answerSec} id={`answer${data.pk}`}>
      <article className={styles.contArea}>
        <div className={styles.utilBox}>
          <button
            className={`${styles.upBtn} ${styles.voteBtn} ${
              data.is_answer_voted === "plus" ? styles.on : ""
            }`}
            onClick={() =>
              voteMutation.mutate({ answerId: data.pk, vote_type: "plus" })
            }
          >
            <ThumbUpAltIcon />
          </button>

          <p>{data.votes}</p>

          <button
            className={`${styles.downBtn} ${styles.voteBtn} ${
              data.is_answer_voted === "minus" ? styles.on : ""
            }`}
            onClick={() =>
              voteMutation.mutate({ answerId: data.pk, vote_type: "minus" })
            }
          >
            <ThumbDownAltIcon />
          </button>

          {canSelectAnswer ? (
            <button
              className={styles.choiceBtn}
              onClick={() =>
                choiceAnswerMutation.mutate({
                  questionId: question?.id,
                  answerId: data.pk,
                })
              }
            >
              <CheckIcon />
            </button>
          ) : null}

          {data.is_selected ? (
            <span className={styles.selected}>
              <CheckIcon />
            </span>
          ) : null}

          {/* <button className={styles.historyBtn} onClick={() => {}}>
            <HistoryIcon />
          </button>

          <button className={styles.flagBtn} onClick={() => {}}>
            <FlagIcon />
          </button> */}
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
                {data.creator?.id === user?.pk ? (
                  <button
                    className={styles.editBtn}
                    onClick={() => router.push(`/qna/edit/answer/${data.pk}`)}
                  >
                    수정하기
                  </button>
                ) : null}

                <button
                  className={`${styles.followBtn} ${
                    data.is_answer_described ? styles.on : ""
                  }`}
                  onClick={() =>
                    subscribeNotificationMutation.mutate({
                      type: "answer",
                      id: data.pk,
                    })
                  }
                >
                  알림받기
                </button>

                <button
                  className={styles.shareBtn}
                  onClick={() =>
                    onClickShareBtn(
                      `${window.location.href}?answerId=${data.pk}`
                    )
                  }
                >
                  공유하기
                </button>
              </div>

              <div
                className={styles.profBox}
                onClick={() =>
                  router.push(`/users/${data.editor?.id || data.creator?.id}`)
                }
              >
                {data.editor?.avatar || data.creator?.avatar ? (
                  <img
                    src={data.editor?.avatar || data.creator?.avatar}
                    alt=""
                  />
                ) : (
                  <AccountCircleIcon fontSize="inherit" />
                )}
                <p className={styles.name}>
                  {data.editor?.name || data.creator?.name || "비공개 회원"}
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
                  {/* <div className={styles.utilBox}>
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
                  </div> */}

                  <div className={styles.contBox}>
                    <p className={styles.content}>{v.content} -</p>
                    <p
                      className={styles.name}
                      onClick={() => router.push(`/users/${data.creator?.id}`)}
                    >
                      {v.creator?.name || "비공개 회원"}
                    </p>
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
