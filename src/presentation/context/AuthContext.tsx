import React, { createContext, useContext, useEffect, useState } from 'react';
import { SupabaseClient } from '../../infrastructure/database/supabaseClient';
import { checkNicknameExists } from '../../core/use-cases/auth/check-nickname-exists.use-case';
import { AuthApiError, AuthWeakPasswordError } from '@supabase/supabase-js';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { changeNickname } from '../../core/use-cases/auth/change-nickname.use-case';

interface AuthContextProps {
  currentUser: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string, nickname: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (newPassword: string, nonce: string) => Promise<boolean>;
  changeUserNickname: (newNickname: string) => Promise<boolean>;
  sendNonceCode: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: true,
  signIn: async () => { },
  signInWithGoogle: async () => { },
  signUp: async () => { return false; },
  resetPassword: async () => { },
  changePassword: async () => { return false; },
  changeUserNickname: async () => { return false; },
  sendNonceCode: async () => { },
  signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [currentUser, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    GoogleSignin.configure({
      webClientId: '844618426591-tjrv5acfqjcj69hr8fqnu9lt793t8bm5.apps.googleusercontent.com',
      offlineAccess: true,
    });

    const init = async () => {
      try {

        const { data: { user }, error } = await SupabaseClient.auth.getUser();
        if (error || !user) {
          setUser(null);
        } else {
          setUser(user);
        }

      } catch (error) {

        setUser(null);

      } finally {

        SupabaseClient.auth.startAutoRefresh();
        setLoading(false);

      }
    };

    init();
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

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      await GoogleSignin.signOut();

      const googleUser = await GoogleSignin.signIn();
      const idToken = googleUser.data?.idToken;
      if (!idToken) {
        throw new Error('No se pudo obtener un token de Google válido');
      }

      const { accessToken } = await GoogleSignin.getTokens();
      if (!accessToken) {
        throw new Error('No se pudo obtener un token de acceso de Google válido');
      }

      const { data, error } = await SupabaseClient.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
        access_token: accessToken,
      });

      if (error) {
        throw error;
      }

      setUser(data.user);
    } catch (error) {
      throw new Error('Error al iniciar sesión con Google. Inténtalo de nuevo más tarde');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, full_name: string, nickname: string): Promise<boolean> => {
    setLoading(true);
    try {
      await checkNicknameExists(nickname);
      const { error } = await SupabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { nickname, full_name },
          emailRedirectTo: 'com.tfg://auth-callback/confirm',
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

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await SupabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: 'com.tfg://auth-callback/reset',
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error('Error al enviar el email de recuperación, revisa el correo e inténtalo de nuevo');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (newPassword: string, nonce: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await SupabaseClient.auth.updateUser({
        password: newPassword,
        nonce: nonce,
      });
      if (error) {
        throw error;
      }
      setUser(data.user);
      return true;
    } catch (error) {
      throw new Error('Error al cambiar la contraseña, inténtalo de nuevo');
    } finally {
      setLoading(false);
    }
  };

  const changeUserNickname = async (newNickname: string): Promise<boolean> => {
    setLoading(true);
    try {
      const changed = await changeNickname(newNickname);
      if (!changed) {
        throw new Error('No se pudo cambiar el nickname, inténtalo de nuevo');
      }
      return true;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendNonceCode = async () => {
    setLoading(true);
    try {
      const { error } = await SupabaseClient.auth.reauthenticate();
      if (error) {
        throw error;
      }
    } catch (error) {
      throw new Error('Error al enviar el código de verificación, inténtalo de nuevo');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    await SupabaseClient.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      signIn,
      signInWithGoogle,
      signUp,
      resetPassword,
      changePassword,
      changeUserNickname,
      sendNonceCode,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
