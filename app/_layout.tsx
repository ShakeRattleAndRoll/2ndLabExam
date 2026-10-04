import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  // TODO EXAM: Check authentication state and wait for session restoration. 
  // TODO EXAM: Protect (app) AND student/[id]; redirect unauthenticated users to /sign-in. 
  return (
    <AuthProvider>
      <AuthNavigation />
    </AuthProvider>
  );
}

function AuthNavigation() {
  const router = useRouter();
  const { token, authLoading } = useAuth();
  const segments = useSegments();
  const onSignIn = segments[0] === 'sign-in';
  const inProtectedRoute = segments[0] === '(app)' || segments[0] === 'student';

  useEffect(() => {
    if (authLoading) return;
    if (!token && inProtectedRoute) router.replace('/sign-in');
    else if (token && onSignIn) router.replace('/(app)');
  }, [authLoading, inProtectedRoute, onSignIn, router, token]);

  return (
    <Stack screenOptions={{ headerTintColor: '#17324d' }}>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="student/[id]" options={{ title: 'Student Details' }} />
    </Stack>
  );
}
