import { getQnaList } from "@/api/qna";
import { timeDifference } from "@/lib/time";
import styles from "@/styles/pages/home.module.scss";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const qnaList = useQuery(["qnaList"], getQnaList, {});

  console.log(qnaList.data);

  // const { isLoading, data, isError } = useQuery(["me"], getMe, {
  //   retry: false,
  //   onError: (err: any) => {
  //     if (err.response?.data?.code === "user_inactive") return;

  //     if (localStorage.getItem("refresh_token")) refreshTokenMutation.mutate();
  //   },
  // });
  return (
    <main className={styles.home}>
      <section className={styles.questionSec}>
        <article className={styles.topArea}>
          <button className={styles.askBtn} onClick={() => {}}>
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
