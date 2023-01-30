import { logout } from "@/api/auth";
import { apiInstance } from "@/api/common";
import styles from "@/styles/components/header/menuPopup.module.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IProps {
  off: React.MouseEventHandler<HTMLButtonElement>;
}

export default function MenuPopup({ off }: IProps) {
  const queryClient = useQueryClient();

  const logoutMutation = useMutation(logout, {
    onSuccess: () => {
      apiInstance.defaults.headers.common["Authorization"] = null;
      queryClient.refetchQueries(["me"]);
    },
  });

  function onClickLogoutBtn() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) logoutMutation.mutate({ refresh: refreshToken });
  }

  return (
    <section className={styles.menuPopup}>
      <ul className={styles.menuList}>
        <li onClick={onClickLogoutBtn}>로그아웃</li>
      </ul>
    </section>
  );
}
