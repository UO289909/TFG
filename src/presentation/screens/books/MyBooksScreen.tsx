/* eslint-disable react-native/no-inline-styles */
import { ScrollView, View } from 'react-native';
import { BookCard } from '../../components/books/BookCard';
import { FloatingAddButton } from '../../components/pressables/FloatingAddButton';
import { useBooks } from '../../hooks/useBooks';
import { FullScreenLoader } from '../../components/loaders/FullScreenLoader';

export const MyBooksScreen = () => {

  const handleAddBook = () => {

  };

  const { isLoading, myBooks } = useBooks();

  if( isLoading ) {
    return <FullScreenLoader />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {myBooks.map((book) => (
          <BookCard
            title={ book.title }
            author={ book.authors[0] }
            imageUrl={ book.cover }
          />
        ))}
      </ScrollView>
      <FloatingAddButton onPress={ handleAddBook }/>
    </View>
  );
};
