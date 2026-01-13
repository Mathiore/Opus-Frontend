import { useState, useCallback } from 'react';
import * as walletService from '@/services/walletService';
import type { CreatePayoutRequest } from '@/types/api';

export function useWallet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const wallet = await walletService.getWallet();
      return wallet;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar carteira');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactions = useCallback(async (params?: { limit?: number; offset?: number }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await walletService.getWalletTransactions(params);
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar transações');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPayout = useCallback(async (data: CreatePayoutRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await walletService.createPayout(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar saque');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getWallet,
    getTransactions,
    createPayout,
    loading,
    error,
  };
}




