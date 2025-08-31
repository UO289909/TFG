import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IonIcon } from '../components/icons/IonIcon';
import { globalColors } from '../../config/app-theme';
import { MyBooksStackNavigator } from './MyBooksStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { HomeStackNavigator } from './HomeStackNavigator';

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
    return (
        <Tab.Navigator
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
                },
                tabBarLabelStyle: {
                    fontFamily: 'Roboto-Bold',
                    fontSize: 14,
                },
                tabBarActiveBackgroundColor: globalColors.background,
                tabBarActiveTintColor: globalColors.primary,
            }}
        >
            <Tab.Screen name="Home" options={{ title: 'Inicio', tabBarIcon: HomeTabBarIcon, popToTopOnBlur: true, headerShown: false }} component={HomeStackNavigator} />
            <Tab.Screen name="MyBooks" options={{ title: 'Mis libros', tabBarIcon: MyBooksTabBarIcon, popToTopOnBlur: true, headerShown: false }} component={MyBooksStackNavigator} />
            <Tab.Screen name="Profile" options={{ title: 'Perfil', tabBarIcon: ProfileTabBarIcon, popToTopOnBlur: true, headerShown: false }} component={ProfileStackNavigator} />
        </Tab.Navigator>
    );
};
