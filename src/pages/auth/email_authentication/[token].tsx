import { getMe, turnEmailAuh } from "@/api/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import U_spinner from "@/asset/util/U_spinner.svg";
import styles from "./token.module.scss";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/store/reducer/commonReducer";
import { apiInstance } from "@/api/instance";

export default function EmailAuthentication() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { token } = router.query;

  const mutationTurnEmailAuth = useMutation(turnEmailAuh, {
    onSuccess: (res) => {
      dispatch(setUserInfo(res.user));
      router.push("/");
    },
    onError: (res) => console.log(res),
  });

  useEffect(() => {
    if (!token) return;

    mutationTurnEmailAuth.mutate({ token: `${token}` });
  }, [token]);

  useEffect(() => {
    console.log(apiInstance.defaults.headers.common["Authorization"]);
  }, []);

  return (
    <main className={styles.emailAuthPage}>
      <section className={styles.contSec}>
        <article className={styles.titleArea}>
          <h1 className={styles.title}>
            Qding 서비스 이용을 위한
            <br /> 메일 인증 페이지 입니다.
          </h1>
          <h3 className={styles.explain}>
            {mutationTurnEmailAuth?.isLoading ? "인증이 진행중입니다" : ""}
            {mutationTurnEmailAuth?.isSuccess ? "인증이 완료되었습니다." : ""}
            {mutationTurnEmailAuth?.isError
              ? `인증에 문제가 발생하였습니다.\n인증 메일을 다시 요청 해주세요!`
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
