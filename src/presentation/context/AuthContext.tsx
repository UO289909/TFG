// src/presentation/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SupabaseClient } from '../../infrastructure/database/supabaseClient';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface AuthContextProps {
  currentUser: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: true,
  signIn: async () => { },
  signInWithGoogle: async () => { },
  signUp: async () => { },
  signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  GoogleSignin.configure({
    scopes: [],
    webClientId: '844618426591-u5cr6iksscb8uta6qlf67785evubdols.apps.googleusercontent.com',
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await SupabaseClient.auth.getUser();
      setUser(user ?? null);
      setLoading(false);
    };
    checkSession();
    // Puedes añadir lógica para refrescar la sesión cada x tiempo aquí
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await SupabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
    setUser(data.user);
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    const userInfo = await GoogleSignin.signIn();
    if (userInfo.data?.idToken) {
      const { data, error } = await SupabaseClient.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo.data.idToken,
      });
      if (error) {
        console.log(error, data);
        throw error;
      }
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await SupabaseClient.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      throw error;
    }
    setUser(data.user);
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await SupabaseClient.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signIn, signInWithGoogle, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
