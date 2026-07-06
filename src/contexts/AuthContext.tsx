import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Session,
  User,
} from '@supabase/supabase-js';

import { supabase } from '../libs/supabase';

export interface Profile {
  id: string;
  nome: string;
  email: string;
  imageUrl?: string
  curso: string
  ano: string
}

type AuthContextData = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  refresh: boolean,
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext(
  {} as AuthContextData
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);

  async function loadProfile(
    userId: string
  ) {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setProfile(data);
  }

  async function refreshProfile() {
    if (!user) return;

    await loadProfile(user.id);
  }

  useEffect(() => {
    async function initialize() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadProfile(session.user.id);
      }

      setLoading(false);
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () =>
      subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        refresh,
        setRefresh,
        user,
        session,
        profile,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);