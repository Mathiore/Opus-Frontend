import { useAuth } from '@clerk/clerk-expo';
import { useCallback } from 'react';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3030';

export function useApi() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      if (!isLoaded) {
        throw new Error('Auth not loaded');
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Adiciona token apenas se o usuário estiver autenticado
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
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
    [getToken, isLoaded, isSignedIn]
  );

  return { apiCall };
}

