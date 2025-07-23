/* eslint-disable react-native/no-inline-styles */
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { Image, Text, View } from 'react-native';

export const BookDetailsScreen = () => {
  const { params } = useRoute<RouteProp<RootStackParams, 'BookDetails'>>();
  const { book } = params;

  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
      <Image source={{ uri: book.cover_url || 'https://placehold.co/200x320.png?text=No+Cover' }} style={{ width: 200, height: 320, borderRadius: 12, marginBottom: 20 }} />
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>{book.title}</Text>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>{book.author}</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Nº de páginas: {book.pages}</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Publicado en {book.release_year}</Text>
    </View>
  );
};
