import axios, { AxiosRequestConfig } from 'axios';

type ApiRequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  formData?: Record<string, unknown>;
  signal?: AbortSignal;
};

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export class ApiError extends Error {
  public details: any;

  constructor(message: string, details: any) {
    super(message);
    this.details = details;
    this.name = 'ApiError';
  }
}

export default async function request<T>({
  method,
  url,
  formData,
  signal,
}: ApiRequestOptions): Promise<T> {
  const options: AxiosRequestConfig = {
    method,
    url,
    data: formData,
    headers: {},
    signal: signal,
  };

  if (formData) {
    options.headers = options.headers || {};
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.data = new URLSearchParams(formData as any).toString();
  }

  try {
    const response = await apiClient.request<T>(options);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = `Error ${error.response.status}: ${error.response.data.message}`;
      const errorDetails = error.response.data?.detail || null;
      throw new ApiError(errorMessage, errorDetails);
    }
    throw new ApiError('An unexpected error occurred', null);
  }
}
