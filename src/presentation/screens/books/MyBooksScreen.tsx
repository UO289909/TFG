/* eslint-disable react-native/no-inline-styles */
import { ScrollView, View } from 'react-native';
import { BookCard } from '../../components/books/BookCard';
import { FloatingAddButton } from '../../components/pressables/FloatingAddButton';
import { signIn } from '../../../infrastructure/database/auth.repository';
import { useEffect } from 'react';
import { getMyBooks } from '../../../core/use-cases/get-my-books.use-case';
import { OpenLibraryAdapter } from '../../../config/adapters/openLibrary.adapter';

export const MyBooksScreen = () => {

  useEffect(() => {

    signIn( 'dev@test.es', 'test' );

    getMyBooks(OpenLibraryAdapter);

  }, []);

  const handleAddBook = () => {

    signIn( 'dev@test.es', 'test' );

    getMyBooks(OpenLibraryAdapter);

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
