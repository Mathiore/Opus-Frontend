import { getApiUrl } from '@/utils/apiConfig';
import { getToken } from './authService';
import type { CheckoutRequest, CheckoutResponse } from '@/types/api';

const API_URL = getApiUrl();

/**
 * Cria uma sessão de checkout para pagamento (requer role consumer)
 */
export async function createCheckout(
  data: CheckoutRequest
): Promise<CheckoutResponse> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/consumer/payments/checkout`, {
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




