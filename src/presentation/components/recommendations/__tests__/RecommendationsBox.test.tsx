/* eslint-disable @typescript-eslint/no-shadow */

import React from 'react';
import { render } from '@testing-library/react-native';
import { RecommendationBox } from '../RecommendationsBox';

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
}));

// mock useWindowDimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.useWindowDimensions = jest.fn(() => ({ width: 400, height: 800 }));
  return RN;
});

// mock FullScreenLoader
jest.mock('../../feedback/FullScreenLoader', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    FullScreenLoader: () => React.createElement(View, { testID: 'full-screen-loader' }),
  };
});

// mock RecommendationCard
jest.mock('../RecommendationCard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    RecommendationCard: (props: any) =>
      React.createElement(View, { testID: `recommendation-card-${props.recommendation.title}` },
        React.createElement(Text, null, props.recommendation.title)
      ),
  };
});

describe('RecommendationBox', () => {
  it('renders loader when loading is true', () => {
    const { getByTestId, getByText } = render(<RecommendationBox recommendations={[]} loading={true} />);
    expect(getByTestId('full-screen-loader')).toBeTruthy();
    expect(getByText('Preguntando a la IA (puede tardar un poco)...')).toBeTruthy();
  });

  it('renders error message for noUserBooks', () => {
    const { getByText } = render(<RecommendationBox recommendations={[]} loading={false} error="noUserBooks" />);
    expect(getByText('No puedes pedir recomendaciones sin haber leído ningún libro.')).toBeTruthy();
  });

  it('renders error message for errorAskingAI', () => {
    const { getByText } = render(<RecommendationBox recommendations={[]} loading={false} error="errorAskingAI" />);
    expect(getByText('Ha ocurrido un error al pedir recomendaciones a la IA. Inténtalo de nuevo más tarde.')).toBeTruthy();
  });

  it('renders recommendations when provided', () => {
    const recommendations = [
      { suggested_isbn: '1', title: 'Book1', author: 'Author1', why: 'Why1', confidence: 0.9 },
      { suggested_isbn: '2', title: 'Book2', author: 'Author2', why: 'Why2', confidence: 0.8 },
    ];
    const { getByText, getByTestId } = render(<RecommendationBox recommendations={recommendations} loading={false} />);
    expect(getByText('Recomendaciones')).toBeTruthy();
    expect(getByTestId('recommendation-card-Book1')).toBeTruthy();
    expect(getByTestId('recommendation-card-Book2')).toBeTruthy();
  });
});
