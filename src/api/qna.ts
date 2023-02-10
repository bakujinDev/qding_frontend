import { QueryFunctionContext } from "@tanstack/react-query";
import { apiInstance, tokenInstance } from "./instance";

export const getQnaList = () =>
  apiInstance.get("qnas/questions").then((res) => res.data);

type GetQnaPostQueryKey = [string, string?];

export const getQnaPost = ({
  queryKey,
}: QueryFunctionContext<GetQnaPostQueryKey>) => {
  const [_, id] = queryKey;

  return apiInstance.get(`qnas/questions/${id}`).then((res) => res.data);
};

export interface IPostQuestion {
  title: string;
  content: string;
  tag: Array<any>;
}

export const postQuestion = ({ title, content, tag }: IPostQuestion) =>
  apiInstance
    .post("qnas/questions", { title, content, tag })
    .then((res) => res.data);

type GetTagListQueryKey = [string, string?, Date[]?];

export const getTagList = ({
  queryKey,
}: QueryFunctionContext<GetTagListQueryKey>) => {
  const [_, search] = queryKey;
  return apiInstance
    .get("qnas/tags", { params: { search } })
    .then((res) => res.data);
};
