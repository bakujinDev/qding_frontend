import { apiInstance, tokenInstance } from "./common";

export const getQnaList = () =>
  apiInstance.get("qnas/questions").then((res) => res.data);
