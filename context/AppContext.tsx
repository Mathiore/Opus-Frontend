import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  Order,
  Conversation,
  User,
  Category,
  Proposal,
  Message,
  OrderStatus,
} from '@/types';
import {
  categories as initialCategories,
  mockOrders,
  mockConversations,
} from '@/data/mockData';
import { getApiUrl } from '@/utils/apiConfig';
import { getToken, isAuthenticated as checkAuth, logout as authLogout } from '@/services/authService';

interface AppContextType {
  user: User | null;
  categories: Category[];
  orders: Order[];
  conversations: Conversation[];
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'proposals'>) => Order;
  acceptProposal: (orderId: string, proposalId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  sendMessage: (conversationId: string, text: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getConversationById: (id: string) => Conversation | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);

  const isAuthenticated = user !== null;

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();

      if (!token) {
        console.warn('Token não disponível para buscar dados do usuário');
        setUser(null);
        setIsLoading(false);
        return;
      }

      const API_URL = getApiUrl();
      
      // Criar um AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos

      let response;
      try {
        response = await fetch(`${API_URL}/v1/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Network request timed out');
        }
        throw fetchError;
      }

      if (response.ok) {
        const data = await response.json();
        // Pode retornar { user: {...}, roles: [...] } ou apenas {...}
        const userData = data.user || data;
        
        // Normalizar dados do usuário
        const normalizedUser: User = {
          ...userData,
          avatar: userData.photo_url || userData.avatar,
        };
        setUser(normalizedUser);
        console.log('Usuário carregado com sucesso:', normalizedUser);
      } else if (response.status === 401) {
        // Token inválido ou expirado
        console.warn('Token inválido ou expirado');
        await authLogout();
        setUser(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorText = errorData.error || `HTTP ${response.status}`;
        console.error(
          `Erro ao buscar usuário: ${response.status} - ${errorText}`
        );
        setUser(null);
      }
    } catch (error: any) {
      // Tratamento mais detalhado de erros de rede
      if (error.message === 'Network request failed') {
        console.error(
          'Erro de conexão: Não foi possível conectar ao backend.\n' +
            'Verifique se:\n' +
            '1. O backend está rodando em ' +
            getApiUrl() +
            '\n' +
            '2. Se estiver usando dispositivo físico ou emulador, use o IP da sua máquina em vez de localhost\n' +
            '3. Configure EXPO_PUBLIC_API_URL no arquivo .env com o IP correto (ex: http://192.168.1.100:3030)'
        );
      } else {
        console.error('Erro ao buscar usuário:', error.message || error);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar autenticação ao carregar o app
  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await checkAuth();
      if (authenticated) {
        await refreshUser();
      } else {
        setUser(null);
        setIsLoading(false);
      }
      setAuthChecked(true);
    };

    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  const createOrder = (
    orderData: Omit<Order, 'id' | 'createdAt' | 'proposals'>
  ): Order => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date(),
      proposals: [],
      status: 'published',
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const acceptProposal = (orderId: string, proposalId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'confirmed' as OrderStatus,
            proposals: order.proposals.map((p) =>
              p.id === proposalId ? { ...p, accepted: true } : p
            ),
          };
        }
        return order;
      })
    );
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const sendMessage = (conversationId: string, text: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const newMessage: Message = {
            id: Date.now().toString(),
            senderId: user?.id || 'client1',
            senderName: 'Você',
            text,
            timestamp: new Date(),
            isFromClient: true,
          };
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: text,
            lastMessageTime: new Date(),
          };
        }
        return conv;
      })
    );
  };

  const getOrderById = (id: string) => orders.find((o) => o.id === id);
  const getConversationById = (id: string) =>
    conversations.find((c) => c.id === id);

  return (
    <AppContext.Provider
      value={{
        user,
        categories: initialCategories,
        orders,
        conversations,
        isAuthenticated,
        isLoading,
        refreshUser,
        logout,
        createOrder,
        acceptProposal,
        updateOrderStatus,
        sendMessage,
        getOrderById,
        getConversationById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
