/* eslint-disable react-hooks/exhaustive-deps */
import { RefreshControl, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { PagesReadRanking, StatsCard } from '../../components/home';
import { FullScreenLoader } from '../../components/feedback';
import { useEffect, useState } from 'react';
import { NavigationProp, useNavigation, useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { RootTabParams } from '../../navigation/BottomTabsNavigator';
import { RootStackParams } from '../../navigation/HomeStackNavigator';
import { CustomButton } from '../../components/pressables';
import { useRecommendations } from '../../hooks/useRecomendations';
import { RecommendationBox } from '../../components/recommendations/RecommendationsBox';
import { useStats } from '../../hooks/useStats';
import { RecentReadsBox } from '../../components/home/RecentReadsBox';

export const HomeScreen = () => {

  const bottomTabsNavigation = useNavigation<NavigationProp<RootTabParams>>();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const { colors } = useTheme() as CustomTheme;

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const {
    loadingUserStats,
    loadingFriendsRecentReads,
    loadingFriendsPagesRead,
    pagesThisMonth,
    lastBook,
    totalBooks,
    friendsRecentReads,
    friendsPagesRead,
    refetchUserStats,
    refetchFriendsStats,
  } = useStats();

  const { recommendations, refetchRecommendations, loadingRecommendations } = useRecommendations();

  const [refreshing, setRefreshing] = useState(false);


  useEffect(() => {
    refetchUserStats();
    refetchFriendsStats();
  }, []);

  const handleGoToMonthLogs = () => {
    if (pagesThisMonth === 0) {
      return;
    }
    navigation.navigate('MonthLogs');
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
    await refetchUserStats();
    await refetchFriendsStats();
    setRefreshing(false);
  };

  const refreshControl = (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[colors.primary]}
    />
  );


  if (loadingUserStats || refreshing) {
    return <FullScreenLoader />;
  }

  return (

    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={refreshControl}
    >

      {(!loadingUserStats && !refreshing && totalBooks === 0) &&
        <View style={styles.noStats}>
          <Text style={{ ...styles.noStatsText, color: colors.text }}>No tienes libros de los que generar estadísticas</Text>
        </View>
      }

      {totalBooks !== 0 &&
        <>
          <View style={styles.statsRow}>
            <StatsCard
              topLabel="Has leido"
              bottomLabel="páginas este mes"
              value={pagesThisMonth}
              type="small"
              landscape={isLandscape}
              onPress={handleGoToMonthLogs}
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

      <View style={{ ...styles.separator, shadowColor: colors.shadow, backgroundColor: colors.card }} />

        <RecentReadsBox
          recentReads={friendsRecentReads}
          loading={loadingFriendsRecentReads}
          error={!loadingFriendsRecentReads && friendsRecentReads.length === 0}
        />

        <PagesReadRanking
          pagesRanking={friendsPagesRead}
          loading={loadingFriendsPagesRead}
          error={!loadingFriendsPagesRead && friendsPagesRead.length <= 1}
        />

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
