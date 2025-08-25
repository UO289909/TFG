import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/home';
import { ProfileScreen } from '../screens/profile';
import { IonIcon } from '../components/icons/IonIcon';
import { globalColors } from '../../config/app-theme';
import { MyBooksStackNavigator } from './MyBooksStackNavigator';

const Tab = createBottomTabNavigator();

const HomeTabBarIcon = ({ color }: { color: string }) => (
    <IonIcon name="home-outline" color={color} size={25} />
);

const MyBooksTabBarIcon = ({ color }: { color: string }) => (
    <IonIcon name="library-outline" color={color} size={25} />
);

const ProfileTabBarIcon = ({ color }: { color: string }) => (
    <IonIcon name="person-outline" color={color} size={25} />
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
                    fontFamily: 'Roboto-Regular',
                    fontSize: 13,
                },
                tabBarActiveBackgroundColor: globalColors.background,
                tabBarActiveTintColor: globalColors.primary,
            }}
        >
            <Tab.Screen name="Home" options={{ title: 'Inicio', tabBarIcon: HomeTabBarIcon }} component={HomeScreen} />
            <Tab.Screen name="MyBooks" options={{ title: 'Mis libros', tabBarIcon: MyBooksTabBarIcon, popToTopOnBlur: true, headerShown: false }} component={MyBooksStackNavigator} />
            <Tab.Screen name="Profile" options={{ title: 'Perfil', tabBarIcon: ProfileTabBarIcon }} component={ProfileScreen} />
        </Tab.Navigator>
    );
};
