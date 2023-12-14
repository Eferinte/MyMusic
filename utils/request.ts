import axios, { AxiosRequestConfig } from "axios";
import { API_URL } from "../constant";
export const axiosInstance = axios.create({
  baseURL: API_URL + "api/",
  timeout: 1000,
});
export const request = (
  path: string,
  method: "GET" | "POST",
  data?: any,
  config?: AxiosRequestConfig<any>
) => {
  if (method === "GET")
    return axiosInstance.get(path, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  else if (method === "POST") return axiosInstance.post(path, data, config);
  else throw Error("Method not allowed");
};
