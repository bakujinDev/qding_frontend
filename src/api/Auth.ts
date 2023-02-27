import { apiInstance, tokenInstance } from "./instance";

export interface ILogin {
  username: string;
}

export interface IJoin extends ILogin {
  termAgree: boolean;
}

export const usernameLogin = ({ username }: ILogin) =>
  tokenInstance.post("/", { username }).then((res) => {
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

interface ILogout {
  refresh: string;
}

export const logout = ({ refresh }: ILogout) =>
  apiInstance
    .post("users/log-out", {
      refresh,
    })
    .then((res) => res.status);

export const usernameJoin = ({ username }: ILogin) =>
  apiInstance.post("users/", { username }).then((res) => {
    const { access, refresh } = res.data;

    localStorage.setItem("refresh_token", refresh);
    apiInstance.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    return res.data;
  });

export const requestAuthEmail = () =>
  apiInstance.post("users/email-auth").then((res) => res.data);

export const getIsEmailAuth = () =>
  apiInstance.get("users/email-auth").then((res) => res.data);

interface ITurnEmailAuth {
  token: string;
}

export const turnEmailAuh = ({ token }: ITurnEmailAuth) =>
  apiInstance.put("users/email-auth", { token }).then((res) => res.data);

export const githubLogin = (code: string) =>
  apiInstance.post(`users/github-login`, { code }).then((res) => {
    const { access, refresh } = res.data;

    localStorage.setItem("refresh_token", refresh);
    apiInstance.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    return res.data;
  });

export const kakaoLogin = (code: string) =>
  apiInstance.post(`users/kakao-login`, { code }).then((res) => {
    const { access, refresh } = res.data;

    localStorage.setItem("refresh_token", refresh);
    apiInstance.defaults.headers.common["Authorization"] = `Bearer ${access}`;

    return res.data;
  });
