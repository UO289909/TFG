import { NavigationProp, RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { FiveStarsInput } from '../../components/inputs/FiveStarsInput';
import { FloatingButton } from '../../components/pressables/FloatingButton';
import { CustomTheme } from '../../../config/app-theme';
import { deleteUserBook } from '../../../core/use-cases/books/delete-user-book.use-case';
import { useState } from 'react';
import { CustomNotification } from '../../components/feedback/CustomNotification';

export const BookDetailsScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { params } = useRoute<RouteProp<RootStackParams, 'BookDetails'>>();
  const { book } = params;

  const { colors } = useTheme() as CustomTheme;

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height || width >= 768;

  const [showNotif, setShowNotif] = useState(false);

  const default_cover = `https://placehold.co/400x640.webp?text=${book.title}&font=roboto`;

  const handleRateBook = (rating: number) => {
    navigation.navigate('RateBook', { book, rating });
  };

  const handleDeleteBook = async () => {
    await deleteUserBook(book.isbn);
    navigation.reset({
      index: 0,
      routes: [
        { name: 'MyBooksList', params: { doRefetch: true } },
      ],
    });
  };

  const handleEditBook = () => {
    navigation.navigate('EditBook', { book });
  };

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>

      {showNotif &&
        <CustomNotification
          message="Seguro que quieres eliminar este libro?"
          position="bottom"
          onClose={() => setShowNotif(false)}
          onAccept={handleDeleteBook}
        />
      }

      {isLandscape &&
        <Image source={{ uri: book.cover_url || default_cover }} style={styles.coverLandscape} />
      }

      <ScrollView contentContainerStyle={isLandscape ? styles.scrollContainerLandscape : styles.scrollContainer}>
        {!isLandscape &&
          <Image source={{ uri: book.cover_url || default_cover }} style={styles.cover} />
        }
        <Text style={{ ...styles.titleText, color: colors.text }}>{book.title}</Text>
        <Text style={{ ...styles.authorText, color: colors.text }}>{book.author}</Text>
        <Text style={{ ...styles.pagesText, color: colors.text }}>{book.pages} páginas</Text>
        <Text style={{ ...styles.releaseYearText, color: colors.text }}>Publicado en {book.release_year}</Text>

        <FiveStarsInput onPress={handleRateBook} value={book.rating} editable={book.rating === null} />
        <Text style={{ ...styles.datesText, color: colors.text }}>
          {book.rating !== null && book.start_date && book.finish_date
            ? `Leido entre el ${new Date(book.start_date).toLocaleDateString()} y ${new Date(book.finish_date).toLocaleDateString()}`
            : 'No has terminado este libro aún'}
        </Text>

      </ScrollView>

      <FloatingButton
        onPress={() => setShowNotif(true)}
        position={'bottom-left'}
        icon="trash-outline"
        color={colors.danger}
        colorPressed={colors.dangerDark}
      />

      <FloatingButton
        onPress={handleEditBook}
        position={'bottom-right'}
        icon="pencil-outline"
        color={colors.primary}
        colorPressed={colors.primaryDark}
      />

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLandscape: {
    flexDirection: 'row',
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
  },
  scrollContainerLandscape: {
    alignItems: 'flex-start',
    padding: 20,
  },
  cover: {
    width: 200,
    height: 320,
    borderRadius: 12,
    marginBottom: 20,
  },
  coverLandscape: {
    width: undefined,
    height: '95%',
    aspectRatio: 0.625,
    marginVertical: 5,
    marginLeft: '20%',
    borderRadius: 12,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 30,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  authorText: {
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
    marginBottom: 20,
  },
  pagesText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginBottom: 10,
  },
  releaseYearText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginBottom: 10,
  },
  datesText: {
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    marginTop: 5,
  },
});
