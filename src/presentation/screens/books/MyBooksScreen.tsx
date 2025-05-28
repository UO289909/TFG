import { Text, ScrollView } from 'react-native';
import { globalStyles } from '../../../config/app-theme';
import { BookCard } from '../../components/books/BookCard';

export const MyBooksScreen = () => {
  return (
    <ScrollView>
        <Text style={ globalStyles.titleText }>Mis libros</Text>
        <BookCard isbn="12345" />
    </ScrollView>
  );
};
