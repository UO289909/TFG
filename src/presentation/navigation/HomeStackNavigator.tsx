import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/home';


const Stack = createNativeStackNavigator();

export const HomeStackNavigator = () => (
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
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Inicio' }} />
    </Stack.Navigator>
);
