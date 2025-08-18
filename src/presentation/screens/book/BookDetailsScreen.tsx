/* eslint-disable react-native/no-inline-styles */
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { Image, Text, View } from 'react-native';
import { FiveStarsInput } from '../../components/inputs/FiveStarsInput';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { globalColors } from '../../../config/app-theme';
import { deleteUserBook } from '../../../core/use-cases/delete-user-book.use-case';

export const BookDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { params } = useRoute<RouteProp<RootStackParams, 'BookDetails'>>();
  const { book } = params;

  const default_cover = 'https://placehold.co/200x320.png?text=No+Cover';

  const handleRateBook = (rating: number) => {
    navigation.navigate('RateBook', { book, rating });
  };

  const handleDeleteBook = async () => {
    await deleteUserBook(book.isbn);
    navigation.navigate('MyBooksList');
  };

  const handleEditBook = () => {
    navigation.navigate('EditBook', { book });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
      <Image source={{ uri: book.cover_url || default_cover }} style={{ width: 200, height: 320, borderRadius: 12, marginBottom: 20 }} />
      <Text style={{ fontSize: 30, fontFamily: 'Roboto-Bold', textAlign: 'center' }}>{book.title}</Text>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>{book.author}</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>{book.pages} páginas</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Publicado en {book.release_year}</Text>

      <FiveStarsInput onPress={handleRateBook} value={book.rating} editable={book.rating === null} />

      <FloatingButton
        onPress={handleDeleteBook}
        position="bottom-left"
        icon="trash-outline"
        color={ globalColors.danger }
        colorPressed={ globalColors.dangerDark }
      />

      <FloatingButton
        onPress={handleEditBook}
        position="bottom-right"
        icon="pencil-outline"
        color={ globalColors.primary }
        colorPressed={ globalColors.primaryDark }
      />

   </View>
  );
};
