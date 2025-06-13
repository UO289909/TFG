import { Pressable, StyleSheet } from 'react-native';
import { IonIcon } from '../icons/IonIcon';
import { globalColors } from '../../../config/app-theme';

interface Props {
  onPress: () => void;
}

export const FloatingBackButton = ({ onPress }: Props) => (
  <Pressable
    style={({ pressed }) => [
      styles.button,
      {
        backgroundColor: pressed ? globalColors.primaryDark : globalColors.primary,
        elevation: pressed ? 4 : 8,
      },
    ]}
    onPress={onPress}
  >
    <IonIcon name="close-outline" size={ 36 } color="#fff" />
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    borderRadius: 15,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
