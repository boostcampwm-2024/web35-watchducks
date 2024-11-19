import axios from 'axios';
import { AxiosResponse } from 'axios';

const $axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

const api = {
  get: async <T>(url: string): Promise<AxiosResponse<T>> => {
    return $axios.get<T, AxiosResponse<T>>(url);
  },

  post: async <T, P>(url: string, data: P): Promise<AxiosResponse<T>> => {
    return $axios.post<T>(url, data);
  },

  patch: async <T, P>(url: string, data: P): Promise<AxiosResponse<T>> => {
    return $axios.patch<T>(url, data);
  }
};

export { api };
