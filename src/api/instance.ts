import axios from "axios";

export const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000"
    : "https://qding.onrender.com";

export const tokenInstance = axios.create({
  baseURL: `${baseURL}/api/token`,
});

export const apiInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
});
