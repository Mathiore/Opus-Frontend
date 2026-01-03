import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Star,
  MessageCircle,
} from 'lucide-react-native';
import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getOrderById, acceptProposal } = useApp();

  const order = getOrderById(id as string);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Pedido não encontrado</Text>
      </View>
    );
  }

  const acceptedProposal = order.proposals.find((p) => p.accepted);

  const handleAcceptProposal = (proposalId: string) => {
    acceptProposal(order.id, proposalId);
  };

  const handleGoToPayment = () => {
    router.push(`/payment/${order.id}`);
  };

  const handleOpenChat = (professionalId: string) => {
    const conversation = order.proposals.find(
      (p) => p.professionalId === professionalId
    );
    if (conversation) {
      router.push(`/chat/c1`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </Pressable>
        <Text style={styles.headerTitle}>Detalhes do Pedido</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.categoryTitle}>{order.categoryName}</Text>
            <StatusBadge status={order.status} />
          </View>

          <Text style={styles.description}>{order.description}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <MapPin size={20} color="#4A90E2" />
              <Text style={styles.infoText}>{order.address}</Text>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={20} color="#4A90E2" />
              <Text style={styles.infoText}>
                {order.date.toLocaleDateString('pt-BR')}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Clock size={20} color="#4A90E2" />
              <Text style={styles.infoText}>
                {order.date.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                • {order.duration}h
              </Text>
            </View>
          </View>

          {order.observations && (
            <View style={styles.observationsBox}>
              <Text style={styles.observationsLabel}>Observações</Text>
              <Text style={styles.observationsText}>{order.observations}</Text>
            </View>
          )}
        </View>

        {acceptedProposal && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Proposta Aceita</Text>
            <View style={styles.acceptedProposalCard}>
              <View style={styles.proposalHeader}>
                <Image
                  source={{ uri: acceptedProposal.professionalAvatar }}
                  style={styles.avatar}
                />
                <View style={styles.proposalInfo}>
                  <Text style={styles.professionalName}>
                    {acceptedProposal.professionalName}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Star size={16} color="#FFB800" fill="#FFB800" />
                    <Text style={styles.rating}>
                      {acceptedProposal.professionalRating}
                    </Text>
                  </View>
                </View>
                <Text style={styles.price}>
                  R$ {acceptedProposal.price.toFixed(2)}
                </Text>
              </View>
            </View>

            {order.status === 'confirmed' && (
              <Button
                title="Ir para pagamento"
                onPress={handleGoToPayment}
                style={styles.paymentButton}
              />
            )}
          </View>
        )}

        {order.proposals.length > 0 && !acceptedProposal && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Propostas ({order.proposals.length})
            </Text>

            {order.proposals.map((proposal) => (
              <View key={proposal.id} style={styles.proposalCard}>
                <View style={styles.proposalHeader}>
                  <Image
                    source={{ uri: proposal.professionalAvatar }}
                    style={styles.avatar}
                  />
                  <View style={styles.proposalInfo}>
                    <Text style={styles.professionalName}>
                      {proposal.professionalName}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <Star size={16} color="#FFB800" fill="#FFB800" />
                      <Text style={styles.rating}>
                        {proposal.professionalRating}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.price}>
                    R$ {proposal.price.toFixed(2)}
                  </Text>
                </View>

                <Text style={styles.proposalMessage}>{proposal.message}</Text>

                <View style={styles.proposalActions}>
                  <Pressable
                    style={styles.chatButton}
                    onPress={() => handleOpenChat(proposal.professionalId)}
                  >
                    <MessageCircle size={20} color="#4A90E2" />
                    <Text style={styles.chatButtonText}>Chat</Text>
                  </Pressable>

                  <Pressable
                    style={styles.acceptButton}
                    onPress={() => handleAcceptProposal(proposal.id)}
                  >
                    <Text style={styles.acceptButtonText}>Aceitar</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
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
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  observationsBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  observationsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  observationsText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  acceptedProposalCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  proposalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  proposalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0E0E0',
  },
  proposalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A90E2',
  },
  proposalMessage: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  proposalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A90E2',
    gap: 8,
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  acceptButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  paymentButton: {
    marginTop: 0,
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 100,
  },
});
