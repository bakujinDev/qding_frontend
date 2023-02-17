import { getLocalStorage, setViewLocal } from "@/lib/localStorage";
import { QueryFunctionContext } from "@tanstack/react-query";
import { apiInstance } from "./instance";

type GetQnaListQueryKey = [string, string?];

export const getQnaList = ({
  queryKey,
}: QueryFunctionContext<GetQnaListQueryKey>) => {
  const [category, page] = queryKey;

  return apiInstance
    .get("qnas/questions", { params: { page } })
    .then((res) => res.data);
};

type GetQnaPostQueryKey = [string, string?];

export const getQnaPost = ({
  queryKey,
}: QueryFunctionContext<GetQnaPostQueryKey>) => {
  const [category, id] = queryKey;

  if (!id) return;

  let viewLocalItem = getLocalStorage(`${category}_${id}`);
  setViewLocal({ name: `${category}_${id}`, value: 1 });

  return apiInstance
    .get(`qnas/questions/${id}`, { params: { viewLocalItem } })
    .then((res) => res.data);
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

export interface IPostQuestionComment {
  questionId: string;
  content: string;
}

export const postQuestionComment = ({
  questionId,
  content,
}: IPostQuestionComment) =>
  apiInstance
    .post(`qnas/questions/${questionId}/comments`, { content })
    .then((res) => res.data);

export interface IPostAnswerComment {
  answerId: string;
  content: string;
}

export const postAnswerComment = ({ answerId, content }: IPostAnswerComment) =>
  apiInstance
    .post(`qnas/answers/${answerId}/comments`, { content })
    .then((res) => res.data);

export interface IEditAnswerComment {
  commentId: string;
  content: string;
}

export const editAnswerComment = ({ commentId, content }: IEditAnswerComment) =>
  apiInstance
    .put(`qnas/answers/comments/${commentId}`, { content })
    .then((res) => res.data);

export interface IEditQuestionComment {
  commentId: string;
  content: string;
}

export const editQuestionComment = ({
  commentId,
  content,
}: IEditAnswerComment) =>
  apiInstance
    .put(`qnas/questions/comments/${commentId}`, { content })
    .then((res) => res.data);

export interface IDeleteAnswerComment {
  commentId: string;
}

export const deleteAnswerComment = ({ commentId }: IDeleteAnswerComment) =>
  apiInstance
    .delete(`qnas/answers/comments/${commentId}`)
    .then((res) => res.data);

export interface IDeleteQuestionComment {
  commentId: string;
}

export const deleteQuestionComment = ({ commentId }: IDeleteQuestionComment) =>
  apiInstance
    .delete(`qnas/questions/comments/${commentId}`)
    .then((res) => res.data);

export interface IPostAnsewr {
  questionId: string;
  content: string;
}

export const postAnswer = ({ questionId, content }: IPostAnsewr) =>
  apiInstance
    .post(`qnas/questions/${questionId}/answers`, { content })
    .then((res) => res.data);
