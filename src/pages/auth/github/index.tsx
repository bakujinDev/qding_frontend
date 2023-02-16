import { githubLogin } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import U_spinner from "@/asset/util/U_spinner.svg";
import styles from "./index.module.scss";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export default function Github() {
  const router = useRouter();

  const { code } = router.query;
  const mutationGithubLogin = useMutation(githubLogin, {
    onSuccess: () => {
      window.close();
    },
  });

  useEffect(() => {
    if (!code) return;

    mutationGithubLogin.mutate(`${code}`);
  }, [code]);

  return (
    <main className={styles.emailAuthPage}>
      <section className={styles.contSec}>
        <article className={styles.titleArea}>
          <h1 className={styles.title}>깃허브를 통한 로그인 중입니다</h1>
          <h3 className={styles.explain}>
            {mutationGithubLogin?.isLoading ? "인증이 진행중입니다" : ""}
            {mutationGithubLogin?.isSuccess ? "인증이 완료되었습니다." : ""}
            {mutationGithubLogin?.isError
              ? `인증에 문제가 발생하였습니다.\n 인증을 다시 요청 해주세요!`
              : ""}
          </h3>
        </article>

        <article className={styles.contArea}>
          {mutationGithubLogin?.isLoading ? (
            <U_spinner className={styles.spinner} />
          ) : null}

          {mutationGithubLogin?.isSuccess ? (
            <SentimentSatisfiedAltIcon fontSize="inherit" />
          ) : null}

          {mutationGithubLogin?.isError ? (
            <SentimentDissatisfiedIcon fontSize="inherit" />
          ) : null}
        </article>
      </section>
    </main>
  );
}
