import styles from "./menuPopup.module.scss";
import { logout } from "@/api/auth";
import { apiInstance } from "@/api/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { AppState } from "@/store/store";
import { useRouter } from "next/router";

interface IProps {
  off: Function;
}

export default function MenuPopup({ off }: IProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useSelector((state: AppState) => state.common.userInfo);

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
        <li onClick={() => router.push(`/users/${user.pk}`)}>프로필</li>
        <li onClick={onClickLogoutBtn}>로그아웃</li>
      </ul>
    </section>
  );
}
