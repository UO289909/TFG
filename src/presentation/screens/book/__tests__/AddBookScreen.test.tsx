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
    useTheme: () => ({ colors: { primary: '#00f', danger: '#f00', shadow: '#000', card: '#fff', text: '#000' } }),
  };
});

const mockBookResult = {
  title: 'Mock Title',
  author: 'Mock Author',
  pages: 123,
  release_year: '2020-01-01',
  cover_url: '',
};

jest.mock('../../../components/inputs/SearchBar', () => {
  const React = require('react');
  const { View, TextInput, Pressable, Text } = require('react-native');
  return {
    SearchBar: (props: any) => {
      const [value, setValue] = React.useState('');
      return (
        React.createElement(View, null,
          React.createElement(TextInput, { testID: 'search-input', value, onChangeText: (t: any) => setValue(t), placeholder: 'ISBN' }),
          React.createElement(Pressable, { testID: 'search-btn', onPress: () => props.onSearch?.(value) },
            React.createElement(Text, null, 'Buscar')
          )
        )
      );
    },
  };
});

jest.mock('../../../components/inputs/CustomTextInput', () => {
  const React = require('react');
  const { View, Text, TextInput } = require('react-native');
  return {
    CustomTextInput: (props: any) => {
      const { label, value, onChangeText, info, keyboardType, editable } = props;
      return (
        <View>
          <Text>{label}</Text>
          <TextInput testID={label} value={value?.toString?.()} onChangeText={onChangeText} keyboardType={keyboardType} editable={editable} />
          {info ? <Text>{info}</Text> : null}
        </View>
      );
    },
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

jest.mock('../../../../core/use-cases/books/get-book-by-isbn.use-case', () => {
  return {
    getBookByIsbn: jest.fn(),
  };
});

jest.mock('../../../../core/use-cases/books/post-new-book-to-user.use-case', () => {
  return {
    postNewBook: jest.fn(() => Promise.resolve()),
  };
});

const { getBookByIsbn } = require('../../../../core/use-cases/books/get-book-by-isbn.use-case');
const { postNewBook } = require('../../../../core/use-cases/books/post-new-book-to-user.use-case');

import { AddBookScreen } from '../AddBookScreen';

describe('AddBookScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // default mock behaviour: no book found
    getBookByIsbn.mockImplementation(() => Promise.resolve({ book: null, fromOpenLibrary: false, alreadyInUser: false }));
  });

  it('shows initial notification and search bar', () => {
    const { getByText, getByTestId } = render(<AddBookScreen />);
    expect(getByText(/Introduce el ISBN del libro/i)).toBeTruthy();
    expect(getByTestId('search-input')).toBeTruthy();
    expect(getByTestId('search-btn')).toBeTruthy();
  });

  it('shows error when ISBN does not have 13 digits', async () => {
    const { getByTestId, getByText } = render(<AddBookScreen />);
    fireEvent.changeText(getByTestId('search-input'), '123');
    fireEvent.press(getByTestId('search-btn'));
    await waitFor(() => {
      expect(getByText(/El ISBN debe tener 13 dígitos \(actualmente 3\)/i)).toBeTruthy();
    });
  });

  it('shows message when the book is already in the collection', async () => {
    getBookByIsbn.mockResolvedValueOnce({ book: null, fromOpenLibrary: false, alreadyInUser: true });
    const isbn13 = '1'.repeat(13);
    const { getByTestId, getByText } = render(<AddBookScreen />);
    fireEvent.changeText(getByTestId('search-input'), isbn13);
    fireEvent.press(getByTestId('search-btn'));
    await waitFor(() => {
      expect(getByText(/Este libro ya está en tu colección/i)).toBeTruthy();
    });
    expect(getBookByIsbn).toHaveBeenCalled();
    expect(getBookByIsbn.mock.calls[0][1]).toBe(isbn13);
  });

  it('fills the fields when a book is found from OpenLibrary', async () => {
    getBookByIsbn.mockResolvedValueOnce({ book: mockBookResult, fromOpenLibrary: true, alreadyInUser: false });
    const isbn13 = '9'.repeat(13);
    const { getByTestId, getByText } = render(<AddBookScreen />);
    fireEvent.changeText(getByTestId('search-input'), isbn13);
    fireEvent.press(getByTestId('search-btn'));

    await waitFor(() => {
      expect(getByText(/Rellena los campos que quieras editar y guarda tu libro/i)).toBeTruthy();
      expect(getByTestId('Título:').props.value).toBe(mockBookResult.title);
      expect(getByTestId('Autor:').props.value).toBe(mockBookResult.author);
      expect(getByTestId('Número de páginas:').props.value).toBe(String(mockBookResult.pages));
      expect(getByTestId('Año de publicación:').props.value).toContain('2020');
    });
  });

  it('adds the book and resets navigation when fields are completed and add is pressed', async () => {
    const isbn13 = '3'.repeat(13);
    const { getByTestId } = render(<AddBookScreen />);

    fireEvent.changeText(getByTestId('search-input'), isbn13);
    fireEvent.press(getByTestId('search-btn'));

    fireEvent.changeText(getByTestId('Título:'), 'Mi libro');
    fireEvent.changeText(getByTestId('Autor:'), 'Un Autor');
    fireEvent.changeText(getByTestId('Número de páginas:'), '200');
    fireEvent.changeText(getByTestId('Año de publicación:'), '2020');
    fireEvent.changeText(getByTestId('URL de la portada (opcional):'), 'http://cover');

    const addBtn = getByTestId('btn-add-outline');
    fireEvent.press(addBtn);

    await waitFor(() => {
      expect(postNewBook).toHaveBeenCalled();
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'MyBooksList', params: { doRefetch: true } }],
      });
    });
  });
});
