import axios from "axios";
import { apiInstance } from "./instance";

export const getUploadURL = (str: any) =>
  apiInstance.post("medias/photos/get-url").then((res) => res.data);

export interface IUploadImageVariables {
  file: File;
  uploadURL: string;
}

export const uploadImage = ({ file, uploadURL }: IUploadImageVariables) => {
  const form = new FormData();
  form.append("file", file);

  return axios
    .post(uploadURL, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};
