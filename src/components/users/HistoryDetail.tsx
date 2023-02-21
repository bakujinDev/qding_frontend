import { timeDifference } from "@/lib/time";
import { useQuery } from "@tanstack/react-query";
import styles from "./HistoryDetail.module.scss";
import { useRouter } from "next/router";
import { useState } from "react";
import HistoryPageNation from "./HistoryPagenation";

interface IProps {
  queryKey: string;
  queryApi: any;
  orderList: Array<any>;
}

export default function HistoryDetail({
  queryKey,
  queryApi,
  orderList,
}: IProps) {
  const router = useRouter();

  const { id } = router.query;
  const [orderOpt, setOrderOpt] = useState(orderList[0]);
  const [page, setPage] = useState(1);

  const question: any = useQuery(
    [queryKey, id, orderOpt.value, page],
    queryApi,
    {
      onSuccess: (res) => console.log(res),
    }
  );

  return (
    <details className={styles.activityCont}>
      <summary>
        <div className={styles.titleBox}>
          <h1 className={styles.contTitle}>질문</h1>
          <h3 className={styles.count}>{question.data?.total}개</h3>
        </div>

        <ul className={styles.orderList}>
          {orderList.map((v, i) => (
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
        <ul className={styles.activityList}>
          {question.data?.list?.map((v: any, i: number) => (
            <li key={i} onClick={() => router.push(`/qna/${v.pk}`)}>
              <span
                className={`${styles.votes} ${v.votes > 4 ? styles.plus : ""}`}
              >
                {v.votes}
              </span>
              <p className={styles.title}>{v.title}</p>

              <p className={styles.time}>{timeDifference(v.created_at)}</p>
            </li>
          ))}
        </ul>
      </div>

      <HistoryPageNation
        page={page}
        setPage={setPage}
        total={question.data?.total}
      />
    </details>
  );
}
