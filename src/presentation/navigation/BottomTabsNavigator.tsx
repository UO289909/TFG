/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/home';
import { ProfileScreen } from '../screens/profile';
import { MyBooksScreen } from '../screens/books';
import { IonIcon } from '../components/IonIcon';
import { globalColors } from '../../config/app-theme';

const Tab = createBottomTabNavigator();

export const BottomTabsNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    elevation: 10,
                },
                headerTitleStyle: {
                    fontFamily: 'Roboto-Medium',
                    fontSize: 30,
                },
                headerTitleAlign: 'center',
                tabBarStyle: {
                    borderTopWidth: 0,
                    elevation: 10,
                },
                tabBarActiveBackgroundColor: globalColors.background,
                tabBarActiveTintColor: globalColors.primary,
            }}
        >
            <Tab.Screen name="Home" options={{ title: 'Inicio', tabBarIcon: ({ color }) => (<IonIcon name="home-outline" color={ color } size={25} />) }} component={HomeScreen} />
            <Tab.Screen name="MyBooks" options={{ title: 'Mis libros', tabBarIcon: ({ color }) => (<IonIcon name="library-outline" color={ color } size={25} />) }} component={MyBooksScreen} />
            <Tab.Screen name="Profile" options={{ title: 'Perfil', tabBarIcon: ({ color }) => (<IonIcon name="person-outline" color={ color } size={25} />) }} component={ProfileScreen} />
        </Tab.Navigator>
    );
};
