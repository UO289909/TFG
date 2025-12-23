/* eslint-disable @typescript-eslint/no-shadow */

import React from 'react';
import { render } from '@testing-library/react-native';
import { PagesReadRanking } from '../PagesReadRanking';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
      card: '#fff',
      text: '#111',
      secondaryText: '#666',
      background: '#f5f5f5',
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

describe('PagesReadRanking', () => {
  it('renders loader when loading is true', () => {
    const { getByTestId, getByText } = render(<PagesReadRanking pagesRanking={[]} loading={true} />);
    expect(getByTestId('full-screen-loader')).toBeTruthy();
    expect(getByText('Cargando páginas leídas por tus amigos...')).toBeTruthy();
  });

  it('renders error message when error is true', () => {
    const { getByText } = render(<PagesReadRanking pagesRanking={[]} loading={false} error={true} />);
    expect(getByText('No se ha podido crear el ranking de páginas leídas.')).toBeTruthy();
  });

  it('renders ranking when pagesRanking is provided', () => {
    const pagesRanking = [
      { nickname: 'User1', pages: 100 },
      { nickname: 'Tú', pages: 50 },
      { nickname: 'User2', pages: 25 },
    ];
    const { getByText } = render(<PagesReadRanking pagesRanking={pagesRanking} loading={false} />);
    expect(getByText('Páginas leídas este mes')).toBeTruthy();
    expect(getByText('1. User1')).toBeTruthy();
    expect(getByText('100 pág.')).toBeTruthy();
    expect(getByText('2. Tú')).toBeTruthy();
    expect(getByText('50 pág.')).toBeTruthy();
    expect(getByText('3. User2')).toBeTruthy();
    expect(getByText('25 pág.')).toBeTruthy();
  });
});
