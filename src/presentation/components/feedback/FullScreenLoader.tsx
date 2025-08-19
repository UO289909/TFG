/* eslint-disable react-native/no-inline-styles */
import { View, ActivityIndicator } from 'react-native';
import { globalColors } from '../../../config/app-theme';

export const FullScreenLoader = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={ globalColors.primary } />
    </View>
  );
};
