import axios, { AxiosRequestConfig } from "axios";
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/MyMusic/api/",
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
