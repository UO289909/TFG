import { Text, ScrollView } from 'react-native';
import { globalStyles } from '../../../config/app-theme';
import { BookCard } from '../../components/books/BookCard';

export const MyBooksScreen = () => {
  return (
    <ScrollView>
        <Text style={ globalStyles.titleText }>Mis libros</Text>
        <BookCard title="La sombra del viento" isbn="12345" imageUrl="https://i.stack.imgur/l60Hf.png" />
    </ScrollView>
  );
};
