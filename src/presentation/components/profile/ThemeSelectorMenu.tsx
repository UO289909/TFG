import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { CustomMenuButton } from '../pressables/CustomMenuButton';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../../../config/app-theme';
import { useThemeMode } from '../../context/ThemeContext';

interface Props {
  onClose: () => void;
}

export const ThemeSelectorMenu = ({ onClose }: Props) => {
  const { colors } = useTheme() as CustomTheme;
  const { themeMode, setThemeMode } = useThemeMode();

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const handleSelect = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.overlayBg} onPress={onClose} />
      <Animated.View
        style={[
          styles.menuContainer,
          {
            backgroundColor: colors.card,
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <CustomMenuButton
          label="Tema claro"
          icon="sunny"
          onPress={() => handleSelect('light')}
          style={styles.button}
          disabled={themeMode === 'light'}
        />
        <CustomMenuButton
          label="Tema oscuro"
          icon="moon"
          onPress={() => handleSelect('dark')}
          style={styles.button}
          disabled={themeMode === 'dark'}
        />
        <CustomMenuButton
          label="Según sistema"
          icon="phone-portrait"
          onPress={() => handleSelect('system')}
          style={styles.button}
          disabled={themeMode === 'system'}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menuContainer: {
    borderRadius: 12,
    padding: 16,
    elevation: 10,
    width: 240,
    height: 240,
    alignItems: 'center',
  },
  button: {
    width: 200,
    marginVertical: 6,
  },
});
