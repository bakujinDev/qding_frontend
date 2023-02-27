import styles from "./joinPopup.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import I_kakao from "@/asset/icon/I_kakao.svg";
import GitHubIcon from "@mui/icons-material/GitHub";
import { IJoin, ILogin, usernameJoin } from "@/api/auth";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailPattern } from "@/lib/user";
import { setEmailAuthPopup } from "@/store/reducer/commonReducer";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import CheckIcon from "@mui/icons-material/Check";

interface IProps {
  off: Function;
}

export default function JoinPopup({ off }: IProps) {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<IJoin>({});

  const mutation = useMutation(usernameJoin);

  const onSubmit = ({ username }: ILogin) => {
    mutation.mutate({
      username,
    });
  };

  useEffect(() => {
    register("termAgree", { required: "이용약관에 동의해주세요" });
  }, []);

  return (
    <section className={`${styles.joinPopup} defaultPopup`}>
      <article className={styles.topBar}>
        <h1 className={styles.title}>회원가입</h1>

        <button className={styles.closeBtn} onClick={() => off()}>
          <CloseIcon />
        </button>
      </article>

      <article className={styles.contArea}>
        <div className={styles.formBox}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ul className={styles.inputList}>
              <li>
                <p className={styles.key}>이메일</p>
                <div className={styles.inputBox}>
                  <input
                    {...register("username", {
                      required: "이메일을 입력해주세요",
                      pattern: {
                        value: emailPattern,
                        message: "이메일을 형식을 확인해주세요",
                      },
                    })}
                    placeholder="이메일을 입력해주세요"
                  />
                </div>

                {errors.username?.message ? (
                  <p className={styles.errorText}>{errors.username?.message}</p>
                ) : null}
              </li>

              <li>
                <button
                  type="button"
                  className={`${styles.agree} ${
                    watch("termAgree") ? styles.on : ""
                  }`}
                  onClick={() => setValue("termAgree", !watch("termAgree"))}
                >
                  <span className={styles.chkBox}>
                    <CheckIcon />
                  </span>

                  <p>
                    Qding의 <strong>이용약관</strong>에 동의(필수)
                  </p>
                </button>

                {errors.termAgree?.message ? (
                  <p className={styles.errorText}>{errors.termAgree?.message}</p>
                ) : null}
              </li>
            </ul>

            <div className={styles.loginBox}>
              {mutation.isError ? (
                <p className={styles.errorText}>
                  {(mutation.error as any).response?.data?.detail}
                </p>
              ) : null}

              {mutation.isSuccess ? (
                <div className={styles.mailSendBox}>
                  <p className={styles.sendMsg}>
                    해당 메일로 로그인 링크가 전송되었어요!
                  </p>

                  <button
                    className={styles.linkBtn}
                    onClick={() =>
                      window.open(
                        `http://${watch("username").split("@")[1]}`,
                        "_blank"
                      )
                    }
                  >
                    {watch("username").split("@")[1]}로 이동하기
                  </button>
                </div>
              ) : null}

              <button className={styles.loginBtn} onClick={() => {}}>
                회원가입
              </button>
            </div>
          </form>
        </div>

        <div className={styles.hrBox}>
          <hr />
          <p>또는</p>
          <hr />
        </div>

        <div className={styles.socialBox}>
          <ul className={styles.socialList}>
            <li className={styles.kakao}>
              <I_kakao />
              카카오 로그인
            </li>

            <li className={styles.github}>
              <GitHubIcon />
              깃허브 로그인
            </li>
          </ul>
        </div>
      </article>
    </section>
  );
}
