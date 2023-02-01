import styles from "@/styles/components/header/joinPopup.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import I_kakao from "@/asset/icon/I_kakao.svg";
import GitHubIcon from "@mui/icons-material/GitHub";
import { ILoginVar, usernameJoin, usernameLogin } from "@/api/auth";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUser, { emailPattern } from "@/lib/useUser";

interface IProps {
  off: Function;
}

export default function EmailAuthPopup({ off }: IProps) {
  const { user } = useUser();

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
        <h1 className={styles.title}>회원 인증</h1>

        <button className={styles.closeBtn} onClick={() => off()}>
          <CloseIcon />
        </button>
      </article>

      <article className={styles.contArea}>
        <div className={styles.explainCont}>
          <h2>이메일 본인인증을 하면 커뮤니티 활동을 하실 수 있어요!</h2>
        </div>

        <button className={styles.loginBtn} onClick={() => {}}>
          {`${user.username}으로 인증메일 보내기`}
        </button>
      </article>
    </section>
  );
}
