import { kakaoLogin } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import U_spinner from "@/asset/util/U_spinner.svg";
import styles from "@/styles/pages/auth/email_auth/token/index.module.scss";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

export default function Kakao() {
  const router = useRouter();

  const { code } = router.query;
  const mutationTurnEmailAuth = useMutation(kakaoLogin, {
    onSuccess: () => {
      window.close();
    },
  });

  useEffect(() => {
    if (!code) return;

    mutationTurnEmailAuth.mutate(`${code}`);
  }, [code]);

  return (
    <main className={styles.emailAuthPage}>
      <section className={styles.contSec}>
        <article className={styles.titleArea}>
          <h1 className={styles.title}>카카오를 통한 로그인 중입니다</h1>
          <h3 className={styles.explain}>
            {mutationTurnEmailAuth?.isLoading ? "인증이 진행중입니다" : ""}
            {mutationTurnEmailAuth?.isSuccess ? "인증이 완료되었습니다." : ""}
            {mutationTurnEmailAuth?.isError
              ? `인증에 문제가 발생하였습니다.\n 인증을 다시 요청 해주세요!`
              : ""}
          </h3>
        </article>

        <article className={styles.contArea}>
          {mutationTurnEmailAuth?.isLoading ? (
            <U_spinner className={styles.spinner} />
          ) : null}

          {mutationTurnEmailAuth?.isSuccess ? (
            <SentimentSatisfiedAltIcon fontSize="inherit" />
          ) : null}

          {mutationTurnEmailAuth?.isError ? (
            <SentimentDissatisfiedIcon fontSize="inherit" />
          ) : null}
        </article>
      </section>
    </main>
  );
}
