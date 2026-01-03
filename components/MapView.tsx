import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';

interface Pin {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
}

interface MapViewProps {
  pins?: Pin[];
  centerPin?: boolean;
}

export function MapView({ pins = [], centerPin = false }: MapViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.mapBackground}>
        <View style={styles.gridLine} />
        <View style={[styles.gridLine, styles.gridLineHorizontal]} />
      </View>

      {centerPin && (
        <View style={styles.centerPinContainer}>
          <MapPin size={32} color="#4A90E2" fill="#4A90E2" />
        </View>
      )}

      {pins.map((pin, index) => (
        <View
          key={pin.id}
          style={[
            styles.pin,
            {
              left: `${20 + index * 25}%`,
              top: `${30 + index * 15}%`,
            },
          ]}
        >
          <MapPin size={24} color="#FF3B30" fill="#FF3B30" />
          {pin.title && (
            <View style={styles.pinLabel}>
              <Text style={styles.pinLabelText}>{pin.title}</Text>
            </View>
          )}
        </View>
      ))}

      <View style={styles.placeholderTextContainer}>
        <Text style={styles.placeholderText}>Mapa (Placeholder)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E8F5E9',
    position: 'relative',
    overflow: 'hidden',
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#C8E6C9',
  },
  gridLineHorizontal: {
    left: 0,
    right: 0,
    top: '50%',
    bottom: 'auto',
    width: '100%',
    height: 1,
  },
  centerPinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -32 }],
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinLabel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pinLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000000',
  },
  placeholderTextContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
});
