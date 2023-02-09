import { QueryFunctionContext } from "@tanstack/react-query";
import { apiInstance, tokenInstance } from "./instance";

export const getQnaList = () =>
  apiInstance.get("qnas/questions").then((res) => res.data);

export interface IPostQuestion {
  title: string;
  content: string;
  tag: Array<any>;
}

export const postQuestion = ({}: IPostQuestion) =>
  apiInstance.post("qnas/question").then((res) => res.data);

type GetTagListQueryKey = [string, string?, Date[]?];

export const getTagList = ({
  queryKey,
}: QueryFunctionContext<GetTagListQueryKey>) => {
  const [_, search] = queryKey;
  return apiInstance
    .get("qnas/tags", { params: { search } })
    .then((res) => res.data);
};
