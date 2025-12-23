/* eslint-disable @typescript-eslint/no-shadow */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RecentReadsBox } from '../RecentReadsBox';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
      card: '#fff',
      text: '#111',
      shadow: '#000',
    },
  }),
  useNavigation: jest.fn(),
}));

// mock useWindowDimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.useWindowDimensions = jest.fn(() => ({ width: 400, height: 800 }));
  return RN;
});

// mock CompactBookCard
jest.mock('../../books/CompactBookCard', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    CompactBookCard: (props: any) =>
      React.createElement(Pressable, { testID: `compact-book-${props.title}`, onPress: props.onPress },
        React.createElement(Text, null, props.title),
        React.createElement(Text, null, props.nickname)
      ),
  };
});

// mock FullScreenLoader
jest.mock('../../feedback/FullScreenLoader', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    FullScreenLoader: () => React.createElement(View, { testID: 'full-screen-loader' }),
  };
});

describe('RecentReadsBox', () => {
  const mockNavigate = jest.fn();
  const mockUseNavigation = require('@react-navigation/native').useNavigation;

  beforeEach(() => {
    mockUseNavigation.mockReturnValue({ navigate: mockNavigate });
    mockNavigate.mockClear();
  });

  it('renders loader when loading is true', () => {
    const { getByTestId, getByText } = render(<RecentReadsBox recentReads={[]} loading={true} />);
    expect(getByTestId('full-screen-loader')).toBeTruthy();
    expect(getByText('Cargando lecturas recientes de tus amigos...')).toBeTruthy();
  });

  it('renders error message when error is true', () => {
    const { getByText } = render(<RecentReadsBox recentReads={[]} loading={false} error={true} />);
    expect(getByText('No hay lecturas recientes de amigos disponibles.')).toBeTruthy();
  });

  it('renders list when recentReads is provided', () => {
    const recentReads: any[] = [
      { nickname: 'User1', book: { title: 'Book1', cover_url: '', rating: 5 } },
      { nickname: 'User2', book: { title: 'Book2', cover_url: '', rating: 4 } },
    ];
    const { getByTestId, getByText } = render(<RecentReadsBox recentReads={recentReads} loading={false} />);
    expect(getByText('Lecturas recientes de amigos')).toBeTruthy();
    expect(getByTestId('compact-book-Book1')).toBeTruthy();
    expect(getByTestId('compact-book-Book2')).toBeTruthy();
  });

  it('calls navigation.navigate when CompactBookCard is pressed', () => {
    const recentReads: any[] = [{ nickname: 'User1', book: { title: 'Book1', cover_url: '', rating: 5 } }];
    const { getByTestId } = render(<RecentReadsBox recentReads={recentReads} loading={false} />);
    fireEvent.press(getByTestId('compact-book-Book1'));
    expect(mockNavigate).toHaveBeenCalledWith('ReadDetails', { book: recentReads[0].book, nickname: 'User1' });
  });
});
