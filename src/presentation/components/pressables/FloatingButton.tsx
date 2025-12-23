import { Pressable, StyleSheet } from 'react-native';
import { IonIcon, IonIconNames } from '../icons/IonIcon';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';

interface Props {
  onPress: () => void;
  icon: IonIconNames;
  shape?: 'default' | 'round';
  size?: 'large' | 'small';
  position: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left';
  color: string;
  colorPressed?: string;
  colorDisabled?: string;
  disabled?: boolean;
}

export const FloatingButton = ({
  onPress,
  icon,
  shape = 'default',
  size = 'small',
  position,
  color,
  colorPressed = color,
  colorDisabled,
  disabled = false,
}: Props) => {

  const { colors } = useTheme() as CustomTheme;

  return (
    <Pressable
      style={({ pressed }) => [
        shape === 'round'
          ? styles.roundButton
          : size === 'small'
            ? styles.button
            : styles.bigButton,
        {
          backgroundColor: disabled ? colorDisabled || colors.buttonDisabled : pressed ? colorPressed : color,
          elevation: pressed ? 4 : 8,
          ...(position === 'bottom-right' && { right: 16, bottom: 16 }),
          ...(position === 'bottom-left' && { left: 16, bottom: 16 }),
          ...(position === 'top-right' && { right: 16, top: 16 }),
          ...(position === 'top-left' && { left: 16, top: 16 }),
          ...(position === 'bottom-center' && {
            left: '50%',
            bottom: 16,
            transform: [{ translateX: shape === 'default' ? -28 : -22 }],
          }),
          shadowColor: colors.shadow,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <IonIcon name={icon} size={shape === 'default' ? 36 : 24} color="#fff" />
    </Pressable>
  );

};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    borderRadius: 15,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bigButton: {
    position: 'absolute',
    borderRadius: 18,
    width: 72,
    height: 72,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  roundButton: {
    position: 'absolute',
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
