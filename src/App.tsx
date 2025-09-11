import { useColorScheme } from 'react-native';
import { CustomLightTheme } from './config/app-theme';
import { CustomDarkTheme } from './config/app-theme';
import { BottomTabsNavigator } from './presentation/navigation/BottomTabsNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { useThemeMode } from './presentation/context/ThemeContext';
import { useAuth } from './presentation/context/AuthContext';
import { FullScreenLoader } from './presentation/components/feedback';
import { AuthStackNavigator } from './presentation/navigation/AuthStackNavigator';

export const App = () => {

  const { themeMode } = useThemeMode();
  const systemScheme = useColorScheme();
  const { currentUser, loading } = useAuth();

  const theme =
    themeMode === 'light'
      ? CustomLightTheme
      : themeMode === 'dark'
        ? CustomDarkTheme
        : systemScheme === 'dark'
          ? CustomDarkTheme
          : CustomLightTheme;

  return (
    <NavigationContainer theme={theme}>
      {loading
        ? <FullScreenLoader />
        : currentUser
          ? <BottomTabsNavigator />
          : <AuthStackNavigator />}
          {/* <BottomTabsNavigator /> */}
    </NavigationContainer>
  );
};
