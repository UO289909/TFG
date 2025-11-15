/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockGoBack = jest.fn();
const mockReset = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ goBack: mockGoBack, reset: mockReset }),
    useRoute: () => ({ params: { book: { isbn: 'ISBN123', title: 'Clean Code', rating: 0 } } }),
    useTheme: () => ({ colors: { primary: '#00f', primaryDark: '#009', danger: '#f00', dangerDark: '#d00', shadow: '#000', card: '#fff', text: '#000' } }),
  };
});

jest.mock('../../../components/inputs/CustomTextInput', () => {
  const React = require('react');
  const { View, Text, TextInput } = require('react-native');
  return {
    CustomTextInput: (props: any) => {
      const { label, value, onChangeText, info, keyboardType, editable } = props;
      return (
        React.createElement(View, null,
          React.createElement(Text, null, label),
          React.createElement(TextInput, { testID: label, value: value?.toString?.() ?? '', onChangeText, keyboardType, editable }),
          info ? React.createElement(Text, null, info) : null
        )
      );
    },
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

jest.mock('../../../components/feedback/CustomNotification', () => {
  return {
    CustomNotification: (props: any) => {
      const { View, Text, Pressable } = require('react-native');
      return (
        <View testID="custom-notif">
          <Text>{props.message}</Text>
          {props.onClose && (
            <Pressable testID="notif-close" onPress={props.onClose}>
              <Text>close</Text>
            </Pressable>
          )}
        </View>
      );
    },
  };
});

jest.mock('../../../components/pressables/FloatingButton', () => {

  return {
    FloatingButton: (props: any) => {
      const { Pressable, Text } = require('react-native');

      return (
        <Pressable testID={`btn-${props.icon}`} onPress={props.onPress}>
          <Text>{props.icon}</Text>
        </Pressable>
      );
    },
  };
});

jest.mock('../../../../core/use-cases/books/get-user-book-by-isbn.use-case', () => {
  return { getUserBookByIsbn: jest.fn() };
});

jest.mock('../../../../core/use-cases/books/get-reading-logs.use-case', () => {
  return { getReadingLogs: jest.fn() };
});

jest.mock('../../../../core/use-cases/books/edit-user-book.use-case', () => {
  return { editUserBook: jest.fn(() => Promise.resolve()) };
});

jest.mock('../../../../core/use-cases/books/edit-reading-log.use-case', () => {
  return { editReadingLog: jest.fn(() => Promise.resolve()) };
});

const { getUserBookByIsbn } = require('../../../../core/use-cases/books/get-user-book-by-isbn.use-case');
const { getReadingLogs } = require('../../../../core/use-cases/books/get-reading-logs.use-case');
const { editUserBook } = require('../../../../core/use-cases/books/edit-user-book.use-case');

import { EditBookScreen } from '../EditBookScreen';

describe('EditBookScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows initial loader while loading userBook', () => {
    getUserBookByIsbn.mockImplementation(() => new Promise(() => {}));
    const { getByTestId } = render(<EditBookScreen />);
    expect(getByTestId('full-screen-loader')).toBeTruthy();
  });

  it('shows editable fields and saves changes (editUserBook + reset)', async () => {
    const mockUserBook = {
      isbn: 'ISBN123',
      author: 'Autor Viejo',
      pages: 150,
      release_year: 2019,
      cover_url: 'http://cover',
      rating: 4,
      review: 'Bien',
    };
    const mockLogs = [{ reading_date: '2020-01-01', to_page: 100 }];

    getUserBookByIsbn.mockResolvedValueOnce(mockUserBook);
    getReadingLogs.mockResolvedValueOnce(mockLogs);

    const { getByTestId } = render(<EditBookScreen />);

    await waitFor(() => {
      expect(getByTestId('Autor:').props.value).toBe('Autor Viejo');
      expect(getByTestId('Número de páginas:').props.value).toBe(String(150));
    });

    fireEvent.changeText(getByTestId('Autor:'), 'Autor Nuevo');
    fireEvent.changeText(getByTestId('Número de páginas:'), '200');
    fireEvent.changeText(getByTestId('Año de publicación:'), '2018');
    fireEvent.changeText(getByTestId('URL de la portada (opcional):'), 'http://newcover');

    fireEvent.press(getByTestId('btn-checkmark-outline'));

    await waitFor(() => {
      expect(editUserBook).toHaveBeenCalled();
      const callArgs = editUserBook.mock.calls[0];
      expect(callArgs[0]).toBe(mockUserBook.isbn);
      expect(callArgs[1]).toBe('Autor Nuevo');
      expect(callArgs[2]).toBe(200);
      expect(callArgs[5]).toBe(2018);
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'MyBooksList', params: { doRefetch: true } }],
      });
    });
  });

  it('goes back when pressing the close button', async () => {
    getUserBookByIsbn.mockResolvedValueOnce({ isbn: 'ISBN123' });
    getReadingLogs.mockResolvedValueOnce([]);
    const { getByTestId } = render(<EditBookScreen />);
    await waitFor(() => {
      expect(getByTestId('btn-close-outline')).toBeTruthy();
    });
    fireEvent.press(getByTestId('btn-close-outline'));
    expect(mockGoBack).toHaveBeenCalled();
  });
});
