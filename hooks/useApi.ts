import { useCallback } from 'react';
import { getApiUrl } from '@/utils/apiConfig';
import { getToken } from '@/services/authService';

const API_URL = getApiUrl();

export function useApi() {
  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Adiciona token se disponível
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/v1${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: 'Unknown error',
        }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return response.json();
    },
    []
  );

  return { apiCall };
}
