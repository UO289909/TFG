import { NavigationProp, RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/MyBooksStackNavigator';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { FiveStarsInput } from '../../components/inputs/FiveStarsInput';
import { CustomTheme } from '../../../config/app-theme';
import { deleteUserBook } from '../../../core/use-cases/books/delete-user-book.use-case';
import { useState } from 'react';
import { CustomNotification } from '../../components/feedback/CustomNotification';
import { CustomButton } from '../../components/pressables';
import { ReadingLogMenu } from '../../components/inputs/ReadingLogMenu';
import { FullScreenLoader } from '../../components/feedback';

export const BookDetailsScreen = () => {

  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const { params } = useRoute<RouteProp<RootStackParams, 'BookDetails'>>();
  const { book } = params;

  const { colors } = useTheme() as CustomTheme;

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height || width >= 768;

  const [showNotif, setShowNotif] = useState(false);
  const [showReadLog, setShowReadLog] = useState(false);
  const [deletingBook, setDeletingBook] = useState(false);

  const default_cover = `https://placehold.co/400x640.webp?text=${book.title}&font=roboto`;

  const handleRateBook = (rating: number) => {
    navigation.navigate('RateBook', { book, rating });
  };

  const handleDeleteBook = async () => {
    setDeletingBook(true);
    await deleteUserBook(book.isbn);
    setDeletingBook(false);
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


  if (deletingBook) {
    return <FullScreenLoader message="Eliminando libro..." />;
  }

  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>

      {showReadLog &&
        <ReadingLogMenu
          book={book}
          onClose={() => setShowReadLog(false)}
        />
      }

      {showNotif &&
        <CustomNotification
          message="Seguro que quieres eliminar este libro?"
          position="bottom"
          onClose={() => setShowNotif(false)}
          onAccept={handleDeleteBook}
        />
      }

      {isLandscape &&
        <Image source={{ uri: book.cover_url || default_cover }} style={{ ...styles.coverLandscape, shadowColor: colors.shadow }} />
      }

      <ScrollView contentContainerStyle={isLandscape ? styles.scrollContainerLandscape : styles.scrollContainer}>
        {!isLandscape &&
          <Image source={{ uri: book.cover_url || default_cover }} style={{ ...styles.cover, shadowColor: colors.shadow }} />
        }

        <View style={[
          isLandscape ? styles.infoContainerLandscape : styles.infoContainer,
          {
            backgroundColor: colors.card,
            shadowColor: colors.shadow,
          },
        ]}>
          <Text style={{ ...styles.titleText, color: colors.text }}>{book.title}</Text>
          <Text style={{ ...styles.authorText, color: colors.text }}>{book.author}</Text>
          <Text style={{ ...styles.pagesText, color: colors.text }}>{!book.rating && `${book.current_page} / `}{book.pages} páginas</Text>
          <Text style={{ ...styles.releaseYearText, color: colors.text }}>Publicado en {book.release_year}</Text>

          {book.rating !== null && book.start_date && book.finish_date &&
            <Text style={{ ...styles.datesText, color: colors.text }}>
              Leido entre el {new Date(book.start_date).toLocaleDateString()} y {new Date(book.finish_date).toLocaleDateString()}
            </Text>
          }
        </View>

        {book.rating !== null &&
          <View style={[
            isLandscape ? styles.infoContainerLandscape : styles.infoContainer,
            styles.reviewContainer,
            {
              backgroundColor: colors.card,
              shadowColor: colors.shadow,
            },
          ]}>
            <Text style={{ ...styles.reviewTitle, color: colors.text }}>Reseña</Text>

            {book.review &&
              <Text style={{ ...styles.reviewText, color: colors.text }}>{book.review}</Text>
            }

            <FiveStarsInput onPress={handleRateBook} value={book.rating} editable={book.rating === null} />
          </View>
        }

        <View style={isLandscape ? styles.buttonsContainerLandscape : styles.buttonsContainer}>

          {book.rating === null &&
            <CustomButton
              title="Registrar lectura diaria"
              onPress={() => setShowReadLog(true)}
              style={styles.largeButton}
            />
          }

          <View style={styles.buttonRow}>
            <CustomButton
              title="Eliminar libro"
              onPress={() => setShowNotif(true)}
              style={{ ...styles.button, backgroundColor: colors.danger }}
            />
            <CustomButton
              title="Editar libro"
              onPress={handleEditBook}
              style={styles.button}
            />
          </View>
        </View>

      </ScrollView>

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
  infoContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    alignSelf: 'center',
    padding: 12,
    elevation: 4,
  },
  infoContainerLandscape: {
    alignItems: 'center',
    flexDirection: 'column',
    width: '70%',
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    padding: 12,
    elevation: 4,
  },
  reviewContainer: {
    marginTop: 10,
  },
  cover: {
    width: 200,
    height: 320,
    borderRadius: 10,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  coverLandscape: {
    width: undefined,
    height: '95%',
    aspectRatio: 0.625,
    marginVertical: 5,
    marginLeft: '20%',
    borderRadius: 10,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
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
  reviewTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 16,
    fontFamily: 'Roboto-Italic',
    textAlign: 'justify',
    marginBottom: 6,
  },
  buttonsContainer: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 6,
  },
  buttonsContainerLandscape: {
    flexDirection: 'column',
    width: '70%',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    width: '45%',
  },
  largeButton: {
    width: '95%',
  },
});
