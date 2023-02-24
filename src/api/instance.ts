import useUser from "@/lib/user";
import axios from "axios";
import { useRouter } from "next/router";

export const baseURL = "http://127.0.0.1:8000";

export const tokenInstance = axios.create({
  baseURL: `${baseURL}/api/token`,
});

export const apiInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
});
