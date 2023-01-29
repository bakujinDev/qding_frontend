import axios from "axios";
import { baseURL, instance } from "./Common";

export interface ILoginVar {
  username: string;
  password: string;
}

export const usernameLogin = ({ username, password }: ILoginVar) =>
  axios
    .post(`${baseURL}/api/token/`, { username, password })
    .then((res) => res.data);
