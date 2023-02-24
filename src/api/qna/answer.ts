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
