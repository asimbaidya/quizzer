import axios, { AxiosRequestConfig } from 'axios';

type ApiRequestOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  // formData?: Record<string, unknown>;
  formData?: any;
  signal?: AbortSignal;
  body?: any;
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

export class CustomError extends Error {
  public details: any;

  constructor(message: string, details: any) {
    super(message);
    // details is the response from backend API(fastapi)
    this.details = details;
    this.name = 'CustomError';
  }
}

export default async function request<T>({
  method,
  url,
  formData,
  signal,
  body,
}: ApiRequestOptions): Promise<T> {
  const options: AxiosRequestConfig = {
    method,
    url,
    data: formData,
    headers: {},
    signal: signal,
  };

  if (formData) {
    options.headers = options.headers || {}; // just to mitigate the linter warning
    options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    options.data = new URLSearchParams(formData as any).toString();
  } else if (body) {
    options.headers = options.headers || {}; // just to mitigate the linter warning
    options.headers['Content-Type'] = 'application/json';
    options.data = body;
  }

  try {
    const response = await apiClient.request<T>(options);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log('-------------------------------> request()');
      console.log('error:', error);
      console.log('error.cause:', error.cause);
      console.log('error.message:', error.message);
      // response means error is  responded from the server
      // can be string or list or errors objects
      console.log('error.response.data.detail:', error.response.data.detail);
      console.log('------------------------------->request()');
      const errorMessage = error.message || "Something isn't working";
      const errorDetails =
        error.response.data?.detail || 'unexpected Server Reponse';
      throw new CustomError(errorMessage, errorDetails);
    }

    throw new CustomError('Check Server is up or not', null);
  }
}
