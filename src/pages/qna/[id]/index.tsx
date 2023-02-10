import { getQnaPost } from "@/api/qna";
import Seo from "@/components/Seo";
import { timeDifference } from "@/lib/time";
import useUser from "@/lib/user";
import { setLoginPopup } from "@/store/reducer/commonReducer";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import styles from "./qnaPosts.module.scss";

export default function QnaPosts() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useUser();
  const { id } = router.query;

  const { data, isSuccess } = useQuery(["postQuery", `${id}`], getQnaPost, {
    retry: false,
  });

  console.log(isSuccess);

  return isSuccess ? (
    <>
      <Seo title={data.title} />

      <main className={styles.qnaPosts}>
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
            <ReactQuill
              className={`${styles.quill} readOnlyQuill`}
              readOnly={true}
              modules={{ toolbar: false }}
              value={data.content}
            />
          </article>
        </section>

        {/* {.map((v, i) => (
          <li key={i}>{v}</li>
          ))} */}
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
