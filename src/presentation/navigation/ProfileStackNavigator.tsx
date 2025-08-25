import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/profile';


const Stack = createNativeStackNavigator();

export const ProfileStackNavigator = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: true,
            headerTitleStyle: {
                fontFamily: 'Roboto-Medium',
                fontSize: 30,
            },
            headerTitleAlign: 'center',
        }}
    >
        <Stack.Screen name="ProfileMenu" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
);
