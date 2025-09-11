import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen, SignUpScreen, PasswordResetScreen } from '../screens/auth';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const AuthTabs = () => (
  <Tab.Navigator
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

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen name="AuthTabs" component={AuthTabs} options={{ title: '' }} />
      <Stack.Screen name="PasswordReset" component={PasswordResetScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
};
