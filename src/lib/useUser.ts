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

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

export function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name[0]}`,
  };
}
