/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { globalColors } from '../../../config/app-theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export const CustomTextInput = ({ label, error, style, ...props }: Props) => {
  const [focused, setFocused] = useState(false);

  let borderColor = '#ccc';
  if (error) { borderColor = '#d32f2f'; }
  else if (focused) { borderColor = globalColors.primary; }

  return (
    <View style={{ marginBottom: 18 }}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        style={[
          styles.input,
          { borderColor },
          style,
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
  label: { fontWeight: 'bold', marginBottom: 4, color: '#333' },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#faf9fd',
    color: '#222',
  },
  error: { color: '#d32f2f', marginTop: 2, fontSize: 12 },
});
