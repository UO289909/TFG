/* eslint-disable @typescript-eslint/no-shadow */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BookCard } from '../BookCard';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
      primaryDark: '#0489A8',
      card: '#fff',
      cardPressed: '#f0f0f0',
      text: '#111',
      secondaryText: '#666',
      background: '#f5f5f5',
      shadow: '#000',
    },
  }),
}));

// mock FiveStarsInput
jest.mock('../../inputs/FiveStarsInput', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    FiveStarsInput: (props: any) =>
      React.createElement(View, { testID: 'five-stars-input' },
        React.createElement(Text, null, `Rating: ${props.value}`)
      ),
  };
});

describe('BookCard', () => {
  const defaultProps = {
    title: 'Test Book',
    author: 'Test Author',
    pages: '200',
    current_page: '50',
    rating: null as 1 | 2 | 3 | 4 | 5 | null,
    imageUrl: 'https://example.com/image.jpg',
    onPress: jest.fn(),
  };

  it('renders correctly with rating', () => {
    const props = { ...defaultProps, rating: 4 as 1 | 2 | 3 | 4 | 5 };
    const { getByText, getByTestId } = render(<BookCard {...props} />);
    expect(getByText('Test Book')).toBeTruthy();
    expect(getByText('Test Author')).toBeTruthy();
    expect(getByText('200 páginas')).toBeTruthy();
    expect(getByTestId('five-stars-input')).toBeTruthy();
  });

  it('renders correctly without rating', () => {
    const { getByText, queryByTestId } = render(<BookCard {...defaultProps} />);
    expect(getByText('Test Book')).toBeTruthy();
    expect(getByText('Test Author')).toBeTruthy();
    expect(getByText('50 / 200 páginas')).toBeTruthy();
    expect(getByText('Lectura en curso')).toBeTruthy();
    expect(queryByTestId('five-stars-input')).toBeNull();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(<BookCard {...defaultProps} />);
    const pressable = getByText('Test Book').parent?.parent;
    expect(pressable).toBeTruthy();
    fireEvent.press(pressable!);
    expect(defaultProps.onPress).toHaveBeenCalled();
  });

  it('renders with imageUrl null', () => {
    const props = { ...defaultProps, imageUrl: null };
    expect(() => render(<BookCard {...props} />)).not.toThrow();
  });

  it('renders with imageUrl provided', () => {
    expect(() => render(<BookCard {...defaultProps} />)).not.toThrow();
  });
});
