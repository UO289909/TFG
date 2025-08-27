import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { globalColors } from '../../../config/app-theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export const CustomTextInput = ({ label, error, style, editable = true, ...props }: Props) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        editable={editable}
        style={[
          styles.input,
          {
            borderColor: error
              ? globalColors.danger
              : focused
                ? globalColors.primary
                : globalColors.grey,
            backgroundColor: editable ? globalColors.white : globalColors.greyLight,
            color: editable ? globalColors.black : globalColors.greyDark,
          },
        ]}
        placeholderTextColor={globalColors.greyDark}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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
