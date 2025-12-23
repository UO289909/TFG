import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FriendRequestsScreen, FriendsScreen, ProfileScreen, SearchUsersScreen } from '../screens/profile';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../config/app-theme';
import { PasswordChangeScreen } from '../screens/auth/PasswordChangeScreen';
import { NicknameChangeScreen } from '../screens/profile/NicknameChangeScreen';

export type RootStackParams = {
    ProfileMenu: { doRefetch?: boolean };
    Friends: undefined;
    SearchUsers: undefined;
    FriendRequests: undefined;
    PasswordChange: { alreadySentCode: boolean, notifPosition: 'top' | 'bottom' } | undefined;
    NicknameChange: undefined;
}

const Stack = createNativeStackNavigator();

export const ProfileStackNavigator = () => {

    const { colors } = useTheme() as CustomTheme;

    return (
        <Stack.Navigator
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
            <Stack.Screen name="SearchUsers" component={SearchUsersScreen} options={{ title: 'Buscar usuarios' }} />
            <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} options={{ title: 'Solicitudes de amistad' }} />
            <Stack.Screen name="PasswordChange" component={PasswordChangeScreen} options={{ title: 'Cambiar contraseña' }} />
            <Stack.Screen name="NicknameChange" component={NicknameChangeScreen} options={{ title: 'Cambiar nickname' }} />
        </Stack.Navigator>
    );

};
