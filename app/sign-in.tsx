import { API_BASE_URL } from '@/constants/api';
import type { User } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseUser(value: unknown, email: string): User {
  if (!isRecord(value)) return { email };
  return {
    id: typeof value.id === 'string' || typeof value.id === 'number' ? value.id : undefined,
    name: typeof value.name === 'string' ? value.name : undefined,
    email: typeof value.email === 'string' ? value.email : email,
    role: typeof value.role === 'string' ? value.role : undefined,
  };
}

export default function SignInScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // TODO EXAM: 1. Validate email and password. 
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError('Enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    // TODO EXAM: 2. Set loading and clear previous errors.
    setLoading(true);
    setError('');
    try {
      // TODO EXAM: 3. POST to /login using fetch() and async/await. 
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: { Accept: 'application/json' },
      });
      const body: unknown = await response.json().catch(() => null);

      // TODO EXAM: 4. Check response.ok and parse the returned JSON.
      if (!response.ok) {
        throw new Error('Could not load the demo users. Check your connection and try again.');
      }

      if (!Array.isArray(body)) {
        throw new Error('The user list response was not in the expected format.');
      }
      const matchedUser = body.find((item) =>
        isRecord(item) && typeof item.email === 'string' && item.email.toLowerCase() === normalizedEmail.toLowerCase(),
      );
      if (!isRecord(matchedUser) || (typeof matchedUser.id !== 'string' && typeof matchedUser.id !== 'number')) {
        throw new Error('Email not found. Try Sincere@april.biz.');
      }

      const loggedInUser = parseUser(matchedUser, normalizedEmail);
      // TODO EXAM: 5. Pass the returned access token and user to the context login(). 
      await login(String(matchedUser.id), loggedInUser);
      // TODO EXAM: 6. Navigate using router.replace() after successful authentication.
      router.replace('/(app)');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not sign in. Check your connection and try again.');
    } finally {
      // TODO EXAM: 7. Handle login errors and stop loading in finally.
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.eyebrow}>CCE106 • PRACTICAL EXAMINATION</Text>
        <Text style={styles.title}>Student Service Portal</Text>
        <Text style={styles.subtitle}>Sign in to access student services.</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} accessibilityLabel="Email" placeholder="sincere@april.biz" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"
          autoCorrect={false} editable={!loading} onSubmitEditing={() => void handleLogin()} returnKeyType="go"
        />
        <View style={styles.feedback} accessibilityLiveRegion="polite">
          {loading && <ActivityIndicator color="#245bb2" accessibilityLabel="Signing in" />}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <Pressable accessibilityRole="button" style={styles.button} onPress={() => void handleLogin()} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in…' : 'Login'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f2f5fa' },
  card: { width: '100%', maxWidth: 440, alignSelf: 'center', padding: 24, borderRadius: 16, backgroundColor: '#ffffff' },
  eyebrow: { fontSize: 11, fontWeight: '700', color: '#245bb2', marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', color: '#17324d' },
  subtitle: { color: '#536579', marginTop: 8, marginBottom: 24 },
  label: { color: '#17324d', fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#c6d2e1', borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 16, color: '#17324d' },
  feedback: { minHeight: 28, justifyContent: 'center' },
  error: { color: '#b42318' },
  button: { backgroundColor: '#245bb2', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '700' },
});
