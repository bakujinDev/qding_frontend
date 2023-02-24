import { getQnaPost } from "@/api/qna/question";
import Seo from "@/components/Seo";
import useUser from "@/lib/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import styles from "./qnaPosts.module.scss";
import QuestionSec from "@/components/qna/questionId/QuestionSec";
import AddAnswerSec from "@/components/qna/questionId/AddAnswerSec";
import AnswerSec from "@/components/qna/questionId/AnswerSec";
import { viewHistory } from "@/lib/localStorage";
import { useEffect } from "react";

export default function QnaPosts() {
  const router = useRouter();

  const { questionId, answerId } = router.query;

  const postQuery = useQuery(["postQuery", `${questionId}`], getQnaPost, {
    retry: false,
    onSuccess: (res) => {
      console.log(res);
      viewHistory({
        name: "qnaPostHistory",
        value: { id: questionId, title: res.title },
      });
    },
  });

  useEffect(() => {
    if (!(answerId && postQuery.data)) return;

    const answer = document.getElementById(`answer${answerId}`);
    if (!answer) return;

    const ansewrPos = answer.getBoundingClientRect();
    window.scrollTo({top: ansewrPos.top - 60,behavior:'smooth'});
  }, [postQuery]);

  return postQuery.data ? (
    <>
      <Seo title={postQuery.data.title} />

      <main className={styles.qnaPosts}>
        <QuestionSec questionId={`${questionId}`} data={postQuery.data} />

        {postQuery.data.answers
          ? postQuery.data.answers.map((answer: any, i: number) => (
              <AnswerSec questionId={`${questionId}`} data={answer} key={i} />
            ))
          : null}

        <AddAnswerSec questionId={`${questionId}`} />
      </main>
    </>
  ) : (
    <></>
  );
}
