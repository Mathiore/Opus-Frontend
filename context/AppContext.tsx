import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  mockUser,
} from '@/data/mockData';

interface AppContextType {
  user: User | null;
  categories: Category[];
  orders: Order[];
  conversations: Conversation[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);

  const login = (email: string, password: string) => {
    setIsAuthenticated(true);
    setUser(mockUser);
  };

  const logout = () => {
    setIsAuthenticated(false);
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
        login,
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
