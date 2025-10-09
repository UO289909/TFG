import { RouteProp, useRoute, useTheme } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/HomeStackNavigator';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { FiveStarsInput } from '../../components/inputs/FiveStarsInput';
import { CustomTheme } from '../../../config/app-theme';

export const RecentReadScreen = () => {

  const { params } = useRoute<RouteProp<RootStackParams, 'ReadDetails'>>();
  const { book, nickname } = params;

  const { colors } = useTheme() as CustomTheme;

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height || width >= 768;

  const default_cover = `https://placehold.co/400x640.webp?text=${book.title}&font=roboto`;


  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>

      {isLandscape &&
        <Image source={{ uri: book.cover_url || default_cover }} style={styles.coverLandscape} />
      }

      <ScrollView contentContainerStyle={isLandscape ? styles.scrollContainerLandscape : styles.scrollContainer}>
        {!isLandscape &&
          <Image source={{ uri: book.cover_url || default_cover }} style={styles.cover} />
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

          {book.rating !== null && (
            <FiveStarsInput onPress={() => { }} value={book.rating} editable={false} />
          )}

          {book.rating !== null && book.start_date && book.finish_date &&
            <Text style={{ ...styles.datesText, color: colors.text }}>
              {`Leido por ${nickname}\nentre el ${new Date(book.start_date).toLocaleDateString()} y ${new Date(book.finish_date).toLocaleDateString()}`}
            </Text>
          }
        </View>

      </ScrollView >

    </View >
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
    textAlign: 'center',
    marginTop: 5,
  },
});
