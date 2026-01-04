import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useAuth } from '@clerk/clerk-expo';
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
import { useApi } from '@/hooks/useApi';

interface AppContextType {
  user: User | null;
  categories: Category[];
  orders: Order[];
  conversations: Conversation[];
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'proposals'>) => Order;
  acceptProposal: (orderId: string, proposalId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  sendMessage: (conversationId: string, text: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getConversationById: (id: string) => Conversation | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded: authLoaded, getToken } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);

  const isAuthenticated = isSignedIn || false;

  const refreshUser = async () => {
    if (!isSignedIn || !authLoaded) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3030';
      const token = await getToken();

      const response = await fetch(`${API_URL}/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // Normalizar dados do usuário
        const normalizedUser: User = {
          ...userData,
          avatar: userData.photo_url || userData.avatar,
        };
        setUser(normalizedUser);
      } else {
        console.error('Erro ao buscar dados do usuário:', response.status);
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoaded) {
      if (isSignedIn) {
        refreshUser();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }
  }, [isSignedIn, authLoaded]);

  const logout = () => {
    setUser(null);
    // O Clerk gerencia o logout
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
