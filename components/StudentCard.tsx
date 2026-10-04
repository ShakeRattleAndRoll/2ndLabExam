import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { DirectoryUser } from '@/constants/users';

// TODO EXAM: Match these fields to the provided API response.
export type Student = DirectoryUser;

export default function StudentCard({ student }: { student: DirectoryUser }) {
    // TODO EXAM: Check that the student has an id.
    // TODO EXAM: Use Expo Router to navigate to /student/[id] with this student's id.
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{student.name}</Text>
      <Text style={styles.text}>{student.email}</Text>
      <Text style={styles.text}>Course: {student.course}</Text>
      <Link href={{ pathname: '/student/[id]', params: { id: String(student.id) } }} asChild>
        <Pressable accessibilityRole="button" style={styles.button}>
          <Text style={styles.buttonText}>View Details</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 20, borderRadius: 12, backgroundColor: '#ffffff', marginBottom: 12, gap: 8 },
  name: { color: '#17324d', fontSize: 18, fontWeight: '600' },
  text: { color: '#536579' },
  button: { paddingVertical: 12, alignSelf: 'flex-start' },
  buttonText: { color: '#245bb2', fontWeight: '600' },
});
