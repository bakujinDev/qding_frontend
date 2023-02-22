import Seo from "@/components/Seo";
import styles from "./Profile.module.scss";
import WorkIcon from "@mui/icons-material/Work";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  getProfileAnswers,
  getProfileQuestions,
  getUserProfile,
} from "@/api/user";
import { D_orderList } from "@/lib/profile";
import QuestionHistory from "@/components/users/history/QuestionHistory";
import AnswerHistory from "@/components/users/history/AnswerHistory";
import TagLank from "@/components/users/TagLank";

export default function Profile() {
  const router = useRouter();

  const { id } = router.query;

  const user = useQuery(["user", id], getUserProfile, {
    onSuccess: (res) => console.log(res),
  });

  return (
    <>
      <Seo title={user.data?.name} />

      <main className={styles.profile}>
        <section className={styles.innerSec}>
          <article className={styles.profileArea}>
            <div className={styles.profImgCont}>
              <img className={styles.profImg} src={user.data?.avatar} alt="" />
              <button className={styles.msgBtn} onClick={() => {}}>
                메세지 보내기
              </button>
            </div>

            <div className={styles.contCont}>
              <h2 className={styles.nickname}>{user.data?.name}</h2>

              <p className={styles.profMsg}>
                프로필 메시지메시지프로필 메시지메시지프로필 메시지메시지프로필
                메시지메시지프로필 메시지메시지프로필 메시지메시지프로필
                메시지메시지프로필 메시지메시지프로필 메시지메시지프로필
                메시지메시지프로필 메시지메시지프로필 메시지메시지프로필
                메시지메시지프로필 메시지메시지프로필 메시지메시지
              </p>

              <ul className={styles.urlList}>
                <li>
                  <p className={styles.key}>블로그</p>
                  <p className={styles.value}>http://blog.naver.com/test0000</p>
                </li>

                <li>
                  <p className={styles.key}>깃허브</p>
                  <p className={styles.value}>http://blog.naver.com/test0000</p>
                </li>
              </ul>
            </div>
          </article>

          <article className={styles.careerArea}>
            <ul className={styles.careerList}>
              <li>
                <WorkIcon />

                <span className={styles.textBox}>
                  <span className={styles.office}>
                    <p className={styles.officeName}>구글</p>

                    <p className={styles.work}>프론트 엔지니어</p>
                  </span>

                  <hr />

                  <span className={styles.termsBox}>
                    <p className={styles.time}>2022.12 ~ 현재</p>

                    <p className={styles.terms}>- 1년 5개월</p>
                  </span>
                </span>
              </li>

              <li>
                <WorkIcon />

                <span className={styles.textBox}>
                  <span className={styles.office}>
                    <p className={styles.officeName}>구글</p>

                    <p className={styles.work}>프론트 엔지니어</p>
                  </span>

                  <hr />

                  <span className={styles.termsBox}>
                    <p className={styles.time}>2022.12 ~ 현재</p>

                    <p className={styles.terms}>- 1년 5개월</p>
                  </span>
                </span>
              </li>
            </ul>
          </article>

          <article className={styles.activityArea}>
            <TagLank />
          </article>

          <article className={styles.activityArea}>
            <QuestionHistory />
          </article>

          <article className={styles.activityArea}>
            <AnswerHistory />
          </article>
        </section>
      </main>
    </>
  );
}
