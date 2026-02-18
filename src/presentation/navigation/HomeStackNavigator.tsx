import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, ResumeBookDetailsScreen, MonthReadingLogs } from '../screens/home';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../config/app-theme';
import { Book } from '../../core/entities/book.entity';
import { FriendReadScreen } from '../screens/home/FriendReadScreen';
import { User } from '../../core/entities/user.entity';
import { FriendScreen } from '../screens/profile/FriendScreen';


export type RootStackParams = {
    HomeScreen: undefined;
    BookDetails: { book: Book };
    ReadDetails: { book: Book, user: User, userPressable: boolean };
    Friend: { friend: User, fromHome?: boolean };
    MonthLogs: undefined;
}

const Stack = createNativeStackNavigator();

export const HomeStackNavigator = () => {

    const { colors } = useTheme() as CustomTheme;

    return (
        <Stack.Navigator
            id="HomeStackNavigator"
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
            <Stack.Screen name="ReadDetails" component={FriendReadScreen} options={{ title: 'Lectura reciente' }} />
            <Stack.Screen name="Friend" component={FriendScreen} options={{ title: 'Amigo' }} />
            <Stack.Screen name="MonthLogs" component={MonthReadingLogs} options={{ title: 'Registros del mes' }} />
        </Stack.Navigator>
    );

};
