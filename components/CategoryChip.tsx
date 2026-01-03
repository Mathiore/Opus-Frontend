import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import * as Icons from 'lucide-react-native';

interface CategoryChipProps {
  name: string;
  icon: string;
  selected?: boolean;
  onPress: () => void;
}

export function CategoryChip({
  name,
  icon,
  selected = false,
  onPress,
}: CategoryChipProps) {
  const IconComponent = (Icons as any)[
    icon.charAt(0).toUpperCase() + icon.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  ] || Icons.Box;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && styles.chipPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
        <IconComponent size={20} color={selected ? '#FFFFFF' : '#4A90E2'} />
      </View>
      <Text style={[styles.text, selected && styles.textSelected]}>
        {name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#4A90E2',
  },
  chipPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  iconContainerSelected: {
    backgroundColor: '#4A90E2',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  textSelected: {
    color: '#4A90E2',
    fontWeight: '600',
  },
});
