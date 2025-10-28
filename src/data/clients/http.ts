import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { env, isDev } from '../config';

// Token provider interface for auth integration
export interface TokenProvider {
  getToken: () => Promise<string | null>;
}

let tokenProvider: TokenProvider | null = null;

export const setTokenProvider = (provider: TokenProvider) => {
  tokenProvider = provider;
};

// Request interceptor to add auth token
const authInterceptor = async (config: InternalAxiosRequestConfig) => {
  if (tokenProvider) {
    const token = await tokenProvider.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
};

// Response interceptor for error handling and retry logic
const errorInterceptor = async (error: AxiosError) => {
  if (isDev) {
    console.error('HTTP Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
  }

  // Retry logic for 5xx errors (exponential backoff)
  const config = error.config as InternalAxiosRequestConfig & { _retry?: number };
  if (error.response?.status && error.response.status >= 500 && config) {
    const retryCount = config._retry || 0;
    if (retryCount < 3) {
      config._retry = retryCount + 1;
      const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, delay));
      return axios(config);
    }
  }

  return Promise.reject(error);
};

// Create axios instances for each service
export const createHttpClient = (baseURL: string): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(authInterceptor);
  client.interceptors.response.use(undefined, errorInterceptor);

  return client;
};

// Service-specific clients
export const agentClient = createHttpClient(env.agentBase);
export const twinClient = createHttpClient(env.twinBase);
export const mediaClient = createHttpClient(env.mediaBase);
