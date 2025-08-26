import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { globalColors } from '../../../config/app-theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export const CustomTextInput = ({ label, error, style, editable = true, ...props }: Props) => {
  const [focused, setFocused] = useState(false);

  let borderColor = globalColors.grey;
  if (error) { borderColor = globalColors.danger; }
  else if (focused) { borderColor = globalColors.primary; }

  const backgroundColor = editable ? globalColors.white : globalColors.greyLight;
  const textColor = editable ? '#000' : globalColors.greyDark;

  return (
    <View style={[styles.container, style]}>
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
        placeholderTextColor={globalColors.greyDark}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
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
