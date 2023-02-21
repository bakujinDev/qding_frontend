import { QueryFunctionContext } from "@tanstack/react-query";
import { apiInstance } from "./instance";

type QueryUserId = [string, (string | string[])?];

export const getUserProfile = ({
  queryKey,
}: QueryFunctionContext<QueryUserId>) => {
  const [_, id] = queryKey;

  if (!id) return false;

  return apiInstance.get(`users/profile/${id}`).then((res) => res.data);
};

type QueryGetPost = [string, (string | string[])?, string?, number?];

export const getProfileQuestions = ({
  queryKey,
}: QueryFunctionContext<QueryGetPost>) => {
  const [_, id, orderOpt, page] = queryKey;

  if (!id) return false;

  return apiInstance
    .get(`qnas/questions/@${id}`, {
      params: {
        order_opt: orderOpt,
        page,
      },
    })
    .then((res) => res.data);
};
