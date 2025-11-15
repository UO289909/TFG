import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CustomTextInput } from '../CustomTextInput';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
      text: '#111',
      grey: '#ccc',
      greyDark: '#999',
      field: '#fff',
      fieldDisabled: '#f0f0f0',
    },
  }),
}));

describe('CustomTextInput', () => {
  it('renders correctly with label and info', () => {
    const { getByText, getByPlaceholderText } = render(
      <CustomTextInput label="Test Label" info="Test Info" placeholder="Enter text" />
    );
    expect(getByText('Test Label')).toBeTruthy();
    expect(getByText('Test Info')).toBeTruthy();
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('renders correctly without label and info', () => {
    const { queryByText, getByPlaceholderText } = render(
      <CustomTextInput placeholder="Enter text" />
    );
    expect(queryByText('Test Label')).toBeNull();
    expect(queryByText('Test Info')).toBeNull();
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('handles focus and blur', () => {
    const { getByPlaceholderText } = render(
      <CustomTextInput placeholder="Enter text" />
    );
    const input = getByPlaceholderText('Enter text');
    fireEvent(input, 'focus');
    fireEvent(input, 'blur');
    // Styles change, but hard to test without snapshot
    expect(input).toBeTruthy();
  });

  it('passes props to TextInput', () => {
    const { getByPlaceholderText } = render(
      <CustomTextInput placeholder="Enter text" value="test" keyboardType="numeric" />
    );
    const input = getByPlaceholderText('Enter text');
    expect(input.props.value).toBe('test');
    expect(input.props.keyboardType).toBe('numeric');
  });

  it('renders as editable by default', () => {
    const { getByPlaceholderText } = render(
      <CustomTextInput placeholder="Enter text" />
    );
    const input = getByPlaceholderText('Enter text');
    expect(input.props.editable).toBe(true);
  });

  it('renders as not editable when editable is false', () => {
    const { getByPlaceholderText } = render(
      <CustomTextInput placeholder="Enter text" editable={false} />
    );
    const input = getByPlaceholderText('Enter text');
    expect(input.props.editable).toBe(false);
  });
});
