import { getApiUrl } from '@/utils/apiConfig';
import { getToken } from './authService';
import type {
  Wallet,
  WalletTransaction,
  WalletTransactionsResponse,
  CreatePayoutRequest,
  PayoutResponse,
} from '@/types/api';

const API_URL = getApiUrl();

/**
 * Retorna saldo da carteira do usuário autenticado
 */
export async function getWallet(): Promise<Wallet> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/wallet/me`, {
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
 * Lista transações da carteira do usuário autenticado
 */
export async function getWalletTransactions(params?: {
  limit?: number;
  offset?: number;
}): Promise<WalletTransactionsResponse> {
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

  const url = `${API_URL}/v1/wallet/tx${queryParams.toString() ? `?${queryParams}` : ''}`;

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
 * Solicita saque da carteira (requer saldo disponível)
 */
export async function createPayout(
  data: CreatePayoutRequest
): Promise<PayoutResponse> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/wallet/payouts`, {
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

