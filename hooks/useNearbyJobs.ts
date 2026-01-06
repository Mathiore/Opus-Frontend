import { useState, useEffect, useCallback } from 'react';
import * as jobsService from '@/services/jobsService';
import type { Job, GetJobsParams } from '@/types/api';

interface UseNearbyJobsParams {
  lat: number;
  lng: number;
  radiusKm: number;
  categoryId?: number;
  status?: string;
  limit?: number;
  offset?: number;
  autoFetch?: boolean; // se true, busca automaticamente quando params mudarem
}

export function useNearbyJobs(params: UseNearbyJobsParams) {
  const { autoFetch = true, ...queryParams } = params;
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await jobsService.getJobs({
        lat: queryParams.lat,
        lng: queryParams.lng,
        radius_km: queryParams.radiusKm,
        category_id: queryParams.categoryId,
        status: queryParams.status as any,
        limit: queryParams.limit,
        offset: queryParams.offset,
      });

      setJobs(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar trabalhos');
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [
    queryParams.lat,
    queryParams.lng,
    queryParams.radiusKm,
    queryParams.categoryId,
    queryParams.status,
    queryParams.limit,
    queryParams.offset,
  ]);

  useEffect(() => {
    if (autoFetch) {
      fetchJobs();
    }
  }, [autoFetch, fetchJobs]);

  return {
    jobs,
    loading,
    error,
    total,
    refresh: fetchJobs,
  };
}


