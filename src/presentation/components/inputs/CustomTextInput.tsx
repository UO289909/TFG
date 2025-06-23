/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { globalColors } from '../../../config/app-theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export const CustomTextInput = ({ label, error, style, editable = true, ...props }: Props) => {
  const [focused, setFocused] = useState(false);

  let borderColor = '#ccc';
  if (error) { borderColor = '#d32f2f'; }
  else if (focused) { borderColor = globalColors.primary; }

  // Cambia el fondo y el color del texto si no es editable
  const backgroundColor = editable ? '#faf9fd' : '#ece9f3';
  const textColor = editable ? '#222' : '#888';

  return (
    <View style={[{ marginBottom: 18 }, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        editable={editable}
        style={[
          styles.input,
          { borderColor, backgroundColor, color: textColor },
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor="#aaa"
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    backgroundColor: '#faf9fd',
    color: '#222',
  },
  error: {
    color: '#d32f2f',
    marginTop: 2,
    fontSize: 12,
  },
});
