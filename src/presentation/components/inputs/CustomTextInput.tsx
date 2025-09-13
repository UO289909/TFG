import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

export const CustomTextInput = ({ label, error, style, editable = true, ...props }: Props) => {

  const { colors } = useTheme() as CustomTheme;

  const [focused, setFocused] = useState(false);

  return (
    <View style={style}>
      {label && <Text style={{...styles.label, color: colors.text}}>{label}</Text>}
      <TextInput
        {...props}
        editable={editable}
        style={[
          styles.input,
          {
            borderColor: error
              ? colors.danger
              : focused
                ? colors.primary
                : colors.grey,
            backgroundColor: editable ? colors.field : colors.fieldDisabled,
            color: editable ? colors.text : colors.greyDark,
          },
        ]}
        placeholderTextColor={colors.greyDark}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error && <Text style={{...styles.error, color: colors.danger}}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontFamily: 'Roboto-Italic',
    fontSize: 16,
  },
  error: {
    marginTop: 2,
    fontSize: 12,
  },
});
