import { fetchUser, type DirectoryUser } from '@/constants/users';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function UserDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<DirectoryUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUser = useCallback(async () => {
    // TODO EXAM: Validate the id read from useLocalSearchParams().
    // TODO EXAM: Set loading and clear previous errors.
    // TODO EXAM: GET /students/{id} with fetch(), async/await, and a Bearer token.
    // TODO EXAM: Check response.ok; handle 401 Unauthorized and missing records.
    // TODO EXAM: Parse JSON and update student state.
    // TODO EXAM: Handle errors and stop loading in finally.
    const userId = Number(id);
    if (!id || !Number.isInteger(userId) || userId < 1) {
      setUser(null);
      setError('Invalid user ID.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      setUser(await fetchUser(userId));
    } catch (loadError) {
      setUser(null);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load user.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // TODO EXAM: Call loadStudent() when id changes.
    void loadUser();
  }, [loadUser]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Details</Text>
      {loading ? (
        <View style={styles.state}><ActivityIndicator color="#245bb2" /><Text style={styles.text}>Loading student</Text></View>
      ) : error ? (
        <View style={styles.state} accessibilityLiveRegion="polite"><Text style={styles.error}>{error}</Text></View>
      ) : user ? (
        <View style={styles.card}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.text}>User ID: {user.id}</Text>
          <Text style={styles.text}>Username: {user.username}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>Phone: {user.phone}</Text>
          <Text style={styles.text}>Website: {user.website}</Text>
          <Text style={styles.text}>Company: {user.company.name}</Text>
          <Text style={styles.text}>Address: {user.address.street}, {user.address.city}</Text>
          <View style={styles.courseBox}>
            <Text style={styles.courseLabel}>ASSIGNED COURSE</Text>
            <Text style={styles.course}>{user.course}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.text}>No student record available.</Text>
      )}
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => router.back()}><Text style={styles.buttonText}>Back</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 20, backgroundColor: '#f2f5fa' },
  title: { color: '#17324d', fontSize: 28, fontWeight: '700' },
  state: { gap: 12, alignItems: 'center' },
  card: { backgroundColor: '#ffffff', padding: 20, gap: 16, borderRadius: 12 },
  name: { color: '#17324d', fontSize: 22, fontWeight: '700' },
  text: { color: '#536579', fontSize: 16 },
  courseBox: { backgroundColor: '#edf3ff', padding: 16, borderRadius: 8, gap: 6 },
  courseLabel: { color: '#245bb2', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  course: { color: '#17324d', fontSize: 18, fontWeight: '600' },
  error: { color: '#b42318' },
  button: { backgroundColor: '#245bb2', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
