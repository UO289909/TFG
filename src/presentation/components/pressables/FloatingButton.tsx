import { Pressable, StyleSheet } from 'react-native';
import { IonIcon, IonIconNames } from '../icons/IonIcon';
import { globalColors } from '../../../config/app-theme';

interface Props {
  onPress: () => void;
  icon: IonIconNames;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
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
        ...(position === 'bottom-right' || position === 'top-right'
          ? { right: 16 }
          : { left: 16 }),
        ...(position === 'top-right' || position === 'top-left'
          ? { top: 16 }
          : { bottom: 16 }),
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
    borderRadius: 15,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
