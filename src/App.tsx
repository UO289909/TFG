import { Linking, useColorScheme } from 'react-native';
import { CustomLightTheme } from './config/app-theme';
import { CustomDarkTheme } from './config/app-theme';
import { BottomTabsNavigator } from './presentation/navigation/BottomTabsNavigator';
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { useThemeMode } from './presentation/context/ThemeContext';
import { useAuth } from './presentation/context/AuthContext';
import { AuthStackNavigator, RootStackParams } from './presentation/navigation/AuthStackNavigator';
import { useEffect } from 'react';
import { SupabaseClient } from './infrastructure/database/supabaseClient';

export const navigation = createNavigationContainerRef<RootStackParams>();

export const App = () => {

  const { themeMode } = useThemeMode();
  const systemScheme = useColorScheme();
  const { currentUser } = useAuth();

  const theme =
    themeMode === 'light'
      ? CustomLightTheme
      : themeMode === 'dark'
        ? CustomDarkTheme
        : systemScheme === 'dark'
          ? CustomDarkTheme
          : CustomLightTheme;

  useEffect(() => {

    const parseHashParams = (hash: string) => {
      const out = new URLSearchParams(hash.replace(/^#/, ''));
      return {
        access_token: out.get('access_token') ?? undefined,
        refresh_token: out.get('refresh_token') ?? undefined,
        type: out.get('type') ?? undefined,
        code: out.get('code') ?? out.get('token') ?? undefined,
      };
    };

    const handleUrl = async (url: string) => {
      try {
        const u = new URL(url);

        if (u.protocol !== 'com.tfg:') {
          return;
        }
        if (u.hostname !== 'auth-callback') {
          return;
        }

        const path = u.pathname.replace(/^\/+/, '');
        const q = u.searchParams;

        let access_token = q.get('access_token') ?? undefined;
        let refresh_token = q.get('refresh_token') ?? undefined;
        let type = q.get('type') ?? undefined;
        let code = q.get('code') ?? q.get('token') ?? undefined;

        if (u.hash) {
          const h = parseHashParams(u.hash);
          access_token = h.access_token ?? access_token;
          refresh_token = h.refresh_token ?? refresh_token;
          code = h.code ?? code;
          type = h.type ?? type;
        }

        if (code) {
          const { error } = await SupabaseClient.auth.exchangeCodeForSession(code);
          throw error;
        } else if (access_token && refresh_token) {
          const { error } = await SupabaseClient.auth.setSession({ access_token, refresh_token });
          throw error;
        }

        if (path === 'confirm' || type === 'signup') {
          navigation.isReady() && navigation.navigate('SignIn');
        } else if (path === 'reset' || type === 'recovery') {
          navigation.isReady() && navigation.navigate('PasswordChange');
        }
      } catch (error) {
        throw error;
      }
    };

    Linking.getInitialURL().then(async (initialUrl) => {
      if (initialUrl) {
        await handleUrl(initialUrl);
      }
    });

    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();

  }, []);


  return (
    <NavigationContainer theme={theme} ref={navigation}>
      {currentUser
        ? <BottomTabsNavigator />
        : <AuthStackNavigator />}
    </NavigationContainer>
  );
};
