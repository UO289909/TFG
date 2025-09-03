import { View, ActivityIndicator, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export const FullScreenLoader = ({ style }: Props) => {

  const { colors } = useTheme() as CustomTheme;

  return (
    <View style={[styles.container, style]}>
        <ActivityIndicator size="large" color={ colors.primary } />
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
