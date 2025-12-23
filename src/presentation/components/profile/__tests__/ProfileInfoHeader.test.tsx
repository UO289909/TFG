/* eslint-disable @typescript-eslint/no-shadow */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ProfileInfoHeader } from '../ProfileInfoHeader';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
      card: '#fff',
      cardPressed: '#f0f0f0',
      text: '#111',
      secondaryText: '#666',
      shadow: '#000',
    },
  }),
}));

// mock FullScreenLoader
jest.mock('../../feedback/FullScreenLoader', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    FullScreenLoader: () => React.createElement(View, { testID: 'full-screen-loader' }),
  };
});

describe('ProfileInfoHeader', () => {
  const defaultProps = {
    nickname: 'TestUser',
    avatarUrl: 'https://example.com/avatar.jpg',
    name: 'Test Name',
    loadingAvatar: false,
    landscape: false,
  };

  it('renders correctly with avatar', () => {
    const { getByText } = render(<ProfileInfoHeader {...defaultProps} />);
    expect(getByText('TestUser')).toBeTruthy();
    expect(getByText('Test Name')).toBeTruthy();
  });

  it('renders loader when loadingAvatar is true', () => {
    const props = { ...defaultProps, loadingAvatar: true };
    const { getByTestId, getByText } = render(<ProfileInfoHeader {...props} />);
    expect(getByTestId('full-screen-loader')).toBeTruthy();
    expect(getByText('TestUser')).toBeTruthy();
    expect(getByText('Test Name')).toBeTruthy();
  });

  it('renders with default avatar when avatarUrl is null', () => {
    const props = { ...defaultProps, avatarUrl: null };
    expect(() => render(<ProfileInfoHeader {...props} />)).not.toThrow();
  });

  it('renders in landscape mode', () => {
    const props = { ...defaultProps, landscape: true };
    expect(() => render(<ProfileInfoHeader {...props} />)).not.toThrow();
  });
});
