import { getApiUrl } from '@/utils/apiConfig';
import { getToken } from './authService';
import type { User, UpdateUserRequest } from '@/types/api';

const API_URL = getApiUrl();

/**
 * Atualiza informações do usuário autenticado
 */
export async function updateUser(data: UpdateUserRequest): Promise<User> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

