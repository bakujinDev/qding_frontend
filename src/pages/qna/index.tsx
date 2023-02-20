import { getQnaList } from "@/api/qna";
import { timeDifference } from "@/lib/time";
import useUser from "@/lib/user";
import { setLoginPopup } from "@/store/reducer/commonReducer";
import styles from "./index.module.scss";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { extractContent } from "@/lib/forum";
import Seo from "@/components/Seo";
import PageNation from "@/components/common/Pagenation";
import { useEffect, useState } from "react";
import { getLocalStorage } from "@/lib/localStorage";
import { AppState } from "@/store/store";

export default function Qna() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.common.userInfo);

  const [viewHistory, setViewHistory] = useState<Array<any>>();

  const qnaList = useQuery(
    ["qnaList", `${router.query.page || 1}`],
    getQnaList,
    {
      onSuccess: (res) => console.log(res),
    }
  );

  function onClickAskBtn() {
    if (user) router.push("/qna/ask");
    else {
      toast("질문하기를 사용할려면 로그인이 필요해요");
      dispatch(setLoginPopup(true));
    }
  }

  useEffect(() => {
    setViewHistory(getLocalStorage("qnaPostHistory"));
  }, []);

  return (
    <>
      <Seo title="Qna" />
      <main className={styles.qna}>
        <section className={styles.questionSec}>
          <article className={styles.topArea}>
            <button className={styles.askBtn} onClick={onClickAskBtn}>
              질문하기
            </button>
          </article>

          <article className={styles.listArea}>
            {qnaList.isLoading ? null : (
              <>
                <ul className={styles.qnaList}>
                  {qnaList.data?.list.map((v: any, i: number) => (
                    <li key={i} onClick={() => router.push(`qna/${v.pk}`)}>
                      <ul className={styles.utilList}>
                        <li className={styles.views}>
                          <p className={styles.key}>좋아요</p>
                          <p className={styles.value}>{v.votes}</p>
                        </li>

                        <li className={styles.views}>
                          <p className={styles.key}>답변수</p>
                          <p className={styles.value}>{v.answers_count}</p>
                        </li>

                        <li className={styles.views}>
                          <p className={styles.key}>조회수</p>
                          <p className={styles.value}>{v.views}</p>
                        </li>
                      </ul>

                      <div className={styles.contBox}>
                        <div className={styles.textBox}>
                          <h1 className={styles.title}>{v.title}</h1>
                          <p className={styles.content}>
                            {extractContent(v.content)}
                          </p>
                        </div>

                        <div className={styles.bottomBar}>
                          <ul className={styles.tagList}>
                            {v.tag.map((v: any, i: number) => (
                              <li key={i}>{v.name}</li>
                            ))}
                          </ul>

                          <p className={styles.updatedAt}>
                            {timeDifference(v.updated_at)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <PageNation count={qnaList.data?.total} />
              </>
            )}
          </article>
        </section>

        <aside className={styles.aside}>
          <details className={styles.viewHistory} open>
            <summary>최근 본 게시물</summary>

            <div className={styles.valueBox}>
              <ul className={styles.valueList}>
                {viewHistory
                  ? viewHistory.map((v: any, i: number) =>
                      v.title && v.id ? (
                        <li key={i} onClick={() => router.push(`/qna/${v.id}`)}>
                          <p>{v.title}</p>
                        </li>
                      ) : null
                    )
                  : null}
              </ul>
            </div>
          </details>
        </aside>
      </main>
    </>
  );
}
