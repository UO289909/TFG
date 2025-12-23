import React from 'react';
import { render } from '@testing-library/react-native';
import { FullScreenLoader } from '../FullScreenLoader';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
      text: '#111',
    },
  }),
}));

describe('FullScreenLoader', () => {
  it('renders correctly', () => {
    expect(() => render(<FullScreenLoader />)).not.toThrow();
  });

  it('renders message when provided', () => {
    const { getByText } = render(<FullScreenLoader message="Loading..." />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('does not render message when not provided', () => {
    const { queryByText } = render(<FullScreenLoader />);
    expect(queryByText('Loading...')).toBeNull();
  });
});
