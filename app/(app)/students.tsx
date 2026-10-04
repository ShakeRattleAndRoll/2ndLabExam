import StudentCard from '@/components/StudentCard';
import { fetchUsers, type DirectoryUser } from '@/constants/users';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function StudentsScreen() {
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadUsers = useCallback(async () => {
    // TODO EXAM: 1. Set loading and clear previous errors.
    // TODO EXAM: 2. Call GET /students using fetch() and async/await.
    // TODO EXAM: 3. Include Authorization: Bearer TOKEN from useAuth() if required.
    // TODO EXAM: 4. Check response.ok and handle 401 Unauthorized.
    // TODO EXAM: 5. Parse JSON and save the student array to state.
    // TODO EXAM: 6. Handle errors and stop loading inside finally.
    setLoading(true);
    setError('');
    try {
      setUsers(await fetchUsers());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // TODO EXAM: Call loadStudents() when the screen loads.
    void loadUsers();
  }, [loadUsers]);

  // TODO EXAM: Use filter() to return students whose name matches the search text.
  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.username} ${user.email}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <TextInput
        style={styles.input}
        accessibilityLabel="Search users"
        placeholder="Search by name, username, or email"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />
      {loading ? (
        <View style={styles.state}><ActivityIndicator color="#245bb2" /><Text style={styles.text}>Loading users…</Text></View>
      ) : error ? (
        <View style={styles.state} accessibilityLiveRegion="polite">
          <Text style={styles.error}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => void loadUsers()}><Text style={styles.link}>Try Again</Text></Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <StudentCard student={item} />}
          ListEmptyComponent={<View style={styles.state}><Text style={styles.text}>No users found.</Text></View>}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f2f5fa' },
  title: { fontSize: 28, fontWeight: '700', color: '#17324d', marginBottom: 20 },
  input: { padding: 14, borderWidth: 1, borderColor: '#c6d2e1', borderRadius: 8, backgroundColor: '#ffffff', color: '#17324d', marginBottom: 20 },
  state: { padding: 24, gap: 12, alignItems: 'center' },
  text: { color: '#536579' },
  error: { color: '#b42318' },
  link: { color: '#245bb2', padding: 12 },
});
