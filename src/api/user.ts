import { QueryFunctionContext } from "@tanstack/react-query";
import { apiInstance } from "./instance";

type QueryUserId = [string, (string | string[])?];

export const getUserProfile = ({
  queryKey,
}: QueryFunctionContext<QueryUserId>) => {
  const [_, id] = queryKey;

  if (!id) return false;

  return apiInstance.get(`users/profile/@${id}`).then((res) => res.data);
};

export interface IEditProfileForm {
  avatar: File;
  name: string;
  introduce: string;
  blog: string;
  github: string;
}

export interface IEditProfile {
  avatar: string;
  name: string;
  introduce: string;
  blog: string;
  github: string;
}

export const editProfile = ({
  avatar,
  name,
  introduce,
  blog,
  github,
}: IEditProfile) =>
  apiInstance
    .put("users/me", {
      avatar: avatar || undefined,
      name: name || undefined,
      introduce: introduce || undefined,
      blog: blog || undefined,
      github: github || undefined,
    })
    .then((res) => res.data);

export const getUserTagLank = ({
  queryKey,
}: QueryFunctionContext<QueryUserId>) => {
  const [_, id] = queryKey;

  if (!id) return false;

  return apiInstance.get(`qnas/tags/@${id}`).then((res) => res.data);
};

type QueryGetPost = [string, (string | string[])?, string?, number?];

export const getProfileQuestions = ({
  queryKey,
}: QueryFunctionContext<QueryGetPost>) => {
  const [_, id, orderOpt, page] = queryKey;

  if (!id) return false;

  return apiInstance
    .get(`qnas/questions/@${id}`, {
      params: {
        order_opt: orderOpt,
        page,
      },
    })
    .then((res) => res.data);
};

export const getProfileAnswers = ({
  queryKey,
}: QueryFunctionContext<QueryGetPost>) => {
  const [_, id, orderOpt, page] = queryKey;

  if (!id) return false;

  return apiInstance
    .get(`qnas/answers/@${id}`, {
      params: {
        order_opt: orderOpt,
        page,
      },
    })
    .then((res) => res.data);
};
