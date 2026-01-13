import { useState, useCallback } from 'react';
import * as jobsService from '@/services/jobsService';
import type { Job, GetJobsParams, CreateJobRequest } from '@/types/api';

export function useJobs() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getJobs = useCallback(async (params: GetJobsParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jobsService.getJobs(params);
      return response;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar trabalhos');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getJobById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const job = await jobsService.getJobById(id);
      return job;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar trabalho');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createJob = useCallback(async (data: CreateJobRequest) => {
    setLoading(true);
    setError(null);
    try {
      const job = await jobsService.createJob(data);
      return job;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar trabalho');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelJob = useCallback(async (jobId: string) => {
    setLoading(true);
    setError(null);
    try {
      const job = await jobsService.cancelJob(jobId);
      return job;
    } catch (err: any) {
      setError(err.message || 'Erro ao cancelar trabalho');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getJobs,
    getJobById,
    createJob,
    cancelJob,
    loading,
    error,
  };
}




