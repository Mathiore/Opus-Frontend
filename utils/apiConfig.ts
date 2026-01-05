import { Platform } from 'react-native';

/**
 * Normaliza a URL da API, adicionando protocolo se necessário
 */
function normalizeUrl(url: string): string {
  // Remove espaços
  url = url.trim();
  
  // Se não tiver protocolo, adiciona http://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://${url}`;
  }
  
  return url;
}

/**
 * Obtém a URL base da API
 * 
 * Em desenvolvimento:
 * - iOS Simulator: localhost funciona
 * - Android Emulator: usa 10.0.2.2 (mesmo se configurado localhost)
 * - Dispositivo físico: precisa do IP da máquina
 */
export function getApiUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  const platform = Platform.OS;
  
  console.log(`[API Config] Platform: ${platform}`);
  console.log(`[API Config] EXPO_PUBLIC_API_URL: ${envUrl || '(não definido)'}`);
  
  if (envUrl) {
    let url = normalizeUrl(envUrl);
    const originalUrl = url;
    
    // Se estiver no Android e a URL contém localhost, substitui por 10.0.2.2
    if (platform === 'android' && (url.includes('localhost') || url.includes('127.0.0.1'))) {
      url = url.replace(/localhost|127\.0\.0\.1/g, '10.0.2.2');
      console.log(`[API Config] ⚠️ Android detectado: ${originalUrl} -> ${url}`);
      console.log(`[API Config] ℹ️ No Android, localhost não funciona. Use 10.0.2.2 ou o IP da máquina.`);
    }
    
    console.log(`[API Config] ✅ URL final da API: ${url}`);
    return url;
  }

  // Se não tiver variável de ambiente, tenta detectar automaticamente
  if (__DEV__) {
    // Android Emulator
    if (Platform.OS === 'android') {
      const url = 'http://10.0.2.2:3030';
      console.log(`[API Config] Android detectado (sem env): ${url}`);
      return url;
    }
    
    // iOS Simulator ou desenvolvimento web
    const url = 'http://localhost:3030';
    console.log(`[API Config] iOS/Web detectado (sem env): ${url}`);
    return url;
  }

  // Produção - deve ter EXPO_PUBLIC_API_URL configurado
  const url = 'http://localhost:3030';
  console.warn('[API Config] Usando URL padrão (produção deve ter EXPO_PUBLIC_API_URL)');
  return url;
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

