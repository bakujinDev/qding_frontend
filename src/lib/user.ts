import { apiInstance } from "@/api/instance";
import { setUserInfo } from "@/store/reducer/commonReducer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getMe, refreshToken } from "../api/Auth";

export default function useUser() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { isLoading, data, isError } = useQuery(["me"], getMe, {
    retry: false,
    onSuccess: (res) => {
      console.log("me", res);
      dispatch(setUserInfo(res));
    },
    onError: (err: any) => {
      if (err.response?.data?.code === "user_inactive") return;
      if (err.response?.data?.code === "user_not_found") return;

      if (localStorage.getItem("refresh_token")) refreshTokenMutation.mutate();
    },
  });

  const refreshTokenMutation = useMutation(refreshToken, {
    onSuccess: (res) => {
      console.log("refetch", res);
      queryClient.refetchQueries(["me"]);
    },
    onError: () => {
      apiInstance.defaults.headers.common["Authorization"] = null;
      localStorage.removeItem("refresh_token");
    },
  });

  return {
    userLoading: isLoading,
    user: data,
    isLoggedIn: !isError,
  };
}

export const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const urlPattern =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

interface IOnClickSocialBtn {
  type: "github" | "kakao";
  off: Function;
}

export function onClickSocialBtn({ type, off }: IOnClickSocialBtn) {
  let params;
  switch (type) {
    case "kakao":
      const kakaoParams = {
        client_id: "18dba6cfddc30770776200dda585923d",
        redirect_uri: "https://roaring-dodol-d73703.netlify.app/auth/kakao",
        response_type: "code",
      };
      params = new URLSearchParams(kakaoParams).toString();
      window.open(
        `https://kauth.kakao.com/oauth/authorize?${params}`,
        "_blank"
      );
      off();
      break;

    case "github":
      const githubParams = {
        client_id: "95bab3171f91c36f06cc",
        scope: "read:user,user:email",
      };
      params = new URLSearchParams(githubParams).toString();
      window.open(
        `https://github.com/login/oauth/authorize?${params}`,
        "_blank"
      );
      off();
      break;
  }
}
