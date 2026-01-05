import { useCallback, useState } from 'react';
import { getApiUrl } from '@/utils/apiConfig';
import { getToken } from '@/services/authService';

const API_URL = getApiUrl();

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      setLoading(true);
      setError(null);

      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          ...options.headers,
        };

        // Adiciona token se disponível
        const token = await getToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos

        try {
          const response = await fetch(`${API_URL}/v1${endpoint}`, {
            ...options,
            headers,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({
              error: `HTTP ${response.status}`,
            }));
            const errorMessage = errorData.error || `HTTP ${response.status}`;
            setError(errorMessage);
            throw new Error(errorMessage);
          }

          return await response.json();
        } catch (fetchError: any) {
          clearTimeout(timeoutId);
          if (fetchError.name === 'AbortError') {
            const errorMessage = 'Network request timed out';
            setError(errorMessage);
            throw new Error(errorMessage);
          }
          throw fetchError;
        }
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { apiCall, loading, error };
}
