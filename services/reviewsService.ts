import { getApiUrl } from '@/utils/apiConfig';
import { getToken } from './authService';
import type {
  Review,
  CreateReviewRequest,
  ReviewsListResponse,
  ReviewSummary,
} from '@/types/api';

const API_URL = getApiUrl();

/**
 * Cria uma avaliação (usuário autenticado)
 */
export async function createReview(data: CreateReviewRequest): Promise<Review> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/reviews`, {
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
 * Lista avaliações de um usuário (autenticado)
 */
export async function getUserReviews(
  userId: string,
  params?: {
    direction?: 'consumer_to_provider' | 'provider_to_consumer';
    limit?: number;
    offset?: number;
  }
): Promise<ReviewsListResponse> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const queryParams = new URLSearchParams();
  if (params?.direction) {
    queryParams.append('direction', params.direction);
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.offset) {
    queryParams.append('offset', params.offset.toString());
  }

  const url = `${API_URL}/v1/reviews/user/${userId}${queryParams.toString() ? `?${queryParams}` : ''}`;

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
 * Retorna resumo de avaliações de um usuário (autenticado)
 */
export async function getUserReviewSummary(
  userId: string,
  direction?: 'consumer_to_provider' | 'provider_to_consumer'
): Promise<ReviewSummary> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const queryParams = new URLSearchParams();
  if (direction) {
    queryParams.append('direction', direction);
  }

  const url = `${API_URL}/v1/reviews/user/${userId}/summary${queryParams.toString() ? `?${queryParams}` : ''}`;

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

