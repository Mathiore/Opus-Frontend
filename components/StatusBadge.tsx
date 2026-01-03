import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderStatus } from '@/types';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string }
> = {
  published: {
    label: 'Publicado',
    color: '#4A90E2',
    bgColor: '#E3F2FD',
  },
  proposals: {
    label: 'Propostas',
    color: '#FF9500',
    bgColor: '#FFF3E0',
  },
  confirmed: {
    label: 'Confirmado',
    color: '#34C759',
    bgColor: '#E8F5E9',
  },
  in_progress: {
    label: 'Em execução',
    color: '#5856D6',
    bgColor: '#EDE7F6',
  },
  completed: {
    label: 'Concluído',
    color: '#34C759',
    bgColor: '#E8F5E9',
  },
  cancelled: {
    label: 'Cancelado',
    color: '#FF3B30',
    bgColor: '#FFEBEE',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
      <Text style={[styles.text, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
