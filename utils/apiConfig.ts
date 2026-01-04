import { Platform } from 'react-native';

/**
 * Obtém a URL base da API
 * 
 * Em desenvolvimento:
 * - iOS Simulator: localhost funciona
 * - Android Emulator: usa 10.0.2.2
 * - Dispositivo físico: precisa do IP da máquina
 */
export function getApiUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  
  if (envUrl) {
    return envUrl;
  }

  // Se não tiver variável de ambiente, tenta detectar automaticamente
  if (__DEV__) {
    // Android Emulator
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3030';
    }
    
    // iOS Simulator ou desenvolvimento web
    return 'http://localhost:3030';
  }

  // Produção - deve ter EXPO_PUBLIC_API_URL configurado
  return 'http://localhost:3030';
}

/**
 * Verifica se o backend está acessível
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      timeout: 5000,
    } as any);
    return response.ok;
  } catch {
    return false;
  }
}

