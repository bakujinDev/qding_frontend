import { QueryFunctionContext } from "@tanstack/react-query";
import { apiInstance } from "../instance";

export interface IPostAnsewr {
  questionId: string;
  content: string;
}

export const postAnswer = ({ questionId, content }: IPostAnsewr) =>
  apiInstance
    .post(`qnas/questions/${questionId}/answers`, { content })
    .then((res) => res.data);

export interface IVoteAnswer {
  answerId: string;
  vote_type: "plus" | "minus";
}

export const voteAnswer = ({ answerId, vote_type }: IVoteAnswer) =>
  apiInstance.post(`qnas/answers/${answerId}/vote`, { vote_type });

type GetAnswerQueryKey = [string, string?];

export const getAnswer = ({
  queryKey,
}: QueryFunctionContext<GetAnswerQueryKey>) => {
  const [category, id] = queryKey;

  if (id === "undefined") return false;

  return apiInstance.get(`qnas/answers/${id}`).then((res) => res.data);
};

export interface IAnswerForm {
  content: string;
}

export interface IEditAnswer extends IAnswerForm {
  answerId: string | string[];
}

export const editAnswer = ({ answerId, content }: IEditAnswer) =>
  apiInstance
    .put(`qnas/answers/${answerId}`, { content })
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
export interface IDeleteAnswerComment {
  commentId: string;
}

export const deleteAnswerComment = ({ commentId }: IDeleteAnswerComment) =>
  apiInstance
    .delete(`qnas/answers/comments/${commentId}`)
    .then((res) => res.data);
