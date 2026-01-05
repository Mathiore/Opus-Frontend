import { getApiUrl } from '@/utils/apiConfig';
import { getToken } from './authService';

const API_URL = getApiUrl();

// ==================== Types ====================

export interface Conversation {
  id: string;
  job_id: string;
  consumer_user_id: string;
  provider_user_id: string;
  last_message_at?: string;
  last_message_by_user_id?: string;
  consumer_last_read_at?: string;
  provider_last_read_at?: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_user_id: string;
  content: string;
  attachment_url?: string;
  attachment_type?: string;
  read_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationsListResponse {
  items: Conversation[];
  total: number;
  limit: number;
  offset: number;
}

export interface MessagesListResponse {
  items: Message[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateMessageRequest {
  content: string;
  attachment_url?: string;
  attachment_type?: string;
}

// ==================== Services ====================

/**
 * Lista todas as conversas do usuário autenticado
 */
export async function getConversations(params?: {
  limit?: number;
  offset?: number;
}): Promise<ConversationsListResponse> {
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

  const url = `${API_URL}/v1/chat/conversations${queryParams.toString() ? `?${queryParams}` : ''}`;

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
 * Obtém ou cria conversa para um job
 */
export async function getOrCreateJobConversation(jobId: string): Promise<Conversation> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/chat/jobs/${jobId}/conversation`, {
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
 * Obtém conversa por ID
 */
export async function getConversationById(conversationId: string): Promise<Conversation> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(`${API_URL}/v1/chat/conversations/${conversationId}`, {
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
 * Lista mensagens de uma conversa
 */
export async function getMessages(
  conversationId: string,
  params?: {
    limit?: number;
    offset?: number;
  }
): Promise<MessagesListResponse> {
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

  const url = `${API_URL}/v1/chat/conversations/${conversationId}/messages${queryParams.toString() ? `?${queryParams}` : ''}`;

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
 * Envia uma mensagem em uma conversa
 */
export async function sendMessage(
  conversationId: string,
  data: CreateMessageRequest
): Promise<Message> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(
    `${API_URL}/v1/chat/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Marca mensagens de uma conversa como lidas
 */
export async function markConversationAsRead(conversationId: string): Promise<void> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token não disponível');
  }

  const response = await fetch(
    `${API_URL}/v1/chat/conversations/${conversationId}/read`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
}

