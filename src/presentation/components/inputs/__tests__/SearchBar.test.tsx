import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../SearchBar';

jest.mock('../CustomTextInput', () => {
  const { TextInput } = require('react-native');
  return {
    CustomTextInput: ({ value, onChangeText, onSubmitEditing, editable, placeholder, ...rest }: any) => (
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        editable={editable}
        placeholder={placeholder}
        testID="text-input"
        {...rest}
      />
    ),
  };
});

jest.mock('../../pressables/CustomIconButton', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    CustomIconButton: ({ icon, onPress, disabled, style }: any) => (
      <TouchableOpacity onPress={onPress} disabled={disabled} testID={`icon-${icon}`} style={style}>
        <Text>{icon}</Text>
      </TouchableOpacity>
    ),
  };
});

describe('SearchBar', () => {
  it('renders input and buttons', () => {
    const { getByTestId } = render(<SearchBar onSearch={() => {}} />);
    expect(getByTestId('text-input')).toBeTruthy();
    expect(getByTestId('icon-close')).toBeTruthy();
    expect(getByTestId('icon-search')).toBeTruthy();
  });

  it('calls onSearch with the text when pressing search', () => {
    const onSearch = jest.fn();
    const { getByTestId } = render(<SearchBar onSearch={onSearch} />);

    const input = getByTestId('text-input');
    fireEvent.changeText(input, 'React Native');
    fireEvent.press(getByTestId('icon-search'));

    expect(onSearch).toHaveBeenCalledWith('React Native');
  });

  it('clears the text and calls onSearch("") when pressing clear', () => {
    const onSearch = jest.fn();
    const { getByTestId } = render(<SearchBar onSearch={onSearch} />);

    const input = getByTestId('text-input');
    fireEvent.changeText(input, 'Book');
    fireEvent.press(getByTestId('icon-close'));

    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('filters non-numeric characters if numeric={true}', () => {
    const onSearch = jest.fn();
    const { getByTestId } = render(<SearchBar onSearch={onSearch} numeric />);

    const input = getByTestId('text-input');
    fireEvent.changeText(input, 'a1b2c3');
    fireEvent.press(getByTestId('icon-search'));

    expect(onSearch).toHaveBeenCalledWith('123');
  });

  it('displays search with submitEditing when there is text', () => {
    const onSearch = jest.fn();
    const { getByTestId } = render(<SearchBar onSearch={onSearch} />);

    const input = getByTestId('text-input');
    fireEvent.changeText(input, 'enter key');
    fireEvent(input, 'submitEditing');

    expect(onSearch).toHaveBeenCalledWith('enter key');
  });

  it('disables input and buttons if disabled={true}', () => {
    const { getByTestId } = render(<SearchBar onSearch={() => {}} disabled />);

    const input = getByTestId('text-input');
    const clearBtn = getByTestId('icon-close');
    const searchBtn = getByTestId('icon-search');

    expect(input.props.editable).toBe(false);
    expect(clearBtn.props.disabled).toBe(true);
    expect(searchBtn.props.disabled).toBe(true);
  });
});
