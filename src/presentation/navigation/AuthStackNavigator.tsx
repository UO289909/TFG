import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen, SignUpScreen, PasswordResetScreen } from '../screens/auth';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../config/app-theme';
import { PasswordChangeScreen } from '../screens/auth/PasswordChangeScreen';

export type RootStackParams = {
  SignIn: undefined;
  SignUp: undefined;
  PasswordReset: undefined;
  PasswordChange: { alreadySentCode: boolean, notifPosition: 'top' | 'bottom' } | undefined;
}

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const AuthTabs = () => (
  <Tab.Navigator
  id="AuthTabsNavigator"
    screenOptions={{
      tabBarLabelStyle: {
        fontFamily: 'Roboto-Light',
        fontSize: 18,
      },
    }}
  >
    <Tab.Screen name="SignIn" component={SignInScreen} options={{ title: 'Iniciar Sesión' }} />
    <Tab.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Registrarse' }} />
  </Tab.Navigator>
);

export const AuthStackNavigator = () => {

  const { colors } = useTheme() as CustomTheme;

  return (
    <Stack.Navigator
      id="AuthStackNavigator"
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          fontFamily: 'Roboto-Medium',
          fontSize: 30,
        },
        headerStyle: {
          backgroundColor: colors.navigationBackground,
        },
        headerTitleAlign: 'center',
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="AuthTabs" component={AuthTabs} options={{ title: 'Bookshelf' }} />
      <Stack.Screen name="PasswordReset" component={PasswordResetScreen} options={{ title: 'Recuperar contraseña' }} />
      <Stack.Screen name="PasswordChange" component={PasswordChangeScreen} options={{ title: 'Cambiar contraseña' }} />
    </Stack.Navigator>
  );
};
