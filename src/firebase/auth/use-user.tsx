'use client';
import { User, onAuthStateChanged } from 'firebase/auth';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useAuth } from '../provider';

export type UserState = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<UserState | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleUser = useCallback((user: User | null) => {
    setUser(user);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false); // No auth service, so not loading.
      return;
    }

    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, handleUser);
    return () => unsubscribe();
  }, [auth, handleUser]);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = (): UserState => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
