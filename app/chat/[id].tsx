import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useChat } from '@/hooks/useChat';
import { useApp } from '@/context/AppContext';

const quickMessages = [
  'Olá!',
  'Qual o valor?',
  'Pode hoje?',
  'Confirmo o serviço',
];

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useApp();
  const conversationId = id as string;
  const flatListRef = useRef<FlatList>(null);

  // Usar hook de chat com polling a cada 5 segundos
  const {
    messages,
    conversation,
    loading,
    error,
    sending,
    sendMessage,
    markAsRead,
  } = useChat({
    conversationId,
    pollingInterval: 5000,
    autoMarkAsRead: true,
  });

  // Marcar como lida quando a tela é aberta
  useEffect(() => {
    if (conversationId) {
      markAsRead();
    }
  }, [conversationId, markAsRead]);

  // Scroll para última mensagem quando novas mensagens chegam
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!message.trim() || sending) return;

    try {
      await sendMessage(message.trim());
      setMessage('');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  const handleQuickMessage = async (text: string) => {
    if (sending) return;
    try {
      await sendMessage(text);
    } catch (err) {
      console.error('Erro ao enviar mensagem rápida:', err);
    }
  };

  const [message, setMessage] = useState('');

  if (loading && !conversation) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Carregando conversa...</Text>
      </View>
    );
  }

  if (error && !conversation) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  if (!conversation) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Text style={styles.errorText}>Conversa não encontrada</Text>
      </View>
    );
  }

  const isOwnMessage = (senderUserId: string) => {
    return senderUserId === user?.id;
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isOwn = isOwnMessage(item.sender_user_id);
    return (
      <View
        style={[
          styles.messageBubble,
          isOwn ? styles.messageBubbleClient : styles.messageBubbleProfessional,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isOwn && styles.messageTextClient,
          ]}
        >
          {item.content}
        </Text>
        <Text
          style={[
            styles.messageTime,
            isOwn && styles.messageTimeClient,
          ]}
        >
          {new Date(item.created_at).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </Pressable>

        <View style={styles.headerInfo}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>
              {conversation.consumer_user_id === user?.id ? 'P' : 'C'}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerName}>
              {conversation.consumer_user_id === user?.id
                ? 'Prestador'
                : 'Cliente'}
            </Text>
            {conversation.unread_count > 0 && (
              <Text style={styles.unreadBadge}>
                {conversation.unread_count} não lidas
              </Text>
            )}
          </View>
        </View>

        <View style={styles.headerRight} />
      </View>

      {loading && messages.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Carregando mensagens...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />
      )}

      <View style={styles.quickMessagesContainer}>
        <FlatList
          data={quickMessages}
          renderItem={({ item }) => (
            <Pressable
              style={styles.quickMessageChip}
              onPress={() => handleQuickMessage(item)}
              disabled={sending}
            >
              <Text style={styles.quickMessageText}>{item}</Text>
            </Pressable>
          )}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickMessagesList}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#999999"
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          editable={!sending}
        />
        <Pressable
          style={[
            styles.sendButton,
            (!message.trim() || sending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!message.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Send
              size={20}
              color={message.trim() ? '#FFFFFF' : '#999999'}
              fill={message.trim() ? '#FFFFFF' : 'transparent'}
            />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerText: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  unreadBadge: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  headerRight: {
    width: 32,
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  messageBubbleClient: {
    alignSelf: 'flex-end',
    backgroundColor: '#4A90E2',
    borderBottomRightRadius: 4,
  },
  messageBubbleProfessional: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTextClient: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 12,
    color: '#666666',
  },
  messageTimeClient: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  quickMessagesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  quickMessagesList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  quickMessageChip: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  quickMessageText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  errorText: {
    fontSize: 16,
    color: '#C62828',
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
