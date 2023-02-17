import { getQnaPost } from "@/api/qna";
import Seo from "@/components/Seo";
import useUser from "@/lib/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import styles from "./qnaPosts.module.scss";
import QuestionSec from "@/components/qna/questionId/QuestionSec";
import AddAnswerSec from "@/components/qna/questionId/AddAnswerSec";
import AnswerSec from "@/components/qna/questionId/AnswerSec";
import { useEffect } from "react";
import { viewHistory } from "@/lib/localStorage";

export default function QnaPosts() {
  const router = useRouter();
  const { user } = useUser();

  const { questionId } = router.query;

  const postQuery = useQuery(["postQuery", `${questionId}`], getQnaPost, {
    retry: false,
    enabled: false,
    onSuccess: (res) => {
      console.log(res);

      viewHistory({
        name: "qnaPostHistory",
        value: { id: questionId, title: res.title },
      });
    },
  });

  useEffect(() => {
    if (!router.isReady) return;

    postQuery.refetch();
  }, [router.isReady]);

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
