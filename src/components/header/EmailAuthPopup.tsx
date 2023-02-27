import styles from "./emailAuthPopup.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import { requestAuthEmail, getIsEmailAuth } from "@/api/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ApiCoolTime } from "@/lib/setting";
import { useSelector } from "react-redux";
import { AppState } from "@/store/store";

interface IProps {
  off: Function;
}

export default function EmailAuthPopup({ off }: IProps) {
  const [requestMail, setRequestMail] = useState<boolean>(false);
  const [requestCoolTime, setRequestCoolTime] = useState<number>(0);

  const user = useSelector((state: AppState) => state.common.userInfo);

  const mutation = useMutation(requestAuthEmail, {
    onSuccess: () => {
      setRequestMail(true);
      setRequestCoolTime(ApiCoolTime);
    },
  });

  const isEmailAuth = useQuery(["isEmailAuth"], getIsEmailAuth, {
    enabled: false,
    retry: false,
    onSuccess: () => {
      off();
    },
  });

  const onClickAuthBtn = () => {
    mutation.mutate();
  };

  function onClickDoneBtn() {
    isEmailAuth.refetch();
  }

  useEffect(() => {
    const countdown = setInterval(() => {
      if (requestCoolTime > 0) setRequestCoolTime(requestCoolTime - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [requestCoolTime]);

  return (
    <section className={`${styles.emaipAuthPopup} defaultPopup`}>
      <article className={styles.topBar}>
        <h1 className={styles.title}>회원 인증</h1>

        <button className={styles.closeBtn} onClick={() => off()}>
          <CloseIcon />
        </button>
      </article>

      <article className={styles.contArea}>
        <div className={styles.explainCont}>
          <h2>해당 이메일로 로그인 메일이 전송되었어요</h2>
        </div>

        <div className={styles.actionCont}>
          {isEmailAuth.isError ? (
            <p className={styles.alarm}>
              인증이 확인되지 않습니다.
              <br />
              메일을 다시 확인해주세요.
            </p>
          ) : null}

          <div className={styles.actionBox}>
            {requestMail ? (
              <>
                <button className={styles.actionBtn} onClick={onClickDoneBtn}>
                  <p>인증 완료</p>
                </button>

                <button
                  className={styles.resendbtn}
                  disabled={requestCoolTime > 0}
                  onClick={() => onClickAuthBtn()}
                >
                  <p>인증메일 다시 보내기</p>
                  {requestCoolTime > 0 ? <p>{requestCoolTime}초</p> : null}
                </button>
              </>
            ) : (
              <button
                className={styles.actionBtn}
                disabled={!user?.username}
                onClick={() => onClickAuthBtn()}
              >
                <p>{user?.username}</p>
                <p>으로 인증메일 보내기</p>
              </button>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}
