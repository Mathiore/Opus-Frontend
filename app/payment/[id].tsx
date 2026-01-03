import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, CreditCard, Star } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useApp } from '@/context/AppContext';

export default function PaymentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getOrderById, updateOrderStatus } = useApp();
  const [loading, setLoading] = useState(false);

  const order = getOrderById(id as string);
  const acceptedProposal = order?.proposals.find((p) => p.accepted);

  if (!order || !acceptedProposal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Pedido não encontrado</Text>
      </View>
    );
  }

  const serviceValue = acceptedProposal.price;
  const platformFee = serviceValue * 0.12;
  const totalValue = serviceValue + platformFee;

  const handleConfirmPayment = async () => {
    setLoading(true);
    setTimeout(() => {
      updateOrderStatus(order.id, 'in_progress');
      setLoading(false);
      router.replace('/(tabs)/orders');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </Pressable>
        <Text style={styles.headerTitle}>Pagamento</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do Serviço</Text>

          <View style={styles.serviceCard}>
            <Text style={styles.categoryName}>{order.categoryName}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {order.description}
            </Text>
            <Text style={styles.address}>{order.address}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profissional</Text>

          <View style={styles.professionalCard}>
            <Image
              source={{ uri: acceptedProposal.professionalAvatar }}
              style={styles.avatar}
            />
            <View style={styles.professionalInfo}>
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
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes do Pagamento</Text>

          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Valor do serviço</Text>
              <Text style={styles.breakdownValue}>
                R$ {serviceValue.toFixed(2)}
              </Text>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Taxa da plataforma (12%)</Text>
              <Text style={styles.breakdownValue}>
                R$ {platformFee.toFixed(2)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.breakdownRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R$ {totalValue.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Pagamento</Text>

          <Pressable style={styles.paymentMethodCard}>
            <View style={styles.paymentMethodIcon}>
              <CreditCard size={24} color="#4A90E2" />
            </View>
            <View style={styles.paymentMethodInfo}>
              <Text style={styles.paymentMethodName}>Cartão de Crédito</Text>
              <Text style={styles.paymentMethodDetails}>•••• 4532</Text>
            </View>
            <Text style={styles.changeText}>Trocar</Text>
          </Pressable>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            O pagamento será liberado para o profissional apenas após a
            conclusão do serviço.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerSummary}>
          <Text style={styles.footerLabel}>Total a pagar</Text>
          <Text style={styles.footerTotal}>R$ {totalValue.toFixed(2)}</Text>
        </View>
        <Button
          title="Confirmar pagamento"
          onPress={handleConfirmPayment}
          loading={loading}
        />
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  address: {
    fontSize: 14,
    color: '#666666',
  },
  professionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0E0E0',
  },
  professionalInfo: {
    flex: 1,
    marginLeft: 16,
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
  breakdownCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownLabel: {
    fontSize: 16,
    color: '#666666',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A90E2',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentMethodInfo: {
    flex: 1,
    marginLeft: 16,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  paymentMethodDetails: {
    fontSize: 14,
    color: '#666666',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  infoBox: {
    marginHorizontal: 20,
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#4A90E2',
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerLabel: {
    fontSize: 16,
    color: '#666666',
  },
  footerTotal: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 100,
  },
});
