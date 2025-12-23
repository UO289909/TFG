import { View, ActivityIndicator, StyleSheet, StyleProp, ViewStyle, Text } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';

interface Props {
  style?: StyleProp<ViewStyle>;
  message?: string;
}

export const FullScreenLoader = ({ style, message }: Props) => {

  const { colors } = useTheme() as CustomTheme;

  return (
    <View style={[styles.container, style]}>
        <ActivityIndicator size="large" color={ colors.primary } />
        {message && <Text style={{ ...styles.text, color: colors.text }}>{message}</Text>}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 25,
    fontSize: 18,
    fontFamily: 'Roboto-Medium',
  },
});
