import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen, SearchUsersScreen } from '../screens/profile';

export type RootStackParams = {
    ProfileMenu: undefined;
    SearchUsers: undefined;
}

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
        <Stack.Screen name="SearchUsers" component={SearchUsersScreen} options={{ title: 'Buscar usuarios' }} />
    </Stack.Navigator>
);
