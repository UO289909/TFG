/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MyBooksScreen } from '../MyBooksScreen';

import {
  mockBookInProgress,
  mockBookFinished,
} from '../../../../../__mocks__/books.fixture';

const mockNavigate = jest.fn();
const mockSetParams = jest.fn();
const mockUseRoute = jest.fn().mockReturnValue({
  params: { doRefetch: false },
});

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');

  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      setParams: mockSetParams,
    }),
    useRoute: () => mockUseRoute(),
    useTheme: () => ({
      colors: {
        primary: '#00f',
        primaryDark: '#009',
        greyLight: '#ccc',
        shadow: '#000',
      },
    }),
  };
});

jest.mock('../../../components/books/BookCard', () => {
  const { Pressable, Text } = require('react-native');

  return {
    BookCard: (props: any) => (
      <Pressable testID={`book-${props.title}`} onPress={props.onPress}>
        <Text>{props.title}</Text>
      </Pressable>
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

jest.mock('../../../components/inputs/SearchBar', () => {
  const { TextInput } = require('react-native');

  return {
    SearchBar: (props: any) => (
      <TextInput
        placeholder="search-input"
        onChangeText={props.onSearch}
        testID="mock-searchbar"
      />
    ),
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

const mockRefetch = jest.fn();
let mockBooks: any[] = [];
let mockLoading = false;

jest.mock('../../../hooks/useBooks', () => ({
  useBooks: () => ({
    isLoading: mockLoading,
    myBooks: mockBooks,
    refetch: mockRefetch,
  }),
}));

const renderScreen = () => render(<MyBooksScreen />);


describe('MyBooksScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBooks = [];
    mockLoading = false;
    mockUseRoute.mockReturnValue({ params: { doRefetch: false } });
  });

  it('shows loader when loading', () => {
    mockLoading = true;

    const { getByTestId } = renderScreen();
    expect(getByTestId('full-screen-loader')).toBeTruthy();
  });

  it('shows big icon when there are no books', () => {
    const { getByText } = renderScreen();
    expect(getByText(/book/i)).toBeTruthy();
  });

  it('renders list with in-progress and finished books', () => {
    mockBooks = [mockBookInProgress, mockBookFinished];

    const { getByText } = renderScreen();

    expect(getByText('Clean Code')).toBeTruthy();
    expect(getByText('Atomic Habits')).toBeTruthy();
  });

  it('navigates to BookDetails with correct params', () => {
    mockBooks = [mockBookInProgress, mockBookFinished];

    const { getByText } = renderScreen();

    fireEvent.press(getByText('Clean Code'));
    expect(mockNavigate).toHaveBeenCalledWith('BookDetails', {
      book: mockBookInProgress,
    });
  });

  it('navigates to AddBook when pressing add button', () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('btn-add-outline'));

    expect(mockNavigate).toHaveBeenCalledWith('AddBook');
  });

  it('filters books correctly', () => {
    mockBooks = [mockBookInProgress, mockBookFinished];

    const { getByPlaceholderText, getByText, queryByText } = renderScreen();

    fireEvent.changeText(
      getByPlaceholderText('search-input'),
      'clean'
    );

    expect(getByText('Clean Code')).toBeTruthy();
    expect(queryByText('Atomic Habits')).toBeNull();
  });

  it('shows notification when no matches', async () => {
    mockBooks = [mockBookInProgress];

    const { getByPlaceholderText, findByText } = renderScreen();

    fireEvent.changeText(
      getByPlaceholderText('search-input'),
      'xyz123'
    );

    expect(await findByText(/no tienes libros/i)).toBeTruthy();
  });

  it('calls refetch when doRefetch = true', () => {
    mockUseRoute.mockReturnValueOnce({
      params: { doRefetch: true },
    });

    renderScreen();

    expect(mockRefetch).toHaveBeenCalled();
    expect(mockSetParams).toHaveBeenCalledWith({ doRefetch: false });
  });
});
