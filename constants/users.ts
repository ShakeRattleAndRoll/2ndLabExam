import { API_BASE_URL } from '@/constants/api';

export type DirectoryUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: { name: string };
  address: { city: string; street: string };
  course: string;
};

const COURSES = [
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Data Science',
  'Cybersecurity',
];

// Seed for random course selection
export function courseForUser(id: number): string {
  const courseIndex = Math.abs(Math.imul(id, 2654435761)) % COURSES.length;
  return COURSES[courseIndex];
}

function withCourse(user: Omit<DirectoryUser, 'course'>): DirectoryUser {
  return { ...user, course: courseForUser(user.id) };
}

export async function fetchUsers(): Promise<DirectoryUser[]> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Could not load users (HTTP ${response.status}).`);
  const users: Omit<DirectoryUser, 'course'>[] = await response.json();
  return users.map(withCourse);
}

export async function fetchUser(id: number): Promise<DirectoryUser> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    headers: { Accept: 'application/json' },
  });
  if (response.status === 404) throw new Error('User not found.');
  if (!response.ok) throw new Error(`Could not load user (HTTP ${response.status}).`);
  const user: Omit<DirectoryUser, 'course'> = await response.json();
  return withCourse(user);
}
