import { getQnaList } from "@/api/qna/question";
import { timeDifference } from "@/lib/time";
import { setLoginPopup } from "@/store/reducer/commonReducer";
import styles from "./index.module.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { extractContent } from "@/lib/forum";
import Seo from "@/components/Seo";
import PageNation from "@/components/common/Pagenation";
import { SyntheticEvent, useEffect, useState } from "react";
import { getLocalStorage } from "@/lib/localStorage";
import { AppState } from "@/store/store";
import { deleteNotification, getNotification } from "@/api/notification";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

export default function Qna() {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryclient = useQueryClient();
  const user = useSelector((state: AppState) => state.common.userInfo);

  const [viewHistory, setViewHistory] = useState<Array<any>>();

  const qnaList = useQuery(
    ["qnaList", `${router.query.page || 1}`],
    getQnaList,
    { onSuccess: (res) => console.log(res) }
  );
  const notificationList = useQuery(["notifications"], getNotification, {
    onSuccess: (res) => console.log(res),
  });

  const deleteNotificationMutation = useMutation(deleteNotification, {});

  function onClickAskBtn() {
    if (user) router.push("/qna/ask");
    else {
      toast("질문하기를 사용할려면 로그인이 필요해요");
      dispatch(setLoginPopup(true));
    }
  }

  function onClickNotification(notification: any) {
    router.push(notification.push_url);
    deleteNotificationMutation.mutate(
      {
        pk: notification.pk,
      },
      { onSuccess: (res) => queryclient.refetchQueries(["notifications"]) }
    );
  }

  function onCLickNotificationDeleteBtn(e: SyntheticEvent, notification: any) {
    e.stopPropagation();
    deleteNotificationMutation.mutate(
      {
        pk: notification.pk,
      },
      { onSuccess: (res) => queryclient.refetchQueries(["notifications"]) }
    );
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
                    <li key={i} onClick={() => router.push(`/qna/${v.pk}`)}>
                      <ul className={styles.utilList}>
                        <li className={styles.views}>
                          <p className={styles.key}>좋아요</p>
                          <p className={styles.value}>{v.votes}</p>
                        </li>

                        <li className={styles.views}>
                          <div className={styles.key}>
                            {v.select_answer ? <CheckIcon /> : null}
                            <p>답변수</p>
                          </div>
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

                <PageNation total={qnaList.data?.total} />
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

          <details className={styles.notification} open>
            <summary>알림</summary>

            <div className={styles.valueBox}>
              {notificationList.data && notificationList.data.length > 0 ? (
                <ul className={styles.valueList}>
                  {notificationList.data.map((v: any, i: number) => (
                    <li key={i} onClick={() => onClickNotification(v)}>
                      <p>{v.content}</p>

                      <button
                        className={styles.delBtn}
                        onClick={(e) => onCLickNotificationDeleteBtn(e, v)}
                      >
                        <CloseIcon />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.nullBox}>새로운 알람이 없습니다</div>
              )}
            </div>
          </details>
        </aside>
      </main>
    </>
  );
}
