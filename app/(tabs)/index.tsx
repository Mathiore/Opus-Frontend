import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Search } from 'lucide-react-native';
import { MapView } from '@/components/MapView';
import { BottomSheet } from '@/components/BottomSheet';
import { CategoryChip } from '@/components/CategoryChip';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { useApp } from '@/context/AppContext';

export default function HomeScreen() {
  const router = useRouter();
  const { categories } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = categories.find((c) => c.id === categoryId);
    router.push({
      pathname: '/publish',
      params: { categoryId, categoryName: category?.name },
    });
  };

  const handlePublishService = () => {
    router.push('/publish');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Logo size="small" />
          <Pressable style={styles.locationButton}>
            <MapPin size={20} color="#4A90E2" />
            <Text style={styles.locationText}>São Paulo, SP</Text>
          </Pressable>
        </View>

        <Pressable style={styles.searchBar}>
          <Search size={20} color="#999999" />
          <Text style={styles.searchPlaceholder}>
            Buscar serviço ou endereço
          </Text>
        </Pressable>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          pins={[
            {
              id: '1',
              latitude: -23.5505,
              longitude: -46.6333,
              title: 'Eletricista',
            },
            {
              id: '2',
              latitude: -23.5629,
              longitude: -46.6544,
              title: 'Encanador',
            },
          ]}
        />
      </View>

      <BottomSheet style={styles.bottomSheet}>
        <Text style={styles.bottomSheetTitle}>O que você precisa?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              name={category.name}
              icon={category.icon}
              selected={selectedCategory === category.id}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </ScrollView>
      </BottomSheet>

      <View style={styles.floatingButton}>
        <Button
          title="Publicar serviço"
          onPress={handlePublishService}
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A90E2',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#999999',
  },
  mapContainer: {
    flex: 1,
  },
  bottomSheet: {
    maxHeight: 200,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 220,
    left: 20,
    right: 20,
  },
});
