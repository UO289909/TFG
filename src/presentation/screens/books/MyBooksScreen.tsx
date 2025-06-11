/* eslint-disable react-native/no-inline-styles */
import { ScrollView, View } from 'react-native';
import { BookCard } from '../../components/books/BookCard';
import { FloatingAddButton } from '../../components/pressables/FloatingAddButton';
import { useBooks } from '../../hooks/useBooks';
import { FullScreenLoader } from '../../components/loaders/FullScreenLoader';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { Book } from '../../../core/entities/book.entity';

export const MyBooksScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const handleAddBook = () => {
    navigation.navigate('AddBook');
  };

  const handleBookDetails = (book: Book) => {
    navigation.navigate('BookDetails', { book });
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
            key={ book.isbn }
            onPress={ () => handleBookDetails(book) }
            title={ book.title }
            author={ book.authors[0] }
            pages={ book.pages }
            imageUrl={ book.cover }
          />
        ))}
      </ScrollView>
      <FloatingAddButton onPress={ handleAddBook }/>
    </View>
  );
};
