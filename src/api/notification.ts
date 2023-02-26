import { apiInstance } from "./instance";

export const getNotification = () =>
  apiInstance.get("users/notification").then((res) => res.data);

export interface ISubscribeNotification {
  type: string;
  id: number;
}

export const subscribeNotification = ({ type, id }: ISubscribeNotification) =>
  apiInstance.post("users/notification", { type, id }).then((res) => res.data);
export interface IDeleteNotification {
  pk: number;
}

export const deleteNotification = ({ pk }: IDeleteNotification) =>
  apiInstance.delete(`users/notification/${pk}`).then((res) => res.data);
