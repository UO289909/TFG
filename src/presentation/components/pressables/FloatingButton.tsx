import { Pressable, StyleSheet } from 'react-native';
import { IonIcon, IonIconNames } from '../icons/IonIcon';
import { globalColors } from '../../../config/app-theme';

interface Props {
  onPress: () => void;
  icon: IonIconNames;
  position: 'bottom-right' | 'bottom-left';
  color: string;
  colorPressed?: string;
  colorDisabled?: string;
  disabled?: boolean;
}

export const FloatingButton = ({ onPress, icon, position, color, colorPressed = color, colorDisabled = globalColors.grey, disabled = false }: Props) => (
  <Pressable
    style={({ pressed }) => [
      styles.button,
      {
        backgroundColor: disabled ? colorDisabled : pressed ? colorPressed : color,
        elevation: pressed ? 4 : 8,
        ...(position === 'bottom-right' ? { right: 30 } : { left: 30 }),
      },
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <IonIcon name={icon} size={36} color="#fff" />
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 30,
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
