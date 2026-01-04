import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Logo } from '@/components/Logo';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isLoaded && signUp) {
      // Obter o email do signUp
      const emailAddress = signUp.emailAddress || signUp.unverifiedEmailAddresses?.[0];
      setEmail(emailAddress || '');
    }
  }, [isLoaded, signUp]);

  const handleVerify = async () => {
    if (!isLoaded || !signUp) return;

    if (code.length !== 6) {
      setError('O código deve ter 6 dígitos');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Tentar verificar o código
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === 'complete') {
        // Verificação bem-sucedida, ativar sessão
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)');
      } else {
        setError('Verificação incompleta. Tente novamente.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Código inválido. Tente novamente.');
      console.error('Erro na verificação:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || !signUp) return;

    try {
      setResending(true);
      setError('');

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      // Mostrar mensagem de sucesso
      setError('Código reenviado! Verifique seu email.');
      setTimeout(() => setError(''), 3000);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Erro ao reenviar código');
      console.error('Erro ao reenviar:', err);
    } finally {
      setResending(false);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!signUp) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorText}>
            Nenhuma verificação pendente. Por favor, faça o cadastro novamente.
          </Text>
          <Button
            title="Voltar para cadastro"
            onPress={() => router.replace('/signup')}
            style={styles.button}
          />
        </View>
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
          <Text style={styles.title}>Verificar Email</Text>
          <Text style={styles.subtitle}>
            Enviamos um código de verificação para
          </Text>
          {email ? (
            <Text style={styles.email}>{email}</Text>
          ) : null}
        </View>

        {error && !error.includes('reenviado') ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {error && error.includes('reenviado') ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <Input
            label="Código de verificação"
            placeholder="Digite o código de 6 dígitos"
            value={code}
            onChangeText={(text) => {
              // Aceitar apenas números e limitar a 6 dígitos
              const numericCode = text.replace(/[^0-9]/g, '').slice(0, 6);
              setCode(numericCode);
              setError('');
            }}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />

          <Button
            title="Verificar"
            onPress={handleVerify}
            loading={loading}
            disabled={code.length !== 6}
            style={styles.verifyButton}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Não recebeu o código?</Text>
            <Pressable
              onPress={handleResendCode}
              disabled={resending}
              style={styles.resendButton}
            >
              <Text style={[styles.resendButtonText, resending && styles.resendButtonTextDisabled]}>
                {resending ? 'Reenviando...' : 'Reenviar código'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Voltar para cadastro"
            onPress={() => router.replace('/signup')}
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
    textAlign: 'center',
  },
  form: {
    width: '100%',
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
  successContainer: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
  },
  verifyButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  resendButton: {
    padding: 8,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  resendButtonTextDisabled: {
    color: '#999999',
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
  button: {
    marginTop: 16,
  },
});

