import React from 'react';
import { render } from '@testing-library/react-native';
import { RecommendationCard } from '../RecommendationCard';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
      cardPressed: '#f0f0f0',
      text: '#111',
      secondaryText: '#666',
      shadow: '#000',
    },
  }),
}));

describe('RecommendationCard', () => {
  const defaultRecommendation = {
    suggested_isbn: '9999999999999',
    title: 'Test Book',
    author: 'Test Author',
    why: 'Because it is great',
    confidence: 0.85,
  };

  it('renders correctly', () => {
    const { getByText } = render(<RecommendationCard recommendation={defaultRecommendation} />);
    expect(getByText('Test Book')).toBeTruthy();
    expect(getByText('Test Author')).toBeTruthy();
    expect(getByText('Because it is great')).toBeTruthy();
    expect(getByText('Coincidencia: 85.00%')).toBeTruthy();
  });
});
