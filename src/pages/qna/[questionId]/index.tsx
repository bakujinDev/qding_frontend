import { getQnaPost } from "@/api/qna";
import Seo from "@/components/Seo";
import useUser from "@/lib/user";
import { useQuery } from "@tanstack/react-query";
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
    onSuccess: (res) => {
      console.log(res);
    },
  });

  return data ? (
    <>
      <Seo title={data.title} />

      <main className={styles.qnaPosts}>
        <QuestionSec questionId={`${questionId}`} data={data} />
      </main>
    </>
  ) : (
    <></>
  );
}
