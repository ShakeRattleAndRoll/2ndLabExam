import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { fetchUser, type DirectoryUser } from '@/constants/users';

export default function ProfileScreen() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState<DirectoryUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // TODO EXAM: Load GET /profile with fetch(), async/await, and the Bearer token.
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    const userId = user?.id ?? token;
    const numericUserId = Number(userId);
    if (userId === undefined || userId === null || String(userId).trim() === '' || !Number.isInteger(numericUserId) || numericUserId < 1) {
      setProfile(null);
      setError('No signed-in user is available to load a profile.');
      setLoading(false);
      return;
    }

    try {
      // JSONPlaceholder exposes profiles as /users/{id}, not /profile.
      setProfile(await fetchUser(numericUserId));
    } catch (loadError) {
      setProfile(null);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load profile.');
    } finally {
      setLoading(false);
    }
  }, [token, user?.id]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  // TODO EXAM: Check response.ok, handle 401 Unauthorized, and display returned profile data.
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MY PROFILE</Text>
      {loading ? (
        <View style={styles.state}><ActivityIndicator color="#245bb2" /><Text style={styles.text}>Loading profile…</Text></View>
      ) : error ? (
        <View style={styles.state} accessibilityLiveRegion="polite">
          <Text style={styles.error}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => void loadProfile()}><Text style={styles.link}>Try Again</Text></Pressable>
        </View>
      ) : profile ? (
        <View style={styles.card}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.text}>Username: {profile.username}</Text>
          <Text style={styles.text}>Email: {profile.email}</Text>
          <Text style={styles.text}>Phone: {profile.phone}</Text>
          <Text style={styles.text}>Website: {profile.website}</Text>
          <Text style={styles.text}>Company: {profile.company.name}</Text>
          <Text style={styles.text}>Address: {profile.address.street}, {profile.address.city}</Text>
        </View>
      ) : (
        <Text style={styles.text}>No profile available.</Text>
      )}
      <Text style={styles.text}>Session Status: {token ? 'Authenticated' : 'Not Available'}</Text>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => void logout()}><Text style={styles.buttonText}>LOGOUT</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20, backgroundColor: '#f2f5fa' },
  title: { color: '#17324d', fontSize: 24, fontWeight: '700' },
  card: { backgroundColor: '#ffffff', padding: 20, gap: 16, borderRadius: 12 },
  name: { color: '#17324d', fontSize: 22, fontWeight: '700' },
  text: { color: '#536579', fontSize: 16 },
  state: { padding: 24, gap: 12, alignItems: 'center' },
  error: { color: '#b42318' },
  link: { color: '#245bb2', padding: 12 },
  button: { backgroundColor: '#245bb2', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
