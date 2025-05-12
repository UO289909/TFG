import { View, Text } from 'react-native';
import { globalStyles } from '../../../config/app-theme';

export const MyBooksScreen = () => {
  return (
    <View>
        <Text style={ globalStyles.titleText }>Mis libros</Text>
    </View>
  );
};
