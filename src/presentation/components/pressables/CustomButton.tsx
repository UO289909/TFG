import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { globalColors } from '../../../config/app-theme';

interface Props {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const CustomButton = ({ title, onPress, style, disabled }: Props) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      styles.button,
      {
        backgroundColor: disabled
          ? globalColors.grey
          : pressed
            ? globalColors.primaryDark
            : globalColors.primary,
        elevation: pressed ? 4 : 8,
      },
      style,
    ]}
  >
    <Text style={styles.text}>{title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginVertical: 8,
  },
  text: {
    color: '#fff',
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
