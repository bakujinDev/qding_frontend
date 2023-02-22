import { timeDifference } from "@/lib/time";
import { useQuery } from "@tanstack/react-query";
import styles from "./HistoryDetail.module.scss";
import { useRouter } from "next/router";
import { useState } from "react";
import HistoryPageNation from "./HistoryPagenation";
import PendingIcon from "@mui/icons-material/Pending";
import { getProfileAnswers } from "@/api/user";
import { D_orderList } from "@/lib/profile";

export default function AnswerHistory() {
  const router = useRouter();

  const { id } = router.query;
  const [orderOpt, setOrderOpt] = useState(D_orderList[0]);
  const [page, setPage] = useState(1);

  const query: any = useQuery(
    ["answer_creator", id, orderOpt.value, page],
    getProfileAnswers,
    {
      retry: false,
      onSuccess: (res) => console.log(res),
    }
  );

  return (
    <details className={styles.activityCont}>
      <summary>
        <div className={styles.titleBox}>
          <h1 className={styles.contTitle}>답변</h1>
          <h3 className={styles.count}>{query.data?.total}개</h3>
        </div>

        <ul className={styles.orderList}>
          {D_orderList.map((v, i) => (
            <li key={i}>
              <button
                className={`${styles.optBtn} ${
                  v === orderOpt ? styles.on : ""
                }`}
                onClick={() => setOrderOpt(v)}
              >
                {v.key}
              </button>
            </li>
          ))}
        </ul>
      </summary>

      <div className={styles.valueBox}>
        {query.data?.total > 0 ? (
          <>
            <ul className={styles.activityList}>
              {query.data?.list?.map((v: any, i: number) => (
                <li
                  key={i}
                  onClick={() =>
                    router.push({
                      pathname: `/qna/${v.question.pk}`,
                      query: {
                        answerId: v.pk,
                      },
                    })
                  }
                >
                  <span
                    className={`${styles.votes} ${
                      v.is_selected ? styles.plus : ""
                    }`}
                  >
                    {v.votes}
                  </span>
                  <p className={styles.title}>{v.question.title}</p>

                  <p className={styles.time}>{timeDifference(v.created_at)}</p>
                </li>
              ))}
            </ul>

            <HistoryPageNation
              page={page}
              setPage={setPage}
              total={query.data?.total}
            />
          </>
        ) : (
          <div className={styles.emptyBox}>
            <PendingIcon />

            <p>아직 작성한 내용이 없어요</p>
          </div>
        )}
      </div>
    </details>
  );
}
