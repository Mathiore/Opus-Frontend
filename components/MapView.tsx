import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

interface Pin {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
}

interface MapViewProps {
  pins?: Pin[];
  centerPin?: boolean;
  initialCenter?: {
    latitude: number;
    longitude: number;
  };
  zoom?: number;
  onMapPress?: (latitude: number, longitude: number) => void;
  onPinPress?: (pin: Pin) => void;
}

export function MapView({
  pins = [],
  centerPin = false,
  initialCenter,
  zoom = 13,
  onMapPress,
  onPinPress,
}: MapViewProps) {
  const webViewRef = useRef<WebView>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  // Obter localização do usuário
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de localização negada');
        // Usa localização padrão (São Paulo) se não tiver permissão
        setUserLocation({ latitude: -23.5505, longitude: -46.6333 });
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      // Usa localização padrão em caso de erro
      setUserLocation({ latitude: -23.5505, longitude: -46.6333 });
    } finally {
      setLoading(false);
    }
  };

  // Atualiza o mapa quando a localização ou props mudarem
  useEffect(() => {
    if (!loading && userLocation && mapReady) {
      const timer = setTimeout(() => {
        if (webViewRef.current) {
          updateMap();
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pins, centerPin, userLocation, initialCenter, zoom, mapReady, loading]);

  const updateMap = () => {
    const script = generateLeafletScript();
    webViewRef.current?.injectJavaScript(script);
  };

  const generateLeafletScript = () => {
    const center = initialCenter || userLocation || { latitude: -23.5505, longitude: -46.6333 };
    
    const markers = pins
      .map(
        (pin) => `
      const markerIcon${pin.id} = L.divIcon({
        className: 'custom-marker',
        html: '<div style="width: 24px; height: 24px; background-color: #FF3B30; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const marker${pin.id} = L.marker([${pin.latitude}, ${pin.longitude}], {
        icon: markerIcon${pin.id}
      }).addTo(map);
      ${pin.title ? `marker${pin.id}.bindPopup('<strong>${pin.title}</strong>');` : ''}
      marker${pin.id}.on('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'pinPress',
          pinId: '${pin.id}',
          latitude: ${pin.latitude},
          longitude: ${pin.longitude},
          title: '${pin.title || ''}'
        }));
      });
    `
      )
      .join('');

    const centerMarker = centerPin
      ? `
      const centerIcon = L.divIcon({
        className: 'center-marker',
        html: '<div style="width: 32px; height: 32px; background-color: #4A90E2; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const centerMarker = L.marker([${center.latitude}, ${center.longitude}], {
        icon: centerIcon,
        zIndexOffset: 1000
      }).addTo(map);
    `
      : '';

    return `
      (function() {
        if (!window.map) {
          const map = L.map('map', {
            zoomControl: true,
            attributionControl: true
          }).setView([${center.latitude}, ${center.longitude}], ${zoom});
          window.map = map;
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(map);
          
          map.on('click', function(e) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapPress',
              latitude: e.latlng.lat,
              longitude: e.latlng.lng
            }));
          });
          
          map.whenReady(function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapReady'
            }));
          });
        } else {
          window.map.setView([${center.latitude}, ${center.longitude}], ${zoom});
          window.map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
              window.map.removeLayer(layer);
            }
          });
        }
        
        ${centerMarker}
        ${markers}
        
        true;
      })();
    `;
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'mapReady') {
        setMapReady(true);
      } else if (data.type === 'mapPress' && onMapPress) {
        onMapPress(data.latitude, data.longitude);
      } else if (data.type === 'pinPress' && onPinPress) {
        const pin = pins.find((p) => p.id === data.pinId);
        if (pin) {
          onPinPress(pin);
        }
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };

  const handleLoadEnd = () => {
    // Aguarda um pouco mais para garantir que o Leaflet carregou
    setTimeout(() => {
      if (webViewRef.current && userLocation) {
        updateMap();
      }
    }, 1000);
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
              integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
              crossorigin="" />
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body, html {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #E8F5E9;
          }
          #map {
            width: 100%;
            height: 100%;
          }
          .leaflet-container {
            background-color: #E8F5E9;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                crossorigin=""></script>
        <script>
          if (typeof L !== 'undefined') {
            ${generateLeafletScript()}
          } else {
            window.addEventListener('load', function() {
              setTimeout(function() {
                ${generateLeafletScript()}
              }, 500);
            });
          }
        </script>
      </body>
    </html>
  `;

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Carregando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={handleMessage}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={Platform.OS === 'android'}
        bounces={false}
        scrollEnabled={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
});
