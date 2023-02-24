import axios from "axios";
import { apiInstance } from "./instance";

export interface IGetUploadURL {
  file: File;
  editorSrc?: string;
}

export interface IUploadURLResponse {
  uploadURL: string;
}

export const getUploadURL = (data: IGetUploadURL) =>
  apiInstance.post("medias/photos/get-url").then((res) => res.data);

export interface IUploadImageVariables {
  file: File;
  uploadURL: string;
  editorSrc?: string;
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
