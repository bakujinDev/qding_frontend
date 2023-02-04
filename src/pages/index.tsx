import { getQnaList } from "@/api/qna";
import { timeDifference } from "@/lib/time";
import useUser from "@/lib/user";
import { setLoginPopup } from "@/store/reducer/commonReducer";
import styles from "@/styles/pages/home.module.scss";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const qnaList = useQuery(["qnaList"], getQnaList, {});
  const { user } = useUser();

  function onClickAskBtn() {
    if (user) router.push("/qna/ask");
    else {
      toast("질문하기를 사용할려면 로그인이 필요해요");
      dispatch(setLoginPopup(true));
    }
  }

  return (
    <main className={styles.home}>
      <section className={styles.questionSec}>
        <article className={styles.topArea}>
          <button className={styles.askBtn} onClick={onClickAskBtn}>
            질문하기
          </button>
        </article>

        <article className={styles.listArea}>
          {qnaList.isLoading ? null : (
            <ul className={styles.qnaList}>
              {qnaList.data.map((v: any, i: number) => (
                <li key={i}>
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
                      <p className={styles.content}>{v.content}</p>
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
          )}
        </article>
      </section>
    </main>
  );
}
