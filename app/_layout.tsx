import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ClerkProvider } from '@clerk/clerk-expo';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AppProvider } from '@/context/AppContext';

const PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

if (!PUBLISHABLE_KEY) {
  console.warn(
    'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY não está definida. Configure no arquivo .env'
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="verify-email" />
          <Stack.Screen name="verify-login-email" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="publish" />
          <Stack.Screen name="orders/[id]" />
          <Stack.Screen name="chat/[id]" />
          <Stack.Screen name="payment/[id]" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AppProvider>
    </ClerkProvider>
  );
}
