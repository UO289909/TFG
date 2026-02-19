import { NavigationProp, RouteProp, useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { RootStackParams } from '../../navigation/HomeStackNavigator';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { FiveStarsInput } from '../../components/inputs/FiveStarsInput';
import { CustomTheme } from '../../../config/app-theme';
import { MiniUserCard } from '../../components/profile/MiniUserCard';

export const FriendReadScreen = () => {

  const { params } = useRoute<RouteProp<RootStackParams, 'ReadDetails'>>();
  const { book, user, userPressable } = params;

  const navigation = useNavigation<any>();
  const { colors } = useTheme() as CustomTheme;

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height || width >= 768;

  const default_cover = `https://placehold.co/400x640.webp?text=${book.title}&font=roboto`;

  const handleNavigateToUser = () => {
    navigation.navigate('Friend', { friend: user, fromHome: true });
  };


  return (
    <View style={[styles.container, isLandscape && styles.containerLandscape]}>

      {isLandscape &&
        <View style={styles.coverContainerLandscape}>
          <Image source={{ uri: book.cover_url || default_cover }} style={styles.coverLandscape} />
        </View>
      }

      <ScrollView contentContainerStyle={isLandscape ? styles.scrollContainerLandscape : styles.scrollContainer}>
        {!isLandscape &&
          <View style={styles.coverContainer}>
            <Image source={{ uri: book.cover_url || default_cover }} style={styles.cover} />
            <MiniUserCard
              nickname={user.nickname}
              avatarUrl={user.avatarUrl}
              onPress={userPressable ? handleNavigateToUser : undefined}
              style={({ pressed }) => [
                styles.floatingUserCard,
                { opacity: pressed && userPressable ? 0.6 : 0.8 },
              ]}
            />
          </View>
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

          {isLandscape &&
            <MiniUserCard
              nickname={user.nickname}
              avatarUrl={user.avatarUrl}
              onPress={userPressable ? handleNavigateToUser : undefined}
              style={({ pressed }) => [
                styles.floatingUserCardLandscape,
                { backgroundColor: pressed && userPressable ? colors.cardPressed : colors.card },
              ]}
            />
          }

          <Text style={{ ...styles.pagesText, color: colors.text }}>{!book.rating && `${book.current_page} / `}{book.pages} páginas</Text>
          <Text style={{ ...styles.releaseYearText, color: colors.text }}>Publicado en {book.release_year}</Text>


          {book.rating !== null && book.start_date && book.finish_date &&
            <Text style={{ ...styles.datesText, color: colors.text }}>
              {book.start_date === book.finish_date ?
                `Leído el ${new Date(book.start_date).toLocaleDateString()}` :
                `Leído entre el ${new Date(book.start_date).toLocaleDateString()} y el ${new Date(book.finish_date).toLocaleDateString()}`
              }
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

            <FiveStarsInput onPress={() => { }} value={book.rating} editable={false} />
          </View>
        }

      </ScrollView >

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

  userName: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    marginLeft: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 10,
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
  coverContainer: {
    position: 'relative',
    marginBottom: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cover: {
    width: 200,
    height: 320,
    borderRadius: 10,
  },
  floatingUserCard: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
    alignSelf: 'center',
    zIndex: 10,
    opacity: 0.8,
  },
  coverContainerLandscape: {
    position: 'relative',
    height: '95%',
    aspectRatio: 0.625,
    marginVertical: 5,
    marginLeft: '20%',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  coverLandscape: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  floatingUserCardLandscape: {
    alignSelf: 'center',
    marginBottom: 10,
    zIndex: 10,
  },
  titleText: {
    fontSize: 30,
    fontFamily: 'Roboto-Bold',
    textAlign: 'center',
  },
  authorText: {
    fontSize: 20,
    fontFamily: 'Roboto-Medium',
    marginBottom: 10,
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
  reviewContainer: {
    marginTop: 10,
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
});
