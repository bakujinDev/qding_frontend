import axios from "axios";

export const baseURL = "https://qding.onrender.com";

export const tokenInstance = axios.create({
  baseURL: `${baseURL}/api/token`,
});

export const apiInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
});
