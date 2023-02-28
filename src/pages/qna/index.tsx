import { getQnaList, ISearchQnaList } from "@/api/qna/question";
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
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { getLocalStorage } from "@/lib/localStorage";
import { AppState } from "@/store/store";
import { deleteNotification, getNotification } from "@/api/notification";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import { useForm } from "react-hook-form";
import SearchExplainPopup from "@/components/qna/SearchExplainPopup";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Qna() {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryclient = useQueryClient();
  const searchRef = useRef<HTMLInputElement | null>();

  const user = useSelector((state: AppState) => state.common.userInfo);

  const [viewHistory, setViewHistory] = useState<Array<any>>();

  const { register, handleSubmit, watch } = useForm<ISearchQnaList>();
  const { ref, ...rest } = register("search", { required: true });

  const qnaList = useQuery(
    ["qnaList", `${router.query.page || 1}`, router.query.search],
    getQnaList,
    { onSuccess: (res) => console.log(res) }
  );

  const notificationList = useQuery(["notifications"], getNotification, {
    onSuccess: (res) => console.log(res),
  });

  function onSearchSubmit({ search }: ISearchQnaList) {
    const reg = new RegExp(/\[(.*?)\]/);

    let _search: RegExpMatchArray | string | null = search.match(reg);

    if (_search?.length) {
      _search = _search[0].slice(1, -1);
      console.log(_search);
    }

    router.push(`/qna?search=${search}`);
  }

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
            <div className={styles.topBar}>
              <h1 className={styles.listTitle}>
                {router.query.search ?? "모든 질문"}
              </h1>

              <button className={styles.askBtn} onClick={onClickAskBtn}>
                질문하기
              </button>
            </div>

            <form
              className={styles.searchForm}
              onSubmit={handleSubmit(onSearchSubmit)}
            >
              <div className={styles.inputBox}>
                <SearchIcon
                  className={styles.searchIcon}
                  onClick={() => searchRef.current?.focus()}
                />

                <input
                  type="search"
                  {...register("search")}
                  ref={(e) => {
                    ref(e);
                    searchRef.current = e;
                  }}
                  autoComplete="off"
                  placeholder="검색어를 입력해주세요"
                />

                <SearchExplainPopup />
              </div>
            </form>
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
                          <div className={styles.tagBar}>
                            <ul className={styles.tagList}>
                              {v.tag.map((v: any, i: number) => (
                                <li
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/qna?search=[${v.name}]`)
                                  }}
                                >
                                  {v.name}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className={styles.infoBar}>
                            <div
                              className={styles.profBox}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/users/${v.editor?.id || v.creator?.id}`
                                );
                              }}
                            >
                              {v.editor?.avatar || v.creator?.avatar ? (
                                <img
                                  src={v.editor?.avatar || v.creator?.avatar}
                                  alt=""
                                />
                              ) : (
                                <AccountCircleIcon fontSize="inherit" />
                              )}
                              <p className={styles.name}>
                                {v.editor?.name ||
                                  v.creator?.name ||
                                  "비공개 회원"}
                              </p>
                            </div>

                            <p className={styles.updatedAt}>
                              {timeDifference(v.updated_at)}
                            </p>
                          </div>
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
