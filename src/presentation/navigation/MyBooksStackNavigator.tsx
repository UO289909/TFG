import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyBooksScreen } from '../screens/books/MyBooksScreen';
import { AddBookScreen, BookDetailsScreen } from '../screens/book';
import { Book } from '../../core/entities/book.entity';

export type RootStackParams = {
    MyBooksList: undefined;
    AddBook: undefined;
    BookDetails: { book: Book };
};

const Stack = createNativeStackNavigator();

export const MyBooksStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
        headerShown: false,
    }}
  >
    <Stack.Screen name="MyBooksList" component={MyBooksScreen} options={{ title: 'Mis libros' }} />
    <Stack.Screen name="AddBook" component={AddBookScreen} options={{ title: 'Añadir libro' }} />
    <Stack.Screen name="BookDetails" component={BookDetailsScreen} options={{ title: 'Detalles del libro' }} />
  </Stack.Navigator>
);
