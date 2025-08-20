import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { globalColors } from '../../../config/app-theme';

export const FullScreenLoader = () => {
  return (
    <View style={styles.container}>
        <ActivityIndicator size="large" color={ globalColors.primary } />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
