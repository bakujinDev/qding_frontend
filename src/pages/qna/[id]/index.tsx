import { getQnaPost, postQuestionComment } from "@/api/qna";
import Seo from "@/components/Seo";
import { timeDifference } from "@/lib/time";
import useUser from "@/lib/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import styles from "./qnaPosts.module.scss";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import FlagIcon from "@mui/icons-material/Flag";
import HistoryIcon from "@mui/icons-material/History";

export default function QnaPosts() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useUser();
  const { id } = router.query;

  const { data, isSuccess } = useQuery(["postQuery", `${id}`], getQnaPost, {
    retry: false,
  });

  const commentMutation = useMutation(postQuestionComment, {
    onSuccess: (res) => {
      console.log(res);
    },
  });

  console.log(data);

  return isSuccess ? (
    <>
      <Seo title={data.title} />

      <main className={styles.qnaPosts}>
        <button
          onClick={() =>
            commentMutation.mutate({
              id: `${id}`,
              content: "hi",
            })
          }
        >
          hi
        </button>
        <section className={styles.questionSec}>
          <article className={styles.topBar}>
            <div className={styles.titleBox}>
              <h1 className={styles.title}>{data.title}</h1>
            </div>

            <div className={styles.infoBox}>
              <span className={styles.view}>
                <p className={styles.key}>조회수</p>
                <p className={styles.value}>{data.views}</p>
              </span>

              <span className={styles.updatedAt}>
                <p className={styles.value}>
                  {timeDifference(data.updated_at)}
                </p>
              </span>
            </div>
          </article>

          <article className={styles.contArea}>
            <div className={styles.utilBox}>
              <button
                className={`${styles.upBtn} ${styles.voteBtn}`}
                onClick={() => {}}
              >
                <ThumbUpAltIcon />
              </button>

              <p>{data.votes}</p>

              <button
                className={`${styles.downBtn} ${styles.voteBtn}`}
                onClick={() => {}}
              >
                <ThumbDownAltIcon />
              </button>

              <button className={styles.historyBtn} onClick={() => {}}>
                <HistoryIcon />
              </button>

              <button className={styles.flagBtn} onClick={() => {}}>
                <FlagIcon />
              </button>
            </div>

            <div className={styles.contCont}>
              <div className={styles.quillBox}>
                <ReactQuill
                  className={`${styles.quill} readOnlyQuill`}
                  readOnly={true}
                  modules={{ toolbar: false }}
                  value={data.content}
                />
              </div>

              <div className={styles.tagBar}>
                <ul className={styles.tagList}>
                  {data.tag.map((tag: any, i: number) => (
                    <li key={i}>{tag.name}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.utilBar}>
                <div className={styles.btnBox}>
                  <button className={styles.editBtn} onClick={() => {}}>
                    수정하기
                  </button>

                  <button className={styles.followBtn} onClick={() => {}}>
                    알람받기
                  </button>

                  <button className={styles.shareBtn} onClick={() => {}}>
                    공유하기
                  </button>
                </div>

                <div className={styles.profBox}>
                  <img
                    src={data.editor?.avatar || data.creator.avatar}
                    alt=""
                  />
                  <p className={styles.name}>
                    {data.editor?.name || data.creator.name}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className={styles.replyArea}>
            <ul className={styles.replyList}>
              {data.question_comments.map((v: any, i: number) => (
                <li key={i}>
                  <div className={styles.utilBox}>
                    <button
                      className={`${styles.upBtn} ${styles.voteBtn}`}
                      onClick={() => {}}
                    >
                      <ThumbUpAltIcon />
                    </button>

                    <p>{data.votes}</p>

                    <button
                      className={`${styles.downBtn} ${styles.voteBtn}`}
                      onClick={() => {}}
                    >
                      <ThumbDownAltIcon />
                    </button>

                    <button className={styles.flagBtn} onClick={() => {}}>
                      <FlagIcon />
                    </button>
                  </div>

                  <div className={styles.contBox}>
                    <p className={styles.content}>{v.content} -</p>
                    <p className={styles.name}>{v.creator.name}</p>
                    <p className={styles.updatedAt}>
                      {timeDifference(data.updated_at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </>
  ) : (
    <></>
  );
}

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    return ({ forwardedRef, ...props }: any) => (
      <RQ ref={forwardedRef} {...props} />
    );
  },
  {
    ssr: false,
  }
);
