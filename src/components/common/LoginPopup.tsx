import styles from "./loginPopup.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import I_kakao from "@/asset/icon/I_kakao.svg";
import GitHubIcon from "@mui/icons-material/GitHub";
import { ILogin, usernameLogin } from "@/api/auth";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { emailPattern, onClickSocialBtn } from "@/lib/user";
import U_spinner from "@/asset/util/U_spinner.svg";

interface IProps {
  off: Function;
}

export default function LoginPopup({ off }: IProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ILogin>();

  const mutation = useMutation(usernameLogin);

  const onSubmit = ({ username }: ILogin) => {
    mutation.mutate({
      username,
    });
  };

  return (
    <section className={`${styles.loginPopup} defaultPopup`}>
      <article className={styles.topBar}>
        <h1 className={styles.title}>로그인</h1>

        <button className={styles.closeBtn} onClick={() => off()}>
          <CloseIcon />
        </button>
      </article>

      <article className={styles.contArea}>
        <div className={styles.formBox}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ul className={styles.inputList}>
              <li>
                <p className={styles.key}>아이디</p>
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
            </ul>

            <div className={styles.loginBox}>
              {mutation.isError ? (
                <p className={styles.errorText}>
                  로그인 계정 정보가 잘못되었습니다
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

              <button className={styles.loginBtn} disabled={mutation.isLoading}>
                <p>로그인</p>

                {mutation.isLoading ? (
                  <U_spinner className={styles.spinner} />
                ) : null}
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
              <button
                onClick={() =>
                  onClickSocialBtn({ type: "kakao", off: () => off() })
                }
              >
                <I_kakao />
                <p>카카오 로그인</p>
              </button>
            </li>

            <li className={styles.github}>
              <button
                onClick={() =>
                  onClickSocialBtn({ type: "github", off: () => off() })
                }
              >
                <GitHubIcon />
                <p>깃허브 로그인</p>
              </button>
            </li>
          </ul>
        </div>
      </article>
    </section>
  );
}
