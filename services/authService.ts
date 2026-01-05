import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getApiUrl } from '@/utils/apiConfig';

const TOKEN_KEY = '@opus:auth_token';

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    photo_url?: string;
    roles?: Array<{ id: number; name: string }>;
  };
  token: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name: string;
    photo_url?: string;
    roles?: Array<{ id: number; name: string }>;
  };
  token: string;
}

/**
 * Armazena o token JWT no AsyncStorage
 */
export async function saveToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Erro ao salvar token:', error);
    throw error;
  }
}

/**
 * Recupera o token JWT do AsyncStorage
 */
export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
    return null;
  }
}

/**
 * Remove o token JWT do AsyncStorage
 */
export async function removeToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Erro ao remover token:', error);
    throw error;
  }
}

/**
 * Faz login com email e senha
 */
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const API_URL = getApiUrl();
  const fullUrl = `${API_URL}/v1/auth/login`;

  console.log(`[Auth Service] Tentando fazer login em: ${fullUrl}`);

  // Teste de conectividade básico primeiro
  try {
    console.log(`[Auth Service] Testando conectividade com ${API_URL}...`);
    const healthCheck = await fetch(`${API_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 segundos para health check
    });
    console.log(`[Auth Service] Health check: ${healthCheck.status} ${healthCheck.statusText}`);
  } catch (healthError: any) {
    console.warn(`[Auth Service] ⚠️ Health check falhou: ${healthError.message}`);
    console.warn(`[Auth Service] Continuando mesmo assim...`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos (aumentado para debug)

  try {
    console.log(`[Auth Service] Iniciando requisição POST para ${fullUrl}...`);
    const startTime = Date.now();
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });
    
    const duration = Date.now() - startTime;
    console.log(`[Auth Service] Resposta recebida em ${duration}ms: ${response.status}`);

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP ${response.status}`;
      console.error(`[Auth Service] Erro no login: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    const data: LoginResponse = await response.json();
    
    // Salvar token
    await saveToken(data.token);
    console.log('[Auth Service] Login bem-sucedido, token salvo');

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('=== [Auth Service] TIMEOUT ===');
      console.error(`URL: ${fullUrl}`);
      console.error(`Timeout após 30 segundos`);
      console.error('\n🔍 Possíveis causas:');
      console.error('1. Backend não está acessível nesse IP');
      console.error('2. Firewall bloqueando a conexão');
      console.error('3. Backend está demorando muito para responder');
      console.error('4. Problema de rede entre dispositivo e servidor');
      console.error('\n💡 Teste no navegador:');
      console.error(`   ${fullUrl}`);
      console.error(`   Ou teste o health: ${API_URL}/health`);
      
      throw new Error(
        `Timeout ao conectar com o servidor.\n\n` +
        `URL: ${fullUrl}\n\n` +
        `Verifique se:\n` +
        `• O backend está rodando e acessível\n` +
        `• O IP está correto (192.168.0.2)\n` +
        `• O firewall permite conexões na porta 3030\n` +
        `• Teste a URL no navegador primeiro`
      );
    }
    if (error.message === 'Network request failed' || error.message?.includes('Network request failed')) {
      console.error(
        `[Auth Service] Erro de rede ao fazer login. URL tentada: ${fullUrl}\n` +
        `Verifique se:\n` +
        `1. O backend está rodando\n` +
        `2. A URL está correta (Android precisa usar 10.0.2.2 ou IP da máquina)\n` +
        `3. O dispositivo/emulador tem acesso à rede`
      );
    }
    throw error;
  }
}

/**
 * Registra um novo usuário
 */
export async function register(
  email: string,
  password: string,
  name: string
): Promise<RegisterResponse> {
  const API_URL = getApiUrl();
  const fullUrl = `${API_URL}/v1/auth/register`;

  // Logs detalhados para debug
  console.log('=== [Auth Service] Debug de Registro ===');
  console.log(`[Auth Service] EXPO_PUBLIC_API_URL: ${process.env.EXPO_PUBLIC_API_URL || '(não definido)'}`);
  console.log(`[Auth Service] URL da API: ${API_URL}`);
  console.log(`[Auth Service] URL completa: ${fullUrl}`);
  console.log(`[Auth Service] Tentando registrar usuário...`);

  // Teste de conectividade básico primeiro
  try {
    console.log(`[Auth Service] Testando conectividade com ${API_URL}...`);
    const healthCheck = await fetch(`${API_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 segundos para health check
    });
    console.log(`[Auth Service] Health check: ${healthCheck.status} ${healthCheck.statusText}`);
  } catch (healthError: any) {
    console.warn(`[Auth Service] ⚠️ Health check falhou: ${healthError.message}`);
    console.warn(`[Auth Service] Continuando mesmo assim...`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos (aumentado para debug)

  try {
    console.log(`[Auth Service] Iniciando requisição POST para ${fullUrl}...`);
    const startTime = Date.now();
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
      signal: controller.signal,
    });
    
    const duration = Date.now() - startTime;
    console.log(`[Auth Service] Resposta recebida em ${duration}ms: ${response.status}`);

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP ${response.status}`;
      console.error(`[Auth Service] Erro no registro: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    const data: RegisterResponse = await response.json();
    
    // Salvar token
    await saveToken(data.token);
    console.log('[Auth Service] Registro bem-sucedido, token salvo');

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('=== [Auth Service] TIMEOUT ===');
      console.error(`URL: ${fullUrl}`);
      console.error(`Timeout após 30 segundos`);
      console.error('\n🔍 Possíveis causas:');
      console.error('1. Backend não está acessível nesse IP');
      console.error('2. Firewall bloqueando a conexão');
      console.error('3. Backend está demorando muito para responder');
      console.error('4. Problema de rede entre dispositivo e servidor');
      console.error('\n💡 Teste no navegador:');
      console.error(`   ${fullUrl}`);
      console.error(`   Ou teste o health: ${API_URL}/health`);
      
      throw new Error(
        `Timeout ao conectar com o servidor.\n\n` +
        `URL: ${fullUrl}\n\n` +
        `Verifique se:\n` +
        `• O backend está rodando e acessível\n` +
        `• O IP está correto (192.168.0.2)\n` +
        `• O firewall permite conexões na porta 3030\n` +
        `• Teste a URL no navegador primeiro`
      );
    }
    if (error.message === 'Network request failed' || error.message?.includes('Network request failed')) {
      console.error('=== [Auth Service] ERRO DE REDE ===');
      console.error(`URL tentada: ${fullUrl}`);
      console.error(`EXPO_PUBLIC_API_URL: ${process.env.EXPO_PUBLIC_API_URL || '(não definido)'}`);
      console.error(`Plataforma: ${Platform.OS}`);
      console.error('\n🔍 Troubleshooting:');
      console.error('1. Verifique se o backend está rodando na porta 3030');
      console.error('2. Teste a URL no navegador: ' + fullUrl);
      console.error('3. Para Android Emulator, use: http://10.0.2.2:3030');
      console.error('4. Para dispositivo físico, use o IP da sua máquina');
      console.error('5. Verifique se o firewall não está bloqueando a porta 3030');
      
      // Criar mensagem de erro mais amigável
      const friendlyError = new Error(
        `Não foi possível conectar ao servidor.\n\n` +
        `URL: ${fullUrl}\n\n` +
        `Soluções:\n` +
        `• Android Emulator: Use http://10.0.2.2:3030\n` +
        `• Dispositivo físico: Use o IP da sua máquina\n` +
        `• Verifique se o backend está rodando`
      );
      throw friendlyError;
    }
    throw error;
  }
}

/**
 * Faz logout removendo o token
 */
export async function logout(): Promise<void> {
  await removeToken();
}

/**
 * Verifica se há um token armazenado (usuário autenticado)
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}


