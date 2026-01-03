export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type OrderStatus =
  | 'published'
  | 'proposals'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Proposal {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalRating: number;
  professionalAvatar: string;
  price: number;
  message: string;
  createdAt: Date;
  accepted?: boolean;
}

export interface Order {
  id: string;
  categoryId: string;
  categoryName: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  date: Date;
  duration: number;
  observations?: string;
  photos?: string[];
  status: OrderStatus;
  proposals: Proposal[];
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isFromClient: boolean;
}

export interface Conversation {
  id: string;
  orderId: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}
