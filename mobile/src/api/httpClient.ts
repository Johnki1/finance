import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { secureStorage } from '../services/secureStorage';

const ENV = {
  apiUrl: 'http://localhost:8080/api/v1',
  timeoutMs: 15_000,
};

export const httpClient = axios.create({
  baseURL: ENV.apiUrl,
  timeout: ENV.timeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

export const setupHttpInterceptors = () => {
  httpClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      console.log('[HTTP]', config.method?.toUpperCase(), config.url);
      
      const token = await secureStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  httpClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        console.log('[HTTP] Error', error.response.status, error.response.data);
      } else if (error.request) {
        console.log('[HTTP] No response', error.request);
      } else {
        console.log('[HTTP] Request error', error.message);
      }
      return Promise.reject(error);
    },
  );
};
