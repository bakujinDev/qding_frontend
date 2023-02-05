import { apiInstance, tokenInstance } from "./common";

export const getQnaList = () =>
  apiInstance.get("qnas/questions").then((res) => res.data);

export interface IPostQuestion {
  title: string;
  content: string;
  tag: Array<number>;
}

export const postQuestion = ({}:IPostQuestion) =>
  apiInstance.post("qnas/question").then((res) => res.data);
