import { apiInstance } from "@/api/instance";
import { setUserInfo } from "@/store/reducer/commonReducer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getMe, refreshToken } from "../api/auth";

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
      dispatch(setUserInfo(null));
      if (err.response?.data?.code === "user_inactive") return;

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

const TSocialLogin = {
  GITHUB: "Github",
  KAKAO: "Kakao",
} as const;
type TSocialLogin = typeof TSocialLogin[keyof typeof TSocialLogin];

interface IOnClickSocialBtn {
  type: TSocialLogin;
  off: Function;
}

export function onClickSocialBtn({ type, off }: IOnClickSocialBtn) {
  let params;
  switch (type) {
    case "Kakao":
      const kakaoParams = {
        client_id: "18dba6cfddc30770776200dda585923d",
        redirect_uri: "http://127.0.0.1:3000/auth/kakao",
        response_type: "code",
      };
      params = new URLSearchParams(kakaoParams).toString();
      window.open(
        `https://kauth.kakao.com/oauth/authorize?${params}`,
        "_blank"
      );
      off();
      break;

    case "Github":
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
