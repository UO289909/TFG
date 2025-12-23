/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockNavigate = jest.fn();
const mockReset = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate, reset: mockReset }),
    useRoute: () => ({ params: { book: mockBook } }),
    useTheme: () => ({ colors: { primary: '#00f', danger: '#f00', shadow: '#000', card: '#fff', text: '#000' } }),
  };
});

const mockBook: any = {
  isbn: '1234',
  title: 'Clean Code',
  author: 'Robert C. Martin',
  pages: 464,
  current_page: 120,
  rating: 0,
  cover_url: '',
  release_year: 2008,
  review: '',
  start_date: '',
  finish_date: '',
};

const originalMockBook = { ...mockBook };

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

jest.mock('../../../components/inputs/ReadingLogMenu', () => {
  return {
    ReadingLogMenu: (props: any) => {
      const { View, Text, Pressable } = require('react-native');
      return (
        <View testID="reading-log-menu">
          <Text>reading-log-menu</Text>
          <Pressable testID="reading-log-close" onPress={props.onClose}>
            <Text>close</Text>
          </Pressable>
        </View>
      );
    },
  };
});

jest.mock('../../../components/pressables/CustomButton', () => {
  return {
    CustomButton: (props: any) => {
      const { Pressable, Text } = require('react-native');
      return (
        <Pressable testID={`btn-${props.title}`} onPress={props.onPress}>
          <Text>{props.title}</Text>
        </Pressable>
      );
    },
  };
});

jest.mock('../../../components/feedback/CustomNotification', () => {
  return {
    CustomNotification: (props: any) => {
      const { View, Text, Pressable } = require('react-native');
      return (
        <View testID="custom-notification">
          <Text>{props.message}</Text>
          <Pressable testID="notif-accept" onPress={props.onAccept}>
            <Text>accept</Text>
          </Pressable>
          <Pressable testID="notif-close" onPress={props.onClose}>
            <Text>close</Text>
          </Pressable>
        </View>
      );
    },
  };
});

jest.mock('../../../../core/use-cases/books/delete-user-book.use-case', () => {
  return {
    deleteUserBook: jest.fn(() => Promise.resolve()),
  };
});

const { deleteUserBook: mockDeleteUserBook } = require('../../../../core/use-cases/books/delete-user-book.use-case');

jest.mock('../../../components/feedback/FullScreenLoader', () => {
  const React = require('react');
  const { View, ActivityIndicator } = require('react-native');

  return {
    FullScreenLoader: () =>
      React.createElement(
        View,
        { testID: 'full-screen-loader' },
        React.createElement(ActivityIndicator, null)
      ),
  };
});

import { BookDetailsScreen } from '../BookDetailsScreen';

describe('BookDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(mockBook, originalMockBook);
  });

  it('renders book info', () => {
    const { getByText } = render(<BookDetailsScreen />);
    expect(getByText('Clean Code')).toBeTruthy();
    expect(getByText('Robert C. Martin')).toBeTruthy();
    expect(getByText(/páginas/i)).toBeTruthy();
  });

  it('shows current page fraction when rating is falsy (0)', () => {
    mockBook.rating = 0;
    const { getByText } = render(<BookDetailsScreen />);
    expect(getByText('120 / 464 páginas')).toBeTruthy();
  });

  it('navigates to RateBook when rating (rating present path)', () => {
    // with rating 0 the review section renders a FiveStarsInput (mocked)
    mockBook.rating = 0;
    const { getByTestId } = render(<BookDetailsScreen />);
    fireEvent.press(getByTestId('five-stars'));
    expect(mockNavigate).toHaveBeenCalledWith('RateBook', { book: mockBook, rating: 5 });
  });

  it('navigates to RateBook when rating is null (interactive path)', () => {
    mockBook.rating = null;
    const { getByTestId } = render(<BookDetailsScreen />);
    fireEvent.press(getByTestId('five-stars'));
    expect(mockNavigate).toHaveBeenCalledWith('RateBook', { book: mockBook, rating: 5 });
  });

  it('opens reading log menu when pressing register daily read', () => {
    mockBook.rating = null;
    const { getByTestId, getByText } = render(<BookDetailsScreen />);
    fireEvent.press(getByText('Registrar lectura diaria'));
    expect(getByTestId('reading-log-menu')).toBeTruthy();
  });

  it('does not show "Registrar lectura diaria" when book has rating', () => {
    mockBook.rating = 4;
    const { queryByText } = render(<BookDetailsScreen />);
    expect(queryByText('Registrar lectura diaria')).toBeNull();
  });

  it('closes reading log menu when pressing close', () => {
    mockBook.rating = null;
    const { getByTestId, getByText, queryByTestId } = render(<BookDetailsScreen />);
    fireEvent.press(getByText('Registrar lectura diaria'));
    expect(getByTestId('reading-log-menu')).toBeTruthy();
    fireEvent.press(getByTestId('reading-log-close'));
    expect(queryByTestId('reading-log-menu')).toBeNull();
  });

  it('shows notification when pressing delete and calls delete + reset on accept', async () => {
    const { getByText, getByTestId } = render(<BookDetailsScreen />);
    fireEvent.press(getByText('Eliminar libro'));
    expect(getByTestId('custom-notification')).toBeTruthy();

    fireEvent.press(getByTestId('notif-accept'));

    expect(getByTestId('full-screen-loader')).toBeTruthy();

    await waitFor(() => {
      expect(mockDeleteUserBook).toHaveBeenCalledWith(mockBook.isbn);
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'MyBooksList', params: { doRefetch: true } }],
      });
    });
  });

  it('closes notification when pressing close', () => {
    const { getByText, getByTestId, queryByTestId } = render(<BookDetailsScreen />);
    fireEvent.press(getByText('Eliminar libro'));
    expect(getByTestId('custom-notification')).toBeTruthy();
    fireEvent.press(getByTestId('notif-close'));
    expect(queryByTestId('custom-notification')).toBeNull();
  });

  it('renders review and read dates when book has rating and dates', () => {
    const start = '2020-01-01';
    const finish = '2020-01-10';
    mockBook.rating = 4;
    mockBook.review = 'Gran libro';
    mockBook.start_date = start;
    mockBook.finish_date = finish;

    const { getByText } = render(<BookDetailsScreen />);

    expect(getByText('Reseña')).toBeTruthy();
    expect(getByText('Gran libro')).toBeTruthy();

    const expectedDatesText = `Leido entre el ${new Date(start).toLocaleDateString()} y ${new Date(finish).toLocaleDateString()}`;
    expect(getByText(expectedDatesText)).toBeTruthy();
  });

  it('navigates to EditBook when pressing edit', () => {
    const { getByText } = render(<BookDetailsScreen />);
    fireEvent.press(getByText('Editar libro'));
    expect(mockNavigate).toHaveBeenCalledWith('EditBook', { book: mockBook });
  });
});
