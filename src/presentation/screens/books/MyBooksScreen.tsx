/* eslint-disable react-hooks/exhaustive-deps */
import { FlatList, RefreshControl, StyleSheet, useWindowDimensions, View } from 'react-native';
import { BookCard } from '../../components/books/BookCard';
import { useBooks } from '../../hooks/useBooks';
import { FullScreenLoader } from '../../components/feedback/FullScreenLoader';
import { NavigationProp, useNavigation, useRoute, RouteProp, useTheme } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { Book } from '../../../core/entities/book.entity';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { CustomTheme } from '../../../config/app-theme';
import { useEffect, useState } from 'react';
import { SearchBar } from '../../components/inputs';
import { CustomNotification } from '../../components/feedback';
import { normalizeText } from '../../../utils/normalizeText';
import { IonIcon } from '../../components/icons';

export const MyBooksScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { params } = useRoute<RouteProp<RootStackParams, 'MyBooksList'>>();
  const doRefetch = params?.doRefetch ?? false;

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height || width >= 768;

  const { colors } = useTheme() as CustomTheme;

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
      setNotifMsg('No tienes libros que coincidan con la busqueda');
      setShowNotif(true);
      setFilteredBooks(myBooks);
      return;
    }

    setFilteredBooks(filtered);

  };

  const renderBookCard = ({ item }: { item: Book }) => (
    <BookCard
      onPress={() => handleBookDetails(item)}
      title={item.title}
      author={item.author}
      pages={item.pages}
      current_page={item.current_page}
      rating={item.rating}
      imageUrl={item.cover_url}
      style={isLandscape ? styles.bookCardLandscape : undefined}
    />
  );

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[colors.primary]}
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

      <View style={{ ...styles.separator, shadowColor: colors.shadow }} />

      {(isLoading || refreshing) &&
        <FullScreenLoader />
      }

      {filteredBooks.length === 0 && !refreshing && !isLoading &&
        <IonIcon
          name="book"
          size={200}
          color={colors.greyLight}
          style={styles.bigIcon}
        />
      }

      {filteredBooks.length > 0 && !refreshing && !isLoading &&

        <FlatList
          data={filteredBooks}
          key={isLandscape ? 'h' : 'v'}
          renderItem={renderBookCard}
          keyExtractor={book => book.isbn}
          numColumns={isLandscape ? 2 : 1}
          refreshControl={refreshControl}
          contentContainerStyle={styles.scrollContainer}
        />

      }

      <FloatingButton
        onPress={handleAddBook}
        icon="add-outline"
        position="bottom-right"
        color={colors.primary}
        colorPressed={colors.primaryDark}
        disabled={isLoading || refreshing}
      />

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    borderRadius: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  bigIcon: {
    flex: 1,
    alignSelf: 'center',
    marginTop: 50,
  },
  bookCardLandscape: {
    flex: 1,
    margin: 8,
  },
});
