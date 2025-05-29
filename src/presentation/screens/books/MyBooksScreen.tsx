import { ScrollView } from 'react-native';
import { BookCard } from '../../components/books/BookCard';

export const MyBooksScreen = () => {
  return (
      <ScrollView>
        <BookCard title="La sombra del viento" author="Carlos Ruiz Zafón" imageUrl="https://i.stack.imgur/l60Hf.png" />
        <BookCard title="La sombra del viento" author="Carlos Ruiz Zafón" imageUrl="https://i.stack.imgur/l60Hf.png" />
        <BookCard title="La sombra del viento" author="Carlos Ruiz Zafón" imageUrl="https://i.stack.imgur/l60Hf.png" />
        <BookCard title="La sombra del viento" author="Carlos Ruiz Zafón" imageUrl="https://i.stack.imgur/l60Hf.png" />
        <BookCard title="La sombra del viento" author="Carlos Ruiz Zafón" imageUrl="https://i.stack.imgur/l60Hf.png" />
        <BookCard title="La sombra del viento" author="Carlos Ruiz Zafón" imageUrl="https://i.stack.imgur/l60Hf.png" />
        <BookCard title="La sombra del viento" author="Carlos Ruiz Zafón" imageUrl="https://i.stack.imgur/l60Hf.png" />
        <BookCard title="La sombra del viento" author="Carlos Ruiz Zafón" imageUrl="https://i.stack.imgur/l60Hf.png" />
      </ScrollView>
  );
};
