import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FriendRequestsScreen, FriendsScreen, ProfileScreen, SearchUsersScreen } from '../screens/profile';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../config/app-theme';
import { PasswordChangeScreen } from '../screens/auth/PasswordChangeScreen';
import { NicknameChangeScreen } from '../screens/profile/NicknameChangeScreen';
import { FriendScreen } from '../screens/profile/FriendScreen';
import { User } from '../../core/entities/user.entity';
import { FriendReadScreen } from '../screens/home/FriendReadScreen';
import { Book } from '../../core/entities/book.entity';
import { Changelog } from '../screens/profile/Changelog';

export type RootStackParams = {
    ProfileMenu: { doRefetch?: boolean };
    Friends: undefined;
    Friend: { friend: User, fromHome?: boolean };
    ReadDetails: { book: Book, user: User, userPressable: boolean };
    SearchUsers: undefined;
    FriendRequests: undefined;
    PasswordChange: { alreadySentCode: boolean, notifPosition: 'top' | 'bottom' } | undefined;
    NicknameChange: undefined;
    Changelog: undefined;
}

const Stack = createNativeStackNavigator();

export const ProfileStackNavigator = () => {

    const { colors } = useTheme() as CustomTheme;

    return (
        <Stack.Navigator
            id="ProfileStackNavigator"
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
            <Stack.Screen name="ProfileMenu" component={ProfileScreen} options={{ title: 'Perfil' }} />
            <Stack.Screen name="Friends" component={FriendsScreen} options={{ title: 'Amigos' }} />
            <Stack.Screen name="Friend" component={FriendScreen} options={{ title: 'Amigo' }} />
            <Stack.Screen name="ReadDetails" component={FriendReadScreen} options={{ title: 'Detalles del libro' }} />
            <Stack.Screen name="SearchUsers" component={SearchUsersScreen} options={{ title: 'Buscar usuarios' }} />
            <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} options={{ title: 'Solicitudes de amistad' }} />
            <Stack.Screen name="PasswordChange" component={PasswordChangeScreen} options={{ title: 'Cambiar contraseña' }} />
            <Stack.Screen name="NicknameChange" component={NicknameChangeScreen} options={{ title: 'Cambiar nickname' }} />
            <Stack.Screen name="Changelog" component={Changelog} options={{ title: 'Historial de versiones' }} />
        </Stack.Navigator>
    );

};
