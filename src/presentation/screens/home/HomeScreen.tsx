import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { StatsCard } from '../../components/home';

export const HomeScreen = () => {

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (

    <ScrollView contentContainerStyle={styles.scrollContainer}>

      <View style={styles.statsRow}>
        <StatsCard
          topLabel="Has leido un total de"
          bottomLabel="libros"
          value={5}
          type="small"
          landscape={isLandscape}
        />

        <StatsCard
          topLabel="Has leido un total de"
          bottomLabel="libros"
          value={5}
          type="small"
          landscape={isLandscape}
        />
      </View>

      <StatsCard
        topLabel="Has leido un total de"
        bottomLabel="libros"
        value={5}
        type="large"
        landscape={isLandscape}
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
});
