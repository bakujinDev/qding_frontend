import { apiInstance } from "./instance";

export const getNotification = () =>
  apiInstance.get("users/notification").then((res) => res.data);
