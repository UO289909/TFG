/* eslint-disable react-native/no-inline-styles */
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { Image, Text, View } from 'react-native';
import { FiveStarsInput } from '../../components/inputs/FiveStarsInput';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { globalColors } from '../../../config/app-theme';

export const BookDetailsScreen = () => {
  const { params } = useRoute<RouteProp<RootStackParams, 'BookDetails'>>();
  const { book } = params;

  const handleRateBook = () => {

  }

  const handleDeleteBook = () => {

  };

  const handleEditBook = () => {

  };

  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
      <Image source={{ uri: book.cover_url || 'https://placehold.co/200x320.png?text=No+Cover' }} style={{ width: 200, height: 320, borderRadius: 12, marginBottom: 20 }} />
      <Text style={{ fontSize: 30, fontFamily: 'Roboto-Bold', textAlign: 'center' }}>{book.title}</Text>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>{book.author}</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Nº de páginas: {book.pages}</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Publicado en {book.release_year}</Text>

      <FiveStarsInput onPress={handleRateBook} />

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
