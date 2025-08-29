import { View, ActivityIndicator, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { globalColors } from '../../../config/app-theme';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export const FullScreenLoader = ({ style }: Props) => {
  return (
    <View style={[styles.container, style]}>
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
