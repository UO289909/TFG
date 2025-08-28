import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FriendRequestsScreen, FriendsScreen, ProfileScreen, SearchUsersScreen } from '../screens/profile';
import { Friend } from '../../core/entities/friend.entity';

export type RootStackParams = {
    ProfileMenu: undefined;
    Friends: {friendRequests: Friend[]};
    SearchUsers: undefined;
    FriendRequests: undefined;
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
        <Stack.Screen name="Friends" component={FriendsScreen} options={{ title: 'Amigos' }} />
        <Stack.Screen name="SearchUsers" component={SearchUsersScreen} options={{ title: 'Buscar usuarios' }} />
        <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} options={{ title: 'Solicitudes de amistad' }} />
    </Stack.Navigator>
);
