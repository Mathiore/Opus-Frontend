import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Star } from 'lucide-react-native';
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
  const { getConversationById, sendMessage } = useApp();

  const conversation = getConversationById(id as string);
  const [message, setMessage] = useState('');

  if (!conversation) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Conversa não encontrada</Text>
      </View>
    );
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(conversation.id, message.trim());
      setMessage('');
    }
  };

  const handleQuickMessage = (text: string) => {
    sendMessage(conversation.id, text);
  };

  const renderMessage = ({ item }: { item: any }) => (
    <View
      style={[
        styles.messageBubble,
        item.isFromClient
          ? styles.messageBubbleClient
          : styles.messageBubbleProfessional,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.isFromClient && styles.messageTextClient,
        ]}
      >
        {item.text}
      </Text>
      <Text
        style={[
          styles.messageTime,
          item.isFromClient && styles.messageTimeClient,
        ]}
      >
        {item.timestamp.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </Pressable>

        <View style={styles.headerInfo}>
          <Image
            source={{ uri: conversation.professionalAvatar }}
            style={styles.headerAvatar}
          />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>
              {conversation.professionalName}
            </Text>
            <View style={styles.headerRating}>
              <Star size={14} color="#FFB800" fill="#FFB800" />
              <Text style={styles.headerRatingText}>4.8</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={conversation.messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        inverted={false}
      />

      <View style={styles.quickMessagesContainer}>
        <FlatList
          data={quickMessages}
          renderItem={({ item }) => (
            <Pressable
              style={styles.quickMessageChip}
              onPress={() => handleQuickMessage(item)}
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
        />
        <Pressable
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSendMessage}
          disabled={!message.trim()}
        >
          <Send
            size={20}
            color={message.trim() ? '#FFFFFF' : '#999999'}
            fill={message.trim() ? '#FFFFFF' : 'transparent'}
          />
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
    backgroundColor: '#E0E0E0',
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
  headerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
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
    color: '#666666',
    textAlign: 'center',
    marginTop: 100,
  },
});
