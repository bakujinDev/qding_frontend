import styles from "@/styles/components/header/joinPopup.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import I_kakao from "@/asset/icon/I_kakao.svg";
import GitHubIcon from "@mui/icons-material/GitHub";
import { ILoginVar, usernameJoin, usernameLogin } from "@/api/auth";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailPattern } from "@/lib/useUser";

interface IProps {
  off: Function;
}

export default function JoinPopup({ off }: IProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ILoginVar>();

  const queryClient = useQueryClient();

  const mutation = useMutation(usernameJoin, {
    onSuccess: () => {
      queryClient.refetchQueries(["me"]);
      reset();
      off();
    },
    onError: () => {
      // reset();
    },
  });

  const onSubmit = ({ username, password }: ILoginVar) => {
    mutation.mutate({
      username,
      password,
    });
  };

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
                <p className={styles.key}>비밀번호</p>
                <div className={styles.inputBox}>
                  <input
                    type="password"
                    {...register("password", {
                      required: "비밀번호를 입력해주세요",
                      minLength: { value: 8, message: "8자 이상 입력해주세요" },
                    })}
                    placeholder="비밀번호를 입력해주세요"
                  />
                </div>

                {errors.password?.message ? (
                  <p className={styles.errorText}>{errors.password?.message}</p>
                ) : null}
              </li>
            </ul>

            <div className={styles.loginBox}>
              {mutation.isError ? (
                <p className={styles.errorText}>
                  로그인 계정 정보가 잘못되었습니다
                </p>
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
