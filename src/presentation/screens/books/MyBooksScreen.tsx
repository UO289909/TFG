/* eslint-disable react-native/no-inline-styles */
import { ScrollView, View } from 'react-native';
import { BookCard } from '../../components/books/BookCard';
import { FloatingAddButton } from '../../components/pressables/FloatingAddButton';

export const MyBooksScreen = () => {

  const handleAddBook = () => {

  };

  return (
    <View style={{ flex: 1 }}>
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
      <FloatingAddButton onPress={ handleAddBook }/>
    </View>
  );
};
