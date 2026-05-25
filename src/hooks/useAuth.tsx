import * as React from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { account } from '../lib/supabaseClient';
import { Models } from '@/lib/supabaseClient';

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, signOut: async () => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isGuest = localStorage.getItem('isGuest') === 'true';
    if (isGuest) {
      setUser({
        $id: 'guest-user',
        email: 'guest@tareza.local',
      } as unknown as Models.User<Models.Preferences>);
      setLoading(false);
      return;
    }

    account.get()
      .then((accountUser) => {
        setUser(accountUser);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const signOut = async () => {
    localStorage.removeItem('isGuest');
    try {
      await account.deleteSession('current');
    } catch(e) {
      console.error('Sign out error', e);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
