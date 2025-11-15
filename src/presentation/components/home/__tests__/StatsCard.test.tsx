import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StatsCard } from '../StatsCard';

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

describe('StatsCard', () => {
  const defaultProps = {
    topLabel: 'Top Label',
    bottomLabel: 'Bottom Label',
    value: '123',
    type: 'small' as 'small' | 'large' | 'cover',
    landscape: false,
    cover_url: 'https://example.com/cover.jpg',
    onPress: jest.fn(),
  };

  it('renders correctly for small type', () => {
    const { getByText } = render(<StatsCard {...defaultProps} />);
    expect(getByText('Top Label')).toBeTruthy();
    expect(getByText('123')).toBeTruthy();
    expect(getByText('Bottom Label')).toBeTruthy();
  });

  it('renders correctly for large type', () => {
    const props = { ...defaultProps, type: 'large' as 'small' | 'large' | 'cover' };
    const { getByText } = render(<StatsCard {...props} />);
    expect(getByText('Top Label')).toBeTruthy();
    expect(getByText('123')).toBeTruthy();
  });

  it('renders correctly for cover type', () => {
    const props = { ...defaultProps, type: 'cover' as 'small' | 'large' | 'cover' };
    const { getByText } = render(<StatsCard {...props} />);
    expect(getByText('Top Label')).toBeTruthy();
    expect(getByText('123')).toBeTruthy();
  });

  it('renders without bottomLabel', () => {
    const props = { ...defaultProps, bottomLabel: undefined };
    const { getByText, queryByText } = render(<StatsCard {...props} />);
    expect(getByText('Top Label')).toBeTruthy();
    expect(queryByText('Bottom Label')).toBeNull();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(<StatsCard {...defaultProps} />);
    const pressable = getByText('Top Label').parent?.parent;
    expect(pressable).toBeTruthy();
    fireEvent.press(pressable!);
    expect(defaultProps.onPress).toHaveBeenCalled();
  });

  it('renders with cover_url null', () => {
    const props = { ...defaultProps, type: 'cover' as 'small' | 'large' | 'cover', cover_url: undefined };
    expect(() => render(<StatsCard {...props} />)).not.toThrow();
  });

  it('renders in landscape mode', () => {
    const props = { ...defaultProps, landscape: true };
    expect(() => render(<StatsCard {...props} />)).not.toThrow();
  });
});
