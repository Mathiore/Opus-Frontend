import { getApiUrl } from '@/utils/apiConfig';
import { getToken } from './authService';
import type {
  Offer,
  OffersListResponse,
  CreateOfferRequest,
} from '@/types/api';

const API_URL = getApiUrl();

/**
 * Cria uma oferta para um trabalho (requer role provider)
 */
export async function createOffer(
  jobId: string,
  data: CreateOfferRequest
): Promise<Offer> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/provider/jobs/${jobId}/offers`, {
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
 * Lista ofertas de um trabalho (requer role consumer e ser o dono)
 */
export async function getJobOffers(jobId: string): Promise<OffersListResponse> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/consumer/jobs/${jobId}/offers`, {
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
 * Aceita uma oferta (requer role consumer e ser o dono do trabalho)
 */
export async function acceptOffer(offerId: string): Promise<Offer> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/consumer/offers/${offerId}/accept`, {
    method: 'POST',
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


