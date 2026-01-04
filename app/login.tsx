import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignIn, useAuth } from '@clerk/clerk-expo';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Logo } from '@/components/Logo';
import { getApiUrl } from '@/utils/apiConfig';

export default function LoginScreen() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const { getToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError('');

      const result = await signIn.create({
        identifier: email,
        password,
      });

      console.log('Login result status:', result.status);
      console.log('Login result:', JSON.stringify(result, null, 2));
      console.log('createdSessionId:', result.createdSessionId);
      console.log('supportedFirstFactors:', result.supportedFirstFactors);
      console.log('supportedSecondFactors:', result.supportedSecondFactors);

      // ⚠️ WORKAROUND: Se houver createdSessionId, completar login independente do status
      // Isso resolve o problema quando Clerk retorna needs_second_factor incorretamente
      if (result.createdSessionId) {
        try {
          console.log('SessionId encontrado, completando login...');
          await setActive({ session: result.createdSessionId });
          
          // Aguardar um pouco para garantir que a sessão está ativa e o token está disponível
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Sincronizar usuário imediatamente (não bloquear redirecionamento)
          const syncPromise = (async () => {
            try {
              const token = await getToken();
              if (!token) {
                console.warn('Token não disponível ainda, AppContext vai tentar novamente');
                return;
              }

              const API_URL = getApiUrl();
              
              // Criar um AbortController para timeout
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

              try {
                const syncResponse = await fetch(`${API_URL}/v1/auth/me`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (syncResponse.ok) {
                  const syncData = await syncResponse.json();
                  console.log('Usuário sincronizado com sucesso:', syncData);
                } else {
                  console.warn('Aviso: Falha ao sincronizar usuário');
                }
              } catch (fetchError: any) {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                  console.warn('Timeout ao sincronizar usuário. AppContext vai tentar novamente.');
                } else {
                  console.warn('Erro ao sincronizar usuário:', fetchError.message);
                }
              }
            } catch (syncError: any) {
              console.warn('Erro ao obter token ou sincronizar:', syncError.message);
            }
          })();
          
          router.replace('/(tabs)');
          
          // Executar sincronização em background (não bloquear)
          syncPromise.catch(() => {
            // Erro já foi logado acima
          });
          
          return;
        } catch (err) {
          console.error('Erro ao completar login com sessionId:', err);
          // Continuar com o fluxo normal abaixo
        }
      }

      // Verificar diferentes status possíveis
      if (result.status === 'complete') {
        // Login completo, ativar sessão
        if (result.createdSessionId) {
          await setActive({ session: result.createdSessionId });
          
          // Aguardar um pouco para garantir que a sessão está ativa e o token está disponível
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // ⚠️ CRÍTICO: Sincronizar usuário imediatamente após login (lazy sync)
          // Não bloquear o redirecionamento se a sincronização falhar
          // O AppContext vai tentar novamente automaticamente
          const syncPromise = (async () => {
            try {
              const token = await getToken();
              if (!token) {
                console.warn('Token não disponível ainda, AppContext vai tentar novamente');
                return;
              }

              const API_URL = getApiUrl();
              
              // Criar um AbortController para timeout
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

              try {
                const syncResponse = await fetch(`${API_URL}/v1/auth/me`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (syncResponse.ok) {
                  const syncData = await syncResponse.json();
                  console.log('Usuário sincronizado com sucesso após login:', syncData);
                } else {
                  console.warn('Aviso: Falha ao sincronizar usuário, mas login foi bem-sucedido');
                }
              } catch (fetchError: any) {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                  console.warn('Timeout ao sincronizar usuário. AppContext vai tentar novamente.');
                } else {
                  console.warn('Erro ao sincronizar usuário:', fetchError.message);
                }
              }
            } catch (syncError: any) {
              console.warn('Erro ao obter token ou sincronizar:', syncError.message);
            }
          })();
          
          // Redirecionar imediatamente, não esperar pela sincronização
          // O AppContext vai tentar sincronizar automaticamente quando detectar o login
          router.replace('/(tabs)');
          
          // Executar sincronização em background (não bloquear)
          syncPromise.catch(() => {
            // Erro já foi logado acima
          });
        } else {
          setError('Sessão não foi criada. Tente novamente.');
        }
      } else if (result.status === 'needs_first_factor') {
        // Precisa de verificação adicional (email, SMS, etc)
        const firstFactor = result.supportedFirstFactors?.[0];
        
        if (firstFactor?.strategy === 'email_code') {
          // Preparar verificação por email
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
          });
          // Redirecionar para tela de verificação
          router.push('/verify-login-email');
          return;
        } else if (firstFactor?.strategy === 'phone_code') {
          setError('Código de verificação enviado para seu telefone.');
        } else {
          setError(`Verificação adicional necessária: ${firstFactor?.strategy || 'desconhecido'}`);
        }
      } else if (result.status === 'needs_second_factor') {
        // Clerk está exigindo verificação de email como segundo fator
        // Isso acontece quando "Email verification" está habilitado para sign-in
        const secondFactor = result.supportedSecondFactors?.[0];
        
        if (secondFactor?.strategy === 'email_code') {
          // Preparar verificação por email (segundo fator)
          try {
            await signIn.prepareSecondFactor({
              strategy: 'email_code',
            });
            // Redirecionar para tela de verificação
            router.push('/verify-login-email');
            return;
          } catch (err: any) {
            console.error('Erro ao preparar segundo fator:', err);
            setError(err.errors?.[0]?.message || 'Erro ao preparar verificação de email. Tente novamente.');
          }
        } else if (secondFactor?.strategy === 'email_link') {
          setError('Verificação por link de email não suportada. Use código de verificação.');
        } else {
          console.error('Segundo fator não suportado:', secondFactor);
          setError('Método de verificação não suportado. Verifique as configurações do Clerk.');
        }
      } else {
        // Outros status - tentar completar se houver sessionId
        console.warn('Status de login não tratado:', result.status);
        console.warn('Result completo:', JSON.stringify(result, null, 2));
        
        // Se tiver sessionId, tentar completar mesmo assim
        if (result.createdSessionId) {
          try {
            await setActive({ session: result.createdSessionId });
            
            // Sincronizar usuário
            const token = await getToken();
            if (token) {
              const API_URL = getApiUrl();
              await fetch(`${API_URL}/v1/auth/me`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
            }
            
            router.replace('/(tabs)');
            return;
          } catch (err) {
            console.error('Erro ao tentar completar login:', err);
          }
        }
        
        setError(`Status de login: ${result.status}. Verifique as configurações do Clerk.`);
      }
    } catch (err: any) {
      const errorMessage = err.errors?.[0]?.message || err.message || 'Erro ao fazer login';
      setError(errorMessage);
      console.error('Erro no login:', err);
      console.error('Erro completo:', JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Logo size="large" style={styles.logo} />
          <Text style={styles.subtitle}>Bem-vindo de volta</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            label="Email ou Telefone"
            placeholder="Digite seu email ou telefone"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </Pressable>

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            disabled={!email || !password}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Criar conta"
            onPress={() => router.push('/signup')}
            variant="outline"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 14,
    color: '#999999',
    marginHorizontal: 16,
  },
});
