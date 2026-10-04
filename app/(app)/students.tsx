import StudentCard from '@/components/StudentCard';
import { fetchUsers, type DirectoryUser } from '@/constants/users';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function StudentsScreen() {
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

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
  const courses = Array.from(new Set(users.map((user) => user.course)));
  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.name} ${user.username} ${user.email}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchesSearch && (!selectedCourse || user.course === selectedCourse);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <TextInput
        style={styles.input}
        accessibilityLabel="Search users by name, username, or email"
        placeholder="Search by name, username, or email"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />
      <Text style={styles.filterLabel}>Filter by course</Text>

      <ScrollView
        horizontal
        style={styles.filterScroll}
        contentContainerStyle={styles.filters}
        showsHorizontalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        {[null, ...courses].map((course) => {
          const selected = selectedCourse === course;
          return (
            <Pressable
              key={course ?? 'all-courses'}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setSelectedCourse(course)}
              style={[styles.filterChip, selected && styles.filterChipSelected]}
            >
              <Text
                style={[styles.filterText, selected && styles.filterTextSelected]}
              >
                {course ?? 'All courses'}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {loading ? (
        <View style={styles.state}><ActivityIndicator color="#245bb2" /><Text style={styles.text}>Loading users…</Text></View>
      ) : error ? (
        <View style={styles.state} accessibilityLiveRegion="polite">
          <Text style={styles.error}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={() => void loadUsers()}><Text style={styles.link}>Try Again</Text></Pressable>
        </View>
      ) : (
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
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
  filterLabel: { color: '#17324d', fontSize: 14, fontWeight: '600', marginBottom: 10 },
  filterScroll: { flexGrow: 0, marginBottom: 18 },
  filters: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 4 },
  filterChip: { flexShrink: 0, borderWidth: 1, borderColor: '#c6d2e1', borderRadius: 18, backgroundColor: '#ffffff', paddingHorizontal: 14, paddingVertical: 9, alignSelf: 'flex-start', justifyContent: 'center', alignItems: 'center' },
  filterChipSelected: { borderColor: '#245bb2', backgroundColor: '#245bb2' },
  filterText: { color: '#536579', fontSize: 13, includeFontPadding: false, textAlignVertical: 'center' },
  filterTextSelected: { color: '#ffffff', fontWeight: '600' },
  list: { flex: 1, width: '100%' },
  listContent: { flexGrow: 1, width: '100%', alignItems: 'stretch', justifyContent: 'flex-start' },
  state: { padding: 24, gap: 12, alignItems: 'center' },
  text: { color: '#536579' },
  error: { color: '#b42318' },
  link: { color: '#245bb2', padding: 12 },
});
