import { getQnaPost, postQuestionComment } from "@/api/qna";
import Seo from "@/components/Seo";
import useUser from "@/lib/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import styles from "./qnaPosts.module.scss";

import QuestionSec from "@/components/qna/id/QuestionSec";

export default function QnaPosts() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useUser();
  const { questionId } = router.query;

  const { data } = useQuery(["postQuery", `${questionId}`], getQnaPost, {
    retry: false,
  });

  const commentMutation = useMutation(postQuestionComment, {
    onSuccess: (res) => {
      console.log(res);
    },
  });

  return data ? (
    <>
      <Seo title={data.title} />

      <main className={styles.qnaPosts}>
        <button
          onClick={() =>
            commentMutation.mutate({
              questionId: `${questionId}`,
              content: "hi",
            })
          }
        >
          hi
        </button>

        <QuestionSec questionId={`${questionId}`} data={data} />
      </main>
    </>
  ) : (
    <></>
  );
}
