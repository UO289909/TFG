import { BottomTabsNavigator } from './presentation/navigation/BottomTabsNavigator';
import { NavigationContainer } from '@react-navigation/native';

export const App = () => {
  return (
    <NavigationContainer>
      <BottomTabsNavigator />
    </NavigationContainer>
  );
};
