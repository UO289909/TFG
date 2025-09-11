import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/home';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../config/app-theme';
import { ResumeBookDetailsScreen } from '../screens/home/ResumeBookDetailsScreen';
import { Book } from '../../core/entities/book.entity';


export type RootStackParams = {
    HomeScreen: undefined;
    BookDetails: { book: Book };
}

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
            <Stack.Screen name="BookDetails" component={ResumeBookDetailsScreen} options={{ title: 'Detalles del libro' }} />
        </Stack.Navigator>
    );

};
