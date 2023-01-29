import styles from "@/styles/components/header/loginPopup.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import I_kakao from "@/asset/icon/I_kakao.svg";
import GitHubIcon from "@mui/icons-material/GitHub";
import { ILoginVar, usernameLogin } from "@/api/auth";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function LoginPopup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ILoginVar>();

  const queryClient = useQueryClient();

  const mutation = useMutation(usernameLogin, {
    onSuccess: () => {
      queryClient.refetchQueries(["me"]);
      alert("lgoin");
      reset();
    },
    onError: () => {
      reset();
    },
  });

  const onSubmit = ({ username, password }: ILoginVar) => {
    mutation.mutate({
      username,
      password,
    });
  };

  return (
    <section className={`${styles.loginPopup} defaultPopup`}>
      <article className={styles.topBar}>
        <h1 className={styles.title}>로그인</h1>
        <CloseIcon />
      </article>

      <article className={styles.contArea}>
        <div className={styles.formBox}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ul className={styles.inputList}>
              <li>
                <p className={styles.key}>아이디</p>
                <div className={styles.inputBox}>
                  <input {...register("username")} placeholder="" />
                </div>
              </li>

              <li>
                <p className={styles.key}>비밀번호</p>
                <div className={styles.inputBox}>
                  <input
                    type="password"
                    {...register("password")}
                    placeholder=""
                  />
                </div>
              </li>
            </ul>

            <button className={styles.loginBtn} onClick={() => {}}>
              로그인
            </button>
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
