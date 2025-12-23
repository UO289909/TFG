/* eslint-disable @typescript-eslint/no-shadow */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ReadingLogMenu } from '../ReadingLogMenu';

// mock useTheme and useNavigation
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
      card: '#fff',
      text: '#111',
    },
  }),
  useNavigation: jest.fn(),
}));

// mock addReadingLog
jest.mock('../../../../core/use-cases/books/add-reading-log.use-case', () => ({
  addReadingLog: jest.fn(),
}));

// mock Animated
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  RN.Animated.parallel = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  return RN;
});

// mock CustomTextInput
jest.mock('../CustomTextInput', () => {
  const React = require('react');
  const { TextInput, Text, View } = require('react-native');
  return {
    CustomTextInput: (props: any) =>
      React.createElement(View,
        React.createElement(Text, null, props.label),
        React.createElement(TextInput, {
          testID: 'custom-text-input',
          value: props.value,
          onChangeText: props.onChangeText,
          keyboardType: props.keyboardType,
        }),
        React.createElement(Text, null, props.info)
      ),
  };
});

// mock CustomButton
jest.mock('../../pressables/CustomButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    CustomButton: (props: any) =>
      React.createElement(Pressable, {
        testID: 'custom-button',
        onPress: props.onPress,
        disabled: props.disabled,
      }, React.createElement(Text, null, props.title)),
  };
});

describe('ReadingLogMenu', () => {
  const mockNavigate = jest.fn();
  const mockReset = jest.fn();
  const mockUseNavigation = require('@react-navigation/native').useNavigation;
  const mockAddReadingLog = require('../../../../core/use-cases/books/add-reading-log.use-case').addReadingLog;

  const defaultBook = {
    isbn: '123',
    title: 'Test Book',
    pages: '200',
    current_page: '50',
    author: 'Author',
    cover_url: '',
    rating: null,
    release_year: '2020',
    review: '',
    start_date: '',
    finish_date: '',
    created_at: '',
  };

  beforeEach(() => {
    mockUseNavigation.mockReturnValue({ navigate: mockNavigate, reset: mockReset });
    mockNavigate.mockClear();
    mockReset.mockClear();
    mockAddReadingLog.mockClear();
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<ReadingLogMenu book={defaultBook} onClose={jest.fn()} />);
    expect(getByText('Ibas por la página 50 de 200')).toBeTruthy();
    expect(getByTestId('custom-button')).toBeTruthy();
  });

  it('updates newPage on input change', () => {
    const { getByTestId } = render(<ReadingLogMenu book={defaultBook} onClose={jest.fn()} />);
    const input = getByTestId('custom-text-input');
    fireEvent.changeText(input, '75');
    expect(input.props.value).toBe('75');
  });

  it('disables button when newPage is invalid', () => {
    const { getByTestId } = render(<ReadingLogMenu book={defaultBook} onClose={jest.fn()} />);
    const button = getByTestId('custom-button');
    expect(button.props.disabled).toBe(true); // initial value is 50, same as current
  });

  it('navigates to RateBook when newPage equals pages', () => {
    const { getByTestId } = render(<ReadingLogMenu book={defaultBook} onClose={jest.fn()} />);
    const input = getByTestId('custom-text-input');
    fireEvent.changeText(input, '200');
    const button = getByTestId('custom-button');
    fireEvent.press(button);
    expect(mockNavigate).toHaveBeenCalledWith('RateBook', { book: defaultBook, rating: 0 });
  });

  it('adds reading log and resets navigation when newPage is valid', () => {
    const { getByTestId } = render(<ReadingLogMenu book={defaultBook} onClose={jest.fn()} />);
    const input = getByTestId('custom-text-input');
    fireEvent.changeText(input, '100');
    const button = getByTestId('custom-button');
    fireEvent.press(button);
    expect(mockAddReadingLog).toHaveBeenCalledWith('123', '50', '100');
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'MyBooksList', params: { doRefetch: true } }],
    });
  });
});
