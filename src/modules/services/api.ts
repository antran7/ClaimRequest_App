import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: '',
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
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const apiService = {
  get: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.get<T>(url, config);
  },
  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.post<T>(url, data, config);
  },
  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.put<T>(url, data, config);
  },
  delete: <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    return api.delete<T>(url, config);
  },
  getRequests: async (userId: number) => {
    const response = await api.get(`/requests`, {
      params: { userId }
    });
    return response.data;
  },
  addRequest: async (request: { name: string; userId: number }) => {
    const response = await api.post(`/requests`, request);
    return response.data;
  },
};

export default apiService;

