import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IonIcon } from '../components/icons/IonIcon';
import { CustomTheme } from '../../config/app-theme';
import { MyBooksStackNavigator } from './MyBooksStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { HomeStackNavigator } from './HomeStackNavigator';
import { useTheme } from '@react-navigation/native';

export type RootTabParams = {
    Home: undefined;
    MyBooks: undefined;
    Profile: undefined;
}

const Tab = createBottomTabNavigator();

const HomeTabBarIcon = ({ focused, color }: { focused: boolean, color: string }) => (
    <IonIcon name={focused ? 'home' : 'home-outline'} color={color} size={30} />
);

const MyBooksTabBarIcon = ({ focused, color }: { focused: boolean, color: string }) => (
    <IonIcon name={focused ? 'library' : 'library-outline'} color={color} size={30} />
);

const ProfileTabBarIcon = ({ focused, color }: { focused: boolean, color: string }) => (
    <IonIcon name={focused ? 'person' : 'person-outline'} color={color} size={30} />
);

export const BottomTabsNavigator = () => {

    const { colors } = useTheme() as CustomTheme;

    return (
        <Tab.Navigator
            id="BottomTabsNavigator"
            key={`bottom-tabs-${colors.text}`}
            screenOptions={{
                headerShown: true,
                headerTitleStyle: {
                    fontFamily: 'Roboto-Medium',
                    fontSize: 30,
                },
                headerTitleAlign: 'center',
                tabBarStyle: {
                    borderTopWidth: 0,
                    elevation: 10,
                    backgroundColor: colors.navigationBackground,
                },
                tabBarLabelStyle: {
                    fontFamily: 'Roboto-Bold',
                    fontSize: 14,
                },
                tabBarInactiveBackgroundColor: colors.navigationBackground,
                tabBarActiveBackgroundColor: colors.navigationBackground,
                tabBarActiveTintColor: colors.primary,
            }}
        >
            <Tab.Screen name="Home" options={{ title: 'Inicio', tabBarIcon: HomeTabBarIcon, popToTopOnBlur: true, headerShown: false }} component={HomeStackNavigator} />
            <Tab.Screen name="MyBooks" options={{ title: 'Mis libros', tabBarIcon: MyBooksTabBarIcon, popToTopOnBlur: true, headerShown: false }} component={MyBooksStackNavigator} />
            <Tab.Screen name="Profile" options={{ title: 'Perfil', tabBarIcon: ProfileTabBarIcon, popToTopOnBlur: true, headerShown: false }} component={ProfileStackNavigator} />
        </Tab.Navigator>
    );
};
