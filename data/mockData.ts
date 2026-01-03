import { Category, Order, Conversation, User } from '@/types';

export const categories: Category[] = [
  { id: '1', name: 'Eletricista', icon: 'zap' },
  { id: '2', name: 'Encanador', icon: 'droplet' },
  { id: '3', name: 'Faxina', icon: 'sparkles' },
  { id: '4', name: 'Pedreiro', icon: 'hammer' },
  { id: '5', name: 'Pintor', icon: 'paint-bucket' },
  { id: '6', name: 'Montagem', icon: 'wrench' },
  { id: '7', name: 'Jardinagem', icon: 'leaf' },
  { id: '8', name: 'Chaveiro', icon: 'key' },
];

export const mockOrders: Order[] = [
  {
    id: '1',
    categoryId: '1',
    categoryName: 'Eletricista',
    description: 'Trocar disjuntor e instalar tomadas',
    address: 'Rua das Flores, 123 - Centro',
    latitude: -23.5505,
    longitude: -46.6333,
    date: new Date(2024, 0, 15, 14, 0),
    duration: 2,
    status: 'proposals',
    proposals: [
      {
        id: 'p1',
        professionalId: 'prof1',
        professionalName: 'João Silva',
        professionalRating: 4.8,
        professionalAvatar: 'https://i.pravatar.cc/150?img=12',
        price: 250,
        message: 'Posso fazer hoje mesmo! Tenho experiência em instalações elétricas.',
        createdAt: new Date(2024, 0, 14, 10, 30),
      },
      {
        id: 'p2',
        professionalId: 'prof2',
        professionalName: 'Carlos Santos',
        professionalRating: 4.9,
        professionalAvatar: 'https://i.pravatar.cc/150?img=13',
        price: 220,
        message: 'Sou eletricista certificado. Posso ir amanhã pela manhã.',
        createdAt: new Date(2024, 0, 14, 11, 15),
      },
    ],
    createdAt: new Date(2024, 0, 14, 9, 0),
  },
  {
    id: '2',
    categoryId: '2',
    categoryName: 'Encanador',
    description: 'Vazamento no banheiro',
    address: 'Av. Paulista, 1000 - Bela Vista',
    latitude: -23.5629,
    longitude: -46.6544,
    date: new Date(2024, 0, 16, 9, 0),
    duration: 3,
    status: 'published',
    proposals: [],
    createdAt: new Date(2024, 0, 14, 15, 30),
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    orderId: '1',
    professionalId: 'prof1',
    professionalName: 'João Silva',
    professionalAvatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'Posso confirmar para amanhã às 14h?',
    lastMessageTime: new Date(2024, 0, 14, 16, 45),
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        senderId: 'prof1',
        senderName: 'João Silva',
        text: 'Olá! Vi seu pedido de eletricista.',
        timestamp: new Date(2024, 0, 14, 16, 30),
        isFromClient: false,
      },
      {
        id: 'm2',
        senderId: 'client1',
        senderName: 'Você',
        text: 'Oi! Pode fazer amanhã?',
        timestamp: new Date(2024, 0, 14, 16, 35),
        isFromClient: true,
      },
      {
        id: 'm3',
        senderId: 'prof1',
        senderName: 'João Silva',
        text: 'Posso confirmar para amanhã às 14h?',
        timestamp: new Date(2024, 0, 14, 16, 45),
        isFromClient: false,
      },
    ],
  },
];

export const mockUser: User = {
  id: 'client1',
  name: 'Maria Oliveira',
  email: 'maria@email.com',
  phone: '(11) 98765-4321',
  avatar: 'https://i.pravatar.cc/150?img=5',
};
