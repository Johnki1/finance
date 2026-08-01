import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';
import { OfflineProvider } from '../context/OfflineContext';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const token = await authService.getStoredToken();
      if (token && isMounted) {
        // Set auth state eagerly without depending on React context ordering
        useAuthStore.setState({ token, isAuthenticated: true });
      }
      if (isMounted) setChecking(false);
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (checking || isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, checking, isLoading, segments]);

  if (checking || isLoading) {
    return null;
  }

  return (
    <OfflineProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </OfflineProvider>
  );
}
