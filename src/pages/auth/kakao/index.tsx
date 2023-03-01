import { kakaoLogin } from "../../../api/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import U_spinner from "../../../asset/util/U_spinner.svg";
import styles from "./index.module.scss";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { setUserInfo } from "../../../store/reducer/commonReducer";
import { useDispatch } from "react-redux";

export default function Kakao() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { code } = router.query;

  const mutationTurnEmailAuth = useMutation(kakaoLogin, {
    onSuccess: (res) => {
      dispatch(setUserInfo(res.user));
      router.push("/");
    },
  });

  useEffect(() => {
    if (!code) return;

    mutationTurnEmailAuth.mutate(`${code}`);
  }, [code]);

  return (
    <main className={styles.kakaoPage}>
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
