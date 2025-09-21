/* eslint-disable react-hooks/exhaustive-deps */
import { RefreshControl, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { StatsCard } from '../../components/home';
import { useBooks } from '../../hooks/useBooks';
import { FullScreenLoader } from '../../components/feedback';
import { useEffect, useState } from 'react';
import { NavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { Book } from '../../../core/entities/book.entity';
import { RootTabParams } from '../../navigation/BottomTabsNavigator';
import { RootStackParams } from '../../navigation/HomeStackNavigator';
import { CustomButton } from '../../components/pressables';
import { useRecommendations } from '../../hooks/useRecomendations';
import { RecommendationBox } from '../../components/recommendations/RecommendationsBox';
import { databaseGetReadingLogs } from '../../../infrastructure/database/books.repository';

export const HomeScreen = () => {

  const bottomTabsNavigation = useNavigation<NavigationProp<RootTabParams>>();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const { colors } = useTheme() as CustomTheme;

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const { isLoading, myBooks, refetch } = useBooks();

  const { recommendations, refetchRecommendations, loadingRecommendations } = useRecommendations();

  const [refreshing, setRefreshing] = useState(true);
  const [pagesThisMonth, setPagesThisMonth] = useState(0);
  const [lastBook, setLastBook] = useState<Book>();
  const [totalBooks, setTotalBooks] = useState(0);

  useEffect(() => {
    calculateStats();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [myBooks]);

  const calculateStats = async () => {

    setRefreshing(true);

    const now = new Date();
    const currentMonth = now.getUTCMonth();
    const currentYear = now.getUTCFullYear();

    const readingLogs = await databaseGetReadingLogs();
    const pagesReadThisMonth = readingLogs
      .filter(log => {
      const logDate = new Date(log.reading_date);
      return logDate.getUTCMonth() === currentMonth && logDate.getUTCFullYear() === currentYear;
      })
      .reduce((sum, log) => sum + (log.pages_read || 0), 0);

    const lastReadBook = myBooks
      .slice()
      .sort((a, b) => {
      const aDate = a.finish_date ? new Date(a.finish_date) : new Date(a.created_at!);
      const bDate = b.finish_date ? new Date(b.finish_date) : new Date(b.created_at!);
      return bDate.getTime() - aDate.getTime();
      })[0];

    setPagesThisMonth(pagesReadThisMonth);
    setLastBook(lastReadBook);
    setTotalBooks(myBooks.length);

    setRefreshing(false);

  };

  const handleGoToMyBooks = () => {
    bottomTabsNavigation.navigate('MyBooks');
  };

  const handleGoToBookDetails = () => {
    if (!lastBook) {
      return;
    }
    navigation.navigate('BookDetails', { book: lastBook });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await calculateStats();
    setRefreshing(false);
  };

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[colors.primary]}
    />
  );


  if (isLoading || refreshing) {
    return <FullScreenLoader />;
  }

  return (

    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={refreshControl}
    >

      {(!isLoading && !refreshing && myBooks.length === 0) &&
        <View style={styles.noStats}>
          <Text style={{ ...styles.noStatsText, color: colors.text }}>No tienes libros de los que generar estadísticas</Text>
        </View>
      }

      {myBooks.length !== 0 &&
        <>
          <View style={styles.statsRow}>
            <StatsCard
              topLabel="Has leido aprox."
              bottomLabel="páginas este mes"
              value={pagesThisMonth}
              type="small"
              landscape={isLandscape}
            />

            <StatsCard
              topLabel="Tienes"
              bottomLabel="libros en tu estantería"
              value={totalBooks}
              type="small"
              landscape={isLandscape}
              onPress={handleGoToMyBooks}
            />
          </View>

          {lastBook &&
            <StatsCard
              topLabel={lastBook.rating !== null
                ? 'El último libro que has leido es'
                : 'El último libro que has empezado es'}
              value={lastBook.title}
              type="cover"
              landscape={isLandscape}
              cover_url={lastBook.cover_url!}
              onPress={handleGoToBookDetails}
            />
          }
        </>
      }

      <View style={{ ...styles.separator, shadowColor: colors.shadow, backgroundColor: colors.card }} />

      <CustomButton
        title="Pedir 4 recomendaciones a la IA"
        onPress={refetchRecommendations}
        style={styles.button}
        disabled={loadingRecommendations || recommendations.length > 0}
      />

      {(loadingRecommendations || recommendations.length > 0) &&
        <RecommendationBox
          recommendations={recommendations}
          loading={loadingRecommendations}
        />
      }

      {/* <FriendBooks />

      <FriendBooks /> */}

    </ScrollView>

  );
};


const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  separator: {
    height: 1,
    width: '100%',
    borderRadius: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 10,
  },
  noStats: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    padding: 10,
  },
  noStatsText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Roboto-Thin',
  },
  button: {
    width: '95%',
  },
});
