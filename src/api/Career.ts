import { QueryFunctionContext } from "@tanstack/react-query";
import { apiInstance } from "./instance";

type QueryUserId = [string, (string | string[])?];

export const getUserCareer = ({
  queryKey,
}: QueryFunctionContext<QueryUserId>) => {
  const [_, id] = queryKey;

  if (!id) return false;

  return apiInstance.get(`users/careers/@${id}`).then((res) => res.data);
};
