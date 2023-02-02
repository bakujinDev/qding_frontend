import { apiInstance, tokenInstance } from "./common";

export interface ILoginVar {
  username: string;
  password: string;
}

export const usernameLogin = ({ username, password }: ILoginVar) =>
  tokenInstance.post("/", { username, password }).then((res) => {
    const { access, refresh } = res.data;

    localStorage.setItem("refresh_token", refresh);
    apiInstance.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    return res.data;
  });

export const getMe = () => apiInstance.get("users/me").then((res) => res.data);

export const refreshToken = () =>
  tokenInstance
    .post("refresh/", {
      refresh: localStorage.getItem("refresh_token") || "",
    })
    .then((res) => {
      const { access } = res.data;

      apiInstance.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      return access;
    });

interface ILogoutVar {
  refresh: string;
}

export const logout = ({ refresh }: ILogoutVar) =>
  apiInstance
    .post("users/log-out", {
      refresh,
    })
    .then((res) => res.status);

export const usernameJoin = ({ username, password }: ILoginVar) =>
  apiInstance.post("users/", { username, password }).then((res) => {
    const { access, refresh } = res.data;

    localStorage.setItem("refresh_token", refresh);
    apiInstance.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    return res.data;
  });

export const requestAuthEmail = () =>
  apiInstance.post("users/email-auth").then((res) => res.data);

export const getIsEmailAuth = () =>
  apiInstance.get("users/email-auth").then((res) => res.data);
