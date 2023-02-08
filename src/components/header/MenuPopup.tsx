import styles from "./menuPopup.module.scss";
import { logout } from "@/api/auth";
import { apiInstance } from "@/api/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IProps {
  off: Function;
}

export default function MenuPopup({ off }: IProps) {
  const queryClient = useQueryClient();

  const logoutMutation = useMutation(logout, {
    onSuccess: () => {
      apiInstance.defaults.headers.common["Authorization"] = null;
      queryClient.refetchQueries(["me"]);
      off();
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
