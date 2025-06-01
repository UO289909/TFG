import { Pressable, StyleSheet } from 'react-native';
import { IonIcon } from '../icons/IonIcon';
import { globalColors } from '../../../config/app-theme';

interface Props {
  onPress: () => void;
}

export const FloatingAddButton = ({ onPress }: Props) => (
  <Pressable style={styles.button} onPress={onPress}>
    <IonIcon name="add-outline" size={ 36 } color="#fff" />
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: globalColors.primary,
    borderRadius: 15,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
