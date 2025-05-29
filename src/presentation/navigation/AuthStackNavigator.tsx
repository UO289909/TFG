import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogInScreen, SignUpScreen } from '../screens/auth';
import { PasswordResetScreen } from '../screens/auth/PasswordResetScreen';

const Stack = createNativeStackNavigator();

export const AuthStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
    </Stack.Navigator>
  );
};
