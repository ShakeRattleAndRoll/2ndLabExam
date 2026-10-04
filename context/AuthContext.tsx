import { API_BASE_URL } from '@/constants/api';
import * as SecureStore from 'expo-secure-store';
import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

export type User = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
};

type AuthContextValue = {
  token: string | null;
  user: User | null;
  authLoading: boolean;
  login: (accessToken: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

const TOKEN_KEY = 'authToken';
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getUser(value: unknown): User | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  return {
    id: typeof record.id === 'string' || typeof record.id === 'number' ? record.id : undefined,
    name: typeof record.name === 'string' ? record.name : undefined,
    email: typeof record.email === 'string' ? record.email : undefined,
    role: typeof record.role === 'string' ? record.role : undefined,
  };
}

function getProfile(value: unknown): User | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  return getUser(record.user ?? record.profile ?? record.data ?? value);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const login = useCallback(async (accessToken: string, userData: User) => {
    // TODO EXAM: Save the access token with SecureStore.setItemAsync().
    const cleanToken = accessToken.trim();
    if (!cleanToken) throw new Error('The login response did not include an access token.');

    if (Platform.OS !== 'web') {
      if (!(await SecureStore.isAvailableAsync())) {
        throw new Error('Secure token storage is unavailable on this device.');
      }
      await SecureStore.setItemAsync(TOKEN_KEY, cleanToken);
    }

    // TODO EXAM: Update token state and user state with the supplied arguments.
    setToken(cleanToken);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    // TODO EXAM: Delete the saved token using SecureStore.deleteItemAsync(). 
    try {
      if (Platform.OS !== 'web' && await SecureStore.isAvailableAsync()) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.warn('Could not remove the saved session token.', error);
    } finally {
      // TODO EXAM: Clear token state and user state. 
      setToken(null);
      setUser(null);
    }
  }, []);

  const restoreSession = useCallback(async () => {
    // TODO EXAM: Set authLoading while restoring the session.
    setAuthLoading(true);
    try {
      // TODO EXAM: Read the saved token with SecureStore.getItemAsync(). 
      if (Platform.OS === 'web' || !(await SecureStore.isAvailableAsync())) return;

      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      if (!savedToken) return;

      // TODO EXAM: Restore the session by fetching the saved JSONPlaceholder user ID.
      const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(savedToken)}`, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        // TODO EXAM: Handle 401 Unauthorized / expired sessions and clear invalid credentials. 
        if (response.status === 401 || response.status === 403) {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
        return;
      }

      const profile: unknown = await response.json();
      const restoredUser = getProfile(profile);
      if (!restoredUser) return;

      // TODO EXAM: Update token and user state for a valid session.
      setToken(savedToken);
      setUser(restoredUser);
    } catch (error) {
      // TODO EXAM: Handle errors and stop authLoading in finally.
      console.warn('Could not restore the saved session.', error);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    // TODO EXAM: Call restoreSession() on startup.
    void restoreSession();
  }, [restoreSession]);

  // TODO EXAM: Check platform availability before storage calls; test persistence on Android/iOS.
  return (
    <AuthContext.Provider value={{ token, user, authLoading, login, logout, restoreSession }}>
      {children}
    </AuthContext.Provider>
  );
}
