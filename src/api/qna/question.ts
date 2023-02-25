import { getLocalStorage, setViewLocal } from "@/lib/localStorage";
import { QueryFunctionContext } from "@tanstack/react-query";
import { apiInstance } from "../instance";

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

  if (id === "undefined") return false;

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

export interface IVoteQuestion {
  questionId: string;
  vote_type: "plus" | "minus";
}

export const voteQuestion = ({ questionId, vote_type }: IVoteQuestion) =>
  apiInstance.post(`qnas/questions/${questionId}/vote`, { vote_type });

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

export interface IEditQuestionComment {
  commentId: string;
  content: string;
}

export const editQuestionComment = ({
  commentId,
  content,
}: IEditQuestionComment) =>
  apiInstance
    .put(`qnas/questions/comments/${commentId}`, { content })
    .then((res) => res.data);

export interface IDeleteQuestionComment {
  commentId: string;
}

export const deleteQuestionComment = ({ commentId }: IDeleteQuestionComment) =>
  apiInstance
    .delete(`qnas/questions/comments/${commentId}`)
    .then((res) => res.data);

export interface IChoiceAnswer {
  questionId: string;
  answerId: string;
}

export const choiceAnswer = ({ questionId, answerId }: IChoiceAnswer) =>
  apiInstance
    .post(`qnas/questions/${questionId}/choice_answer`, { answerId })
    .then((res) => res.data);
