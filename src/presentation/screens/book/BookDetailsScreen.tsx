/* eslint-disable react-native/no-inline-styles */
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { Image, Text, View } from 'react-native';

export const BookDetailsScreen = () => {
  const { params } = useRoute<RouteProp<RootStackParams, 'BookDetails'>>();
  const { book } = params;

  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
      <Image source={{ uri: book.cover }} style={{ width: 200, height: 300, borderRadius: 12, marginBottom: 20 }} />
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>{book.title}</Text>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>{book.authors.join(', ')}</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Páginas: {book.pages}</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>Publicado: {book.publishDate}</Text>
    </View>
  );
};
