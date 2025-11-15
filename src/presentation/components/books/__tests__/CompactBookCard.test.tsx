/* eslint-disable @typescript-eslint/no-shadow */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CompactBookCard } from '../CompactBookCard';

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

describe('CompactBookCard', () => {
  const defaultProps = {
    title: 'Test Book',
    cover_url: 'https://example.com/image.jpg',
    rating: 4 as 1 | 2 | 3 | 4 | 5 | null,
    nickname: 'Test Nickname',
    onPress: jest.fn(),
  };

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<CompactBookCard {...defaultProps} />);
    expect(getByText('Test Nickname')).toBeTruthy();
    expect(getByTestId('five-stars-input')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(<CompactBookCard {...defaultProps} />);
    const pressable = getByText('Test Nickname').parent?.parent;
    expect(pressable).toBeTruthy();
    fireEvent.press(pressable!);
    expect(defaultProps.onPress).toHaveBeenCalled();
  });

  it('renders with cover_url null', () => {
    const props = { ...defaultProps, cover_url: null };
    expect(() => render(<CompactBookCard {...props} />)).not.toThrow();
  });

  it('renders with cover_url provided', () => {
    expect(() => render(<CompactBookCard {...defaultProps} />)).not.toThrow();
  });
});
