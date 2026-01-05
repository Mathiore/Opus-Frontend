import AsyncStorage from '@react-native-async-storage/async-storage';
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos

  try {
    const response = await fetch(`${API_URL}/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const data: LoginResponse = await response.json();
    
    // Salvar token
    await saveToken(data.token);

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Network request timed out');
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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos

  try {
    const response = await fetch(`${API_URL}/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const data: RegisterResponse = await response.json();
    
    // Salvar token
    await saveToken(data.token);

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Network request timed out');
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

