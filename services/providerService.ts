import { getApiUrl } from '@/utils/apiConfig';
import { getToken } from './authService';
import type {
  ProviderProfile,
  ProviderOnboardingRequest,
  ProvidersListResponse,
  ApproveProviderRequest,
  RejectProviderRequest,
} from '@/types/api';

const API_URL = getApiUrl();

/**
 * Envia documentos para se tornar prestador (qualquer usuário autenticado)
 */
export async function submitProviderOnboarding(
  data: ProviderOnboardingRequest
): Promise<ProviderProfile> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/provider/onboarding`, {
    method: 'POST',
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

/**
 * Retorna o perfil de prestador do usuário autenticado
 */
export async function getProviderProfile(): Promise<ProviderProfile> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/provider/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Lista prestadores pendentes de aprovação (requer role admin)
 */
export async function getPendingProviders(params?: {
  limit?: number;
  offset?: number;
}): Promise<ProvidersListResponse> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const queryParams = new URLSearchParams();
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.offset) {
    queryParams.append('offset', params.offset.toString());
  }

  const url = `${API_URL}/v1/admin/providers/pending${queryParams.toString() ? `?${queryParams}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Aprova um prestador (requer role admin)
 */
export async function approveProvider(
  userId: string,
  data?: ApproveProviderRequest
): Promise<ProviderProfile> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/admin/providers/${userId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data || {}),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Rejeita um prestador (requer role admin)
 */
export async function rejectProvider(
  userId: string,
  data?: RejectProviderRequest
): Promise<ProviderProfile> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/admin/providers/${userId}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data || {}),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

