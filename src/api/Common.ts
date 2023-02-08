import { apiInstance } from "./instance";

export const getUploadURL = () =>
  apiInstance.post("medias/photos/get-url").then((res) => res.data);
