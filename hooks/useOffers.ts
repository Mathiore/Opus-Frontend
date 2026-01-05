import { useState, useCallback } from 'react';
import * as offersService from '@/services/offersService';
import type { CreateOfferRequest } from '@/types/api';

export function useOffers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOffer = useCallback(async (jobId: string, data: CreateOfferRequest) => {
    setLoading(true);
    setError(null);
    try {
      const offer = await offersService.createOffer(jobId, data);
      return offer;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar oferta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getJobOffers = useCallback(async (jobId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await offersService.getJobOffers(jobId);
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar ofertas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptOffer = useCallback(async (offerId: string) => {
    setLoading(true);
    setError(null);
    try {
      const offer = await offersService.acceptOffer(offerId);
      return offer;
    } catch (err: any) {
      setError(err.message || 'Erro ao aceitar oferta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createOffer,
    getJobOffers,
    acceptOffer,
    loading,
    error,
  };
}

