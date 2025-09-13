import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { CustomTheme } from '../../../config/app-theme';
import { useTheme } from '@react-navigation/native';

interface Props extends TextInputProps {
  label?: string;
  info?: string;
}

export const CustomTextInput = ({ label, info, style, editable = true, ...props }: Props) => {

  const { colors } = useTheme() as CustomTheme;

  const [focused, setFocused] = useState(false);

  return (
    <View style={style}>
      {label && <Text style={{ ...styles.label, color: colors.text }}>{label}</Text>}
      <TextInput
        {...props}
        editable={editable}
        style={[
          styles.input,
          {
            borderColor: focused
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
      {info && <Text style={{ ...styles.info, color: colors.text }}>{info}</Text>}
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
  info: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'Roboto-Light',
    textAlign: 'justify',
  },
});
