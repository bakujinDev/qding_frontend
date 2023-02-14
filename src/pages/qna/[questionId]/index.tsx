import { getQnaPost } from "@/api/qna";
import Seo from "@/components/Seo";
import useUser from "@/lib/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import styles from "./qnaPosts.module.scss";
import QuestionSec from "@/components/qna/questionId/QuestionSec";
import AddAnswerSec from "@/components/qna/questionId/AddAnswerSec";
import AnswerSec from "@/components/qna/questionId/AnswerSec";
import { useState } from "react";

export default function QnaPosts() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useUser();
  const { questionId } = router.query;

  const [answerArray, setAnswerArray] = useState<any>([]);

  const { data, isSuccess } = useQuery(
    ["postQuery", `${questionId}`],
    getQnaPost,
    {
      retry: false,
      onSuccess: (res) => {
        console.log(res);
        console.log([...res.answers].map((e, i) => i));
        // if (res.answers) setAnswerArray([...res.answers]);
      },
    }
  );

  return data ? (
    <>
      <Seo title={data.title} />

      <main className={styles.qnaPosts}>
        <button
          onClick={() => {
            console.log(typeof data?.answers, data?.answers);
          }}
        >
          dd
        </button>
        <QuestionSec questionId={`${questionId}`} data={data} />

        {data.answers
          ? data.answers.map((answer: any, i: number) => (
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
