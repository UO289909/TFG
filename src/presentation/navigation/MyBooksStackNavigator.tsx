import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyBooksScreen } from '../screens/books/MyBooksScreen';
import { AddBookScreen, BookDetailsScreen, RateBookScreen, EditBookScreen, ReadingLogsScreen } from '../screens/book';
import { Book } from '../../core/entities/book.entity';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../config/app-theme';

export type RootStackParams = {
  MyBooksList: { doRefetch?: boolean };
  AddBook: undefined;
  BookDetails: { book: Book };
  RateBook: { book: Book; rating: number };
  EditBook: { book: Book };
  ReadingLogs: undefined;
}

const Stack = createNativeStackNavigator();

export const MyBooksStackNavigator = () => {

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
      <Stack.Screen name="MyBooksList" component={MyBooksScreen} options={{ title: 'Mis libros' }} />
      <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: 'Añadir libro' }} />
      <Stack.Screen name="BookDetails" component={BookDetailsScreen} options={{ title: 'Detalles del libro' }} />
      <Stack.Screen name="RateBook" component={RateBookScreen} options={{ title: 'Puntuar libro' }} />
      <Stack.Screen name="EditBook" component={EditBookScreen} options={{ title: 'Editar libro' }} />
      <Stack.Screen name="ReadingLogs" component={ReadingLogsScreen} options={{ title: 'Registros de lectura' }} />
    </Stack.Navigator>
  );

};
