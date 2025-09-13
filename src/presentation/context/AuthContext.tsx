// src/presentation/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { SupabaseClient } from '../../infrastructure/database/supabaseClient';
import { checkNicknameExists } from '../../core/use-cases/auth/check-nickname-exists.use-case';
import { AuthApiError, AuthWeakPasswordError } from '@supabase/supabase-js';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

interface AuthContextProps {
  currentUser: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, nickname: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: true,
  signIn: async () => { },
  signUp: async () => { return false; },
  signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // GoogleSignin.configure({
  //   scopes: [],
  //   webClientId: '844618426591-tjrv5acfqjcj69hr8fqnu9lt793t8bm5.apps.googleusercontent.com',
  // });

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
    try {
    const { data, error } = await SupabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
    setUser(data.user);
  } catch (error: any) {
    if (error.message === 'Email not confirmed') {
      throw new Error('Por favor, confirma tu correo electrónico antes de iniciar sesión');
    }
    if (error.message === 'Invalid login credentials') {
      throw new Error('Credenciales inválidas. Revisa tu email y contraseña');
    }
    throw error;
  } finally {
    setLoading(false);
  }
  };

  // const signInWithGoogle = async () => {
  //   const userInfo = await GoogleSignin.signIn();
  //   console.log(userInfo);
  //   if (userInfo.data?.idToken) {
  //     const { data, error } = await SupabaseClient.auth.signInWithIdToken({
  //       provider: 'google',
  //       token: userInfo.data.idToken,
  //     });
  //     if (error) {
  //       console.log(error, data);
  //       throw error;
  //     }
  //   }
  // };

  const signUp = async (email: string, password: string, full_name: string, nickname: string): Promise<boolean> => {
    setLoading(true);
    try {
      await checkNicknameExists(nickname);
      const { error } = await SupabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { nickname, full_name },
        },
      });
      if (error) {
        throw error;
      }
      return true;
    } catch (error) {
      if (error instanceof AuthWeakPasswordError) {
        throw new Error(
          'La contraseña debe tener mínimo 6 caracteres, incluyendo minúsculas, mayúsculas, números y símbolos'
        );
      }
      if (error instanceof AuthApiError) {
        throw new Error(
          'El email ya está registrado en la aplicación'
        );
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // const signUpWithGoogle = async () => {
  //   const userInfo = await GoogleSignin.signIn();
  //   if (userInfo.data?.idToken) {
  //     const { data, error } = await SupabaseClient.auth.signUp({
  //       provider: 'google',
  //       token: userInfo.data.idToken,
  //     });
  //     if (error) {
  //       console.log(error, data);
  //       throw error;
  //     }
  //   }
  // };

  const signOut = async () => {
    setLoading(true);
    await SupabaseClient.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
