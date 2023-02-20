import { apiInstance } from "./instance";

export const getNotification = () =>
  apiInstance.get("users/notification").then((res) => res.data);

export interface IDeleteNotification {
  pk: number;
}

export const deleteNotification = ({ pk }: IDeleteNotification) =>
  apiInstance.delete(`users/notification/${pk}`).then((res) => res.data);
