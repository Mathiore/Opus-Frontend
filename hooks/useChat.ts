import { useState, useEffect, useCallback, useRef } from 'react';
import * as chatService from '@/services/chatService';
import type { Message, Conversation } from '@/services/chatService';

interface UseChatOptions {
  conversationId?: string;
  jobId?: string;
  pollingInterval?: number; // em milissegundos, padrão: 5000 (5 segundos)
  autoMarkAsRead?: boolean; // marcar como lida automaticamente ao carregar
}

export function useChat(options: UseChatOptions = {}) {
  const { conversationId, jobId, pollingInterval = 5000, autoMarkAsRead = true } = options;
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Carregar conversa se jobId for fornecido
  useEffect(() => {
    if (jobId && !conversationId) {
      const loadConversation = async () => {
        try {
          setLoading(true);
          const conv = await chatService.getOrCreateJobConversation(jobId);
          setConversation(conv);
        } catch (err: any) {
          setError(err.message || 'Erro ao carregar conversa');
        } finally {
          setLoading(false);
        }
      };
      loadConversation();
    } else if (conversationId) {
      const loadConversation = async () => {
        try {
          setLoading(true);
          const conv = await chatService.getConversationById(conversationId);
          setConversation(conv);
        } catch (err: any) {
          setError(err.message || 'Erro ao carregar conversa');
        } finally {
          setLoading(false);
        }
      };
      loadConversation();
    }
  }, [jobId, conversationId]);

  // Carregar mensagens
  const loadMessages = useCallback(async () => {
    const targetConversationId = conversationId || conversation?.id;
    if (!targetConversationId) return;

    try {
      const response = await chatService.getMessages(targetConversationId, {
        limit: 100,
      });
      setMessages(response.items);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar mensagens');
    }
  }, [conversationId, conversation?.id]);

  // Carregar mensagens inicialmente e configurar polling
  useEffect(() => {
    const targetConversationId = conversationId || conversation?.id;
    if (!targetConversationId) return;

    // Carregar mensagens imediatamente
    loadMessages();

    // Marcar como lida se autoMarkAsRead estiver habilitado
    if (autoMarkAsRead) {
      chatService.markConversationAsRead(targetConversationId).catch((err) => {
        console.warn('Erro ao marcar conversa como lida:', err);
      });
    }

    // Configurar polling
    if (pollingInterval > 0) {
      pollingRef.current = setInterval(() => {
        loadMessages();
      }, pollingInterval);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [conversationId, conversation?.id, loadMessages, pollingInterval, autoMarkAsRead]);

  // Enviar mensagem
  const sendMessage = useCallback(
    async (content: string, attachmentUrl?: string, attachmentType?: string) => {
      const targetConversationId = conversationId || conversation?.id;
      if (!targetConversationId) {
        throw new Error('Conversa não disponível');
      }

      setSending(true);
      setError(null);

      try {
        const message = await chatService.sendMessage(targetConversationId, {
          content,
          attachment_url: attachmentUrl,
          attachment_type: attachmentType,
        });
        setMessages((prev) => [...prev, message]);
        return message;
      } catch (err: any) {
        setError(err.message || 'Erro ao enviar mensagem');
        throw err;
      } finally {
        setSending(false);
      }
    },
    [conversationId, conversation?.id]
  );

  // Marcar como lida
  const markAsRead = useCallback(async () => {
    const targetConversationId = conversationId || conversation?.id;
    if (!targetConversationId) return;

    try {
      await chatService.markConversationAsRead(targetConversationId);
      // Atualizar conversa para refletir que foi marcada como lida
      if (conversation) {
        setConversation({ ...conversation, unread_count: 0 });
      }
    } catch (err: any) {
      console.warn('Erro ao marcar como lida:', err);
    }
  }, [conversationId, conversation]);

  return {
    messages,
    conversation,
    loading,
    error,
    sending,
    sendMessage,
    loadMessages,
    markAsRead,
  };
}

/**
 * Hook para listar todas as conversas do usuário
 */
export function useConversations(params?: { limit?: number; offset?: number }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await chatService.getConversations(params);
      setConversations(response.items);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  }, [params?.limit, params?.offset]);

  useEffect(() => {
    loadConversations();
    // Polling a cada 30 segundos para atualizar lista de conversas
    const interval = setInterval(loadConversations, 30000);
    return () => clearInterval(interval);
  }, [loadConversations]);

  return {
    conversations,
    loading,
    error,
    total,
    refresh: loadConversations,
  };
}


