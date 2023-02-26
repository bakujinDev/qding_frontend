import axios from "axios";

export const baseURL = "http://127.0.0.1:8000";

export const tokenInstance = axios.create({
  baseURL: `${baseURL}/api/token`,
});

export const apiInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
});
