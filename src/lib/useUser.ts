import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, refreshToken } from "../api/auth";

export default function useUser() {
  const queryClient = useQueryClient();

  const { isLoading, data, isError } = useQuery(["me"], getMe, {
    retry: false,
    onError: () => {
      if (localStorage.getItem("refresh_token")) refreshTokenMutation.mutate();
    },
  });

  const refreshTokenMutation = useMutation(refreshToken, {
    onSuccess: () => {
      queryClient.refetchQueries(["me"]);
    },
    onError: () => localStorage.removeItem("refresh_token"),
  });

  return {
    userLoading: isLoading,
    user: data,
    isLoggedIn: !isError,
  };
}
