/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render } from '@testing-library/react-native';

const mockNavigate = jest.fn();

const mockBookBase = {
  isbn: '1234',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  pages: 464,
  current_page: 120,
  cover_url: '',
  release_year: 2008,
  review: '',
  start_date: '',
  finish_date: '',
  rating: null,
};

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate }),
    useRoute: () => ({ params: { book: mockBookBase, nickname: 'friend1' } }),
    useTheme: () => ({ colors: { primary: '#00f', shadow: '#000', card: '#fff', text: '#000' } }),
  };
});

jest.mock('../../../components/inputs/FiveStarsInput', () => {
  return {
    FiveStarsInput: (props: any) => {
      const { Pressable, Text } = require('react-native');
      return (
        <Pressable testID="five-stars" onPress={() => props.onPress?.(5)}>
          <Text>five-stars</Text>
        </Pressable>
      );
    },
  };
});

import { RecentReadScreen } from '../RecentReadScreen';

describe('RecentReadScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders basic book info (title, author, pages, year)', () => {
    const { getByText } = render(<RecentReadScreen />);
    expect(getByText('Clean Code')).toBeTruthy();
    expect(getByText('Robert C. Martin')).toBeTruthy();
    expect(getByText(/páginas/i)).toBeTruthy();
    expect(getByText(/2008/)).toBeTruthy();
  });

  it('when rating is null shows current page fraction and hides review/dates', () => {
    const { getByText, queryByText } = render(<RecentReadScreen />);
    expect(getByText(/120 \/\s*464\s*páginas/i)).toBeTruthy();
    expect(queryByText('Reseña')).toBeNull();
    expect(queryByText(/Leido por/i)).toBeNull();
  });

  it('when rating present shows review, stars and read dates including nickname', () => {
    const ratedBook = {
      ...mockBookBase,
      rating: 5,
      review: 'Excelente lectura',
      start_date: '2020-01-01',
      finish_date: '2020-01-02',
    };

    jest.resetModules();

    jest.doMock('@react-navigation/native', () => {
      const actual = jest.requireActual('@react-navigation/native');
      return {
        ...actual,
        useNavigation: () => ({ navigate: mockNavigate }),
        useRoute: () => ({ params: { book: ratedBook, nickname: 'friend1' } }),
        useTheme: () => ({ colors: { primary: '#00f', shadow: '#000', card: '#fff', text: '#000' } }),
      };
    });

    jest.doMock('../../../components/inputs/FiveStarsInput', () => {
      const React = require('react');
      return {
        FiveStarsInput: (props: any) => {
          const { Pressable, Text } = require('react-native');
          return React.createElement(Pressable, { testID: 'five-stars', onPress: () => props.onPress?.(5) },
            React.createElement(Text, null, String(props.value ?? 'no-value'))
          );
        },
      };
    });

    const { RecentReadScreen: Screen } = require('../RecentReadScreen');
    const { getByText, getByTestId } = render(React.createElement(Screen));

    expect(getByText('Reseña')).toBeTruthy();
    expect(getByText('Excelente lectura')).toBeTruthy();

    const expectedDatesText = `Leido por friend1\nentre el ${new Date(ratedBook.start_date).toLocaleDateString()} y ${new Date(ratedBook.finish_date).toLocaleDateString()}`;
    expect(getByText(expectedDatesText)).toBeTruthy();

    expect(getByTestId('five-stars')).toBeTruthy();
  });
});
