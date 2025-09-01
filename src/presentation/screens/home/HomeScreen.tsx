import { ScrollView, StyleSheet, View } from 'react-native';
import { BookStatsCard } from '../../components/home/StatsCard';

export const HomeScreen = () => {

  return (

    <ScrollView contentContainerStyle={styles.scrollContainer}>

      <View style={styles.statsRow}>
        <BookStatsCard
          topLabel="Has leido un total de"
          bottomLabel="libros"
          value={5}
          type="small"
        />

        <BookStatsCard
          topLabel="Has leido un total de"
          bottomLabel="libros"
          value={5}
          type="small"
        />
      </View>

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
});
