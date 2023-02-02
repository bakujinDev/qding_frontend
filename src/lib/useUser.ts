import { apiInstance } from "@/api/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, refreshToken } from "../api/auth";

export default function useUser() {
  const queryClient = useQueryClient();

  const { isLoading, data, isError } = useQuery(["me"], getMe, {
    retry: false,
    onError: (err: any) => {
      if (err.response?.data?.code === "user_inactive") return;

      if (localStorage.getItem("refresh_token")) refreshTokenMutation.mutate();
    },
  });

  const refreshTokenMutation = useMutation(refreshToken, {
    onSuccess: () => {
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
