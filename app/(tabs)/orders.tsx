import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, MapPin } from 'lucide-react-native';
import { StatusBadge } from '@/components/StatusBadge';
import { useApp } from '@/context/AppContext';
import { Order } from '@/types';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const activeOrders = orders.filter(
    (o) => !['completed', 'cancelled'].includes(o.status)
  );
  const historyOrders = orders.filter((o) =>
    ['completed', 'cancelled'].includes(o.status)
  );

  const displayOrders = activeTab === 'active' ? activeOrders : historyOrders;

  const renderOrderCard = ({ item }: { item: Order }) => (
    <Pressable
      style={styles.orderCard}
      onPress={() => router.push(`/orders/${item.id}`)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderCategory}>{item.categoryName}</Text>
        <StatusBadge status={item.status} />
      </View>

      <Text style={styles.orderDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.orderInfo}>
        <View style={styles.orderInfoRow}>
          <MapPin size={16} color="#666666" />
          <Text style={styles.orderInfoText} numberOfLines={1}>
            {item.address}
          </Text>
        </View>

        <View style={styles.orderInfoRow}>
          <Calendar size={16} color="#666666" />
          <Text style={styles.orderInfoText}>
            {item.date.toLocaleDateString('pt-BR')} às{' '}
            {item.date.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>

      {item.proposals.length > 0 && (
        <View style={styles.proposalsTag}>
          <Text style={styles.proposalsTagText}>
            {item.proposals.length}{' '}
            {item.proposals.length === 1 ? 'proposta' : 'propostas'}
          </Text>
        </View>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Pedidos</Text>
      </View>

      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.tabTextActive,
            ]}
          >
            Ativos
          </Text>
          {activeOrders.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{activeOrders.length}</Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.tabTextActive,
            ]}
          >
            Histórico
          </Text>
        </Pressable>
      </View>

      {displayOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Nenhum pedido encontrado</Text>
          <Text style={styles.emptyStateText}>
            {activeTab === 'active'
              ? 'Você não tem pedidos ativos no momento'
              : 'Seu histórico de pedidos está vazio'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabBadge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A90E2',
  },
  ordersList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderCategory: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  orderDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  orderInfo: {
    gap: 8,
  },
  orderInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderInfoText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  proposalsTag: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  proposalsTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
