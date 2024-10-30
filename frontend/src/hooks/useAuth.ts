import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import request, { ApiError } from '../core/request';
import { useState } from 'react';
import { fetchUserData } from '../core/services';

interface Token {
  access_token: string;
  token_type: string;
}

export const isLoggedIn = () => {
  return localStorage.getItem('access_token') !== null;
};

export default function useAuth() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const queryClient = new QueryClient();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['user'],
    queryFn: ({ signal }) => fetchUserData(signal),
    enabled: localStorage.getItem('access_token') !== null,
  });

  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (credentials: { username: string; password: string }) => {
      const data = await request<Token>({
        method: 'POST',
        url: '/API/login/access-token',
        formData: {
          grant_type: 'password',
          username: credentials.username,
          password: credentials.password,
        },
      });
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access_token);
      setLoginError(null);
      navigate({ to: '/' });
    },

    onError: (error: ApiError) => {
      console.error('API Error:', error.message, error.details);
      setLoginError(error.details);
    },
  });

  const login = (username: string, password: string) => {
    mutation.mutate({ username, password });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    queryClient.refetchQueries({ queryKey: ['user'] });
    window.location.reload();
    navigate({ to: '/' });
  };

  return {
    user,
    loginError,
    setLoginError,
    login,
    logout,
    error,
    isLoading,
  } as const;
}
