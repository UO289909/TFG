// import { useColorScheme } from 'react-native';
import { CustomLightTheme } from './config/app-theme';
import { BottomTabsNavigator } from './presentation/navigation/BottomTabsNavigator';
import { NavigationContainer } from '@react-navigation/native';

export const App = () => {

  // const scheme = useColorScheme();

  return (
    <NavigationContainer
      // theme={scheme === 'dark' ? CustomDarkTheme : CustomLightTheme}
      // theme={CustomDarkTheme}
      theme={CustomLightTheme}
    >
      <BottomTabsNavigator />
    </NavigationContainer>
  );
};
