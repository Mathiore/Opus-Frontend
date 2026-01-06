import { getApiUrl } from '@/utils/apiConfig';
import { getToken } from './authService';
import type {
  Job,
  JobsListResponse,
  GetJobsParams,
  CreateJobRequest,
} from '@/types/api';

const API_URL = getApiUrl();

/**
 * Lista trabalhos próximos (público - não requer autenticação)
 */
export async function getJobs(params: GetJobsParams): Promise<JobsListResponse> {
  const queryParams = new URLSearchParams({
    lat: params.lat.toString(),
    lng: params.lng.toString(),
    radius_km: params.radius_km.toString(),
  });

  if (params.category_id) {
    queryParams.append('category_id', params.category_id.toString());
  }
  if (params.status) {
    queryParams.append('status', params.status);
  }
  if (params.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params.offset) {
    queryParams.append('offset', params.offset.toString());
  }

  const response = await fetch(`${API_URL}/v1/jobs?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Retorna detalhes completos de um trabalho (público)
 */
export async function getJobById(id: string): Promise<Job> {
  const response = await fetch(`${API_URL}/v1/jobs/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Cria um novo trabalho (requer role consumer)
 */
export async function createJob(data: CreateJobRequest): Promise<Job> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/consumer/jobs`, {
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
 * Cancela um trabalho (requer role consumer e ser o dono)
 */
export async function cancelJob(jobId: string): Promise<Job> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/consumer/jobs/${jobId}/cancel`, {
    method: 'PATCH',
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


