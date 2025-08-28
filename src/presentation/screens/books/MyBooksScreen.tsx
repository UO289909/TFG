/* eslint-disable react-hooks/exhaustive-deps */
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { BookCard } from '../../components/books/BookCard';
import { useBooks } from '../../hooks/useBooks';
import { FullScreenLoader } from '../../components/feedback/FullScreenLoader';
import { NavigationProp, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { Book } from '../../../core/entities/book.entity';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { globalColors, globalStyles } from '../../../config/app-theme';
import { useEffect, useState } from 'react';
import { SearchBar } from '../../components/inputs';
import { CustomNotification } from '../../components/feedback';
import { normalizeText } from '../../../utils/normalizeText';
import { IonIcon } from '../../components/icons';

export const MyBooksScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { params } = useRoute<RouteProp<RootStackParams, 'MyBooksList'>>();
  const doRefetch = params?.doRefetch ?? false;

  const { isLoading, myBooks, refetch } = useBooks();

  const [filteredBooks, setFilteredBooks] = useState<Book[]>(myBooks);

  const [showNotif, setShowNotif] = useState(false);
  const [notifMsg, setNotifMsg] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setFilteredBooks(myBooks);
  }, [myBooks]);

  useEffect(() => {
    if (doRefetch) {
      refetch();
      navigation.setParams({ doRefetch: false });
    }
  }, [doRefetch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleAddBook = () => {
    navigation.navigate('AddBook');
  };

  const handleBookDetails = (book: Book) => {
    navigation.navigate('BookDetails', { book });
  };

  const handleFilterBooks = (text: string) => {

    const search = normalizeText(text.trim());

    if (!search) {
      setFilteredBooks(myBooks);
      return;
    }

    const filtered = myBooks.filter(
      (book) =>
        normalizeText(book.title).includes(search) ||
        (book.author && normalizeText(book.author).includes(search))
    );

    if (filtered.length === 0) {
      setNotifMsg('No tienes libros que coincidan con la busqueda :(');
      setShowNotif(true);
      setFilteredBooks(myBooks);
      return;
    }

    setFilteredBooks(filtered);

  };

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[globalColors.primary]}
    />
  );


  return (
    <View style={styles.container}>

      {showNotif &&
        <CustomNotification
          message={notifMsg}
          position="bottom"
          onClose={() => setShowNotif(false)}
        />
      }

      <SearchBar
        onSearch={handleFilterBooks}
        placeholder="Buscar por título o autor..."
        disabled={isLoading || refreshing}
      />

      <View style={globalStyles.separator} />

      {(isLoading || refreshing) &&
        <FullScreenLoader />
      }

      {filteredBooks.length === 0 && !refreshing && !isLoading &&
        <IonIcon
          name="book"
          size={200}
          color={globalColors.greyLight}
          style={styles.bigIcon}
        />
      }

      {filteredBooks.length > 0 && !refreshing && !isLoading &&
        <ScrollView
          refreshControl={refreshControl}
        >

          {filteredBooks.map((book) => (
            <BookCard
              key={book.isbn}
              onPress={() => handleBookDetails(book)}
              title={book.title}
              author={book.author}
              pages={book.pages}
              rating={book.rating}
              imageUrl={book.cover_url}
            />
          ))}

        </ScrollView>
      }

      <FloatingButton
        onPress={handleAddBook}
        icon="add-outline"
        position="bottom-right"
        color={globalColors.primary}
        colorPressed={globalColors.primaryDark}
        disabled={isLoading || refreshing}
      />

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bigIcon: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 50,
  },
});
