import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Search } from 'lucide-react-native';
import * as Location from 'expo-location';
import { MapView } from '@/components/MapView';
import { BottomSheet } from '@/components/BottomSheet';
import { CategoryChip } from '@/components/CategoryChip';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { useApp } from '@/context/AppContext';
import { useNearbyJobs } from '@/hooks/useNearbyJobs';
import type { Job } from '@/types/api';

export default function HomeScreen() {
  const router = useRouter();
  const { categories } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  // Obter localização do usuário
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permissão de localização negada');
          // Fallback para São Paulo
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
          setLocationLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        // Fallback para São Paulo
        setUserLocation({ lat: -23.5505, lng: -46.6333 });
      } finally {
        setLocationLoading(false);
      }
    };

    getLocation();
  }, []);

  // Buscar jobs próximos
  const { jobs, loading: jobsLoading, error: jobsError } = useNearbyJobs({
    lat: userLocation?.lat || -23.5505,
    lng: userLocation?.lng || -46.6333,
    radiusKm: 10,
    categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
    status: 'open',
    limit: 50,
    autoFetch: !!userLocation,
  });

  // Converter jobs para pins do mapa
  const mapPins = jobs.map((job: Job) => ({
    id: job.id,
    latitude: job.lat,
    longitude: job.lng,
    title: job.title,
  }));

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

  const handlePinPress = (pin: { id: string; latitude: number; longitude: number; title?: string }) => {
    const job = jobs.find((j) => j.id === pin.id);
    if (job) {
      router.push(`/orders/${job.id}`);
    }
  };

  const handleMapPress = (latitude: number, longitude: number) => {
    // Opcional: fazer algo quando o mapa é clicado
    console.log('Mapa clicado:', latitude, longitude);
  };

  if (locationLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Obtendo localização...</Text>
      </View>
    );
  }

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
        {jobsError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Erro ao carregar trabalhos: {jobsError}</Text>
          </View>
        ) : (
          <MapView
            pins={mapPins}
            centerPin={true}
            initialCenter={userLocation ? { latitude: userLocation.lat, longitude: userLocation.lng } : undefined}
            zoom={14}
            onPinPress={handlePinPress}
            onMapPress={handleMapPress}
          />
        )}
        {jobsLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#4A90E2" />
            <Text style={styles.loadingTextSmall}>Carregando trabalhos...</Text>
          </View>
        )}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingTextSmall: {
    fontSize: 12,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#C62828',
    textAlign: 'center',
  },
});
