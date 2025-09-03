import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/home';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../config/app-theme';


const Stack = createNativeStackNavigator();

export const HomeStackNavigator = () => {

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
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Inicio' }} />
        </Stack.Navigator>
    );

};
