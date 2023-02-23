import { getUserProfile } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Seo from "../Seo";
import styles from "./Profile.module.scss";
import ArticleIcon from "@mui/icons-material/Article";
import GitHubIcon from "@mui/icons-material/GitHub";

export default function Profile() {
  const router = useRouter();

  const { id } = router.query;

  const user = useQuery(["user", id], getUserProfile, {
    onSuccess: (res) => console.log(res),
  });

  return (
    <>
      <Seo title={user.data?.name} />

      <article className={styles.profileArea}>
        <div className={styles.profImgCont}>
          <span className={styles.profImgBox}>
            <img className={styles.profImg} src={user.data?.avatar} alt="" />
          </span>

          <div className={styles.infoBox}>
            <h2 className={styles.nickname}>{user.data?.name}</h2>

            <p className={styles.profMsg}>
              {user.data?.introduce || "등록된 메세지가 없습니다."}
            </p>
          </div>

          <button
            className={styles.editBtn}
            onClick={() => router.push(`/users/${id}/edit`)}
          >
            프로필 수정
          </button>
        </div>

        <div className={styles.utilCont}>
          <button className={styles.msgBtn} onClick={() => {}}>
            메세지 보내기
          </button>

          <ul className={styles.urlList}>
            {user.data?.blog ? (
              <li>
                <button
                  className={styles.linkBtn}
                  onClick={() => window.open(user.data?.blog, "_blank")}
                >
                  <ArticleIcon />
                </button>
              </li>
            ) : null}

            {user.data?.github ? (
              <li>
                <button
                  className={styles.linkBtn}
                  onClick={() => window.open(user.data?.github, "_blank")}
                >
                  <GitHubIcon />
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      </article>
    </>
  );
}
