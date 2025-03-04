import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ResponseModel } from "../../../shared/models/responseModel";

const api = axios.create({
  baseURL: "https://management-claim-request.vercel.app/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse<ResponseModel<any>>) => {
    return response.data;
  },
  (error) => {
    let errorMessage = "Unknown error!";
    if (error.response) {
      const data = error.response.data;
      if (data) {
        errorMessage = data.message;
      }
    }
    return Promise.reject(new Error(errorMessage));
  }
);

const apiService = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<ResponseModel<T>> =>
    api.get<ResponseModel<T>>(url, config),

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseModel<T>> =>
    api.post<ResponseModel<T>>(url, data, config),

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ResponseModel<T>> =>
    api.put<ResponseModel<T>>(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<ResponseModel<T>> =>
    api.delete<ResponseModel<T>>(url, config),
};

export default apiService;