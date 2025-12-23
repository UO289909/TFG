/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockNavigate = jest.fn();
const mockReset = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate, reset: mockReset, goBack: jest.fn() }),
    useRoute: () => ({ params: { book: { isbn: 'ISBN-RATE', title: 'Clean Code', pages: 300, current_page: 120 }, rating: 0 } }),
    useTheme: () => ({ colors: { primary: '#00f', primaryDark: '#009', danger: '#f00', dangerDark: '#d00', shadow: '#000', card: '#fff', text: '#000' } }),
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

jest.mock('../../../components/inputs/CustomTextInput', () => {
  const React = require('react');
  const { View, TextInput } = require('react-native');
  return {
    CustomTextInput: (props: any) => {
      return React.createElement(View, null,
        React.createElement(TextInput, { testID: 'review-input', value: props.value ?? '', onChangeText: props.onChangeText, multiline: props.multiline, editable: props.editable, placeholder: props.placeholder })
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
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    FloatingButton: (props: any) => React.createElement(Pressable, { testID: `btn-${props.icon}`, onPress: props.onPress }, React.createElement(Text, null, props.icon)),
  };
});

jest.mock('../../../../core/use-cases/books/get-reading-logs.use-case', () => {
  return { getReadingLogs: jest.fn() };
});
jest.mock('../../../../core/use-cases/books/rate-book.use-case', () => {
  return { rateUserBook: jest.fn(() => Promise.resolve()) };
});
jest.mock('../../../../core/use-cases/books/add-reading-log.use-case', () => {
  return { addReadingLog: jest.fn(() => Promise.resolve()) };
});

const { getReadingLogs } = require('../../../../core/use-cases/books/get-reading-logs.use-case');
const { rateUserBook } = require('../../../../core/use-cases/books/rate-book.use-case');
const { addReadingLog } = require('../../../../core/use-cases/books/add-reading-log.use-case');

import { RateBookScreen } from '../RateBookScreen';

describe('RateBookScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows initial loader while loading logs', () => {
    getReadingLogs.mockImplementation(() => new Promise(() => {}));
    const { getByTestId } = render(<RateBookScreen />);
    expect(getByTestId('full-screen-loader')).toBeTruthy();
  });

  it('shows message for book finished today (no logs) and allows rating -> calls addReadingLog + rateUserBook + reset', async () => {
    const mockBook = { isbn: 'ISBN-RATE', title: 'Clean Code', pages: 300, current_page: 120 };
    getReadingLogs.mockResolvedValueOnce([]);

    const { getByText, getByTestId } = render(<RateBookScreen />);

    await waitFor(() => {
      expect(getByText(/¡Has terminado el libro en un solo día!/i)).toBeTruthy();
    });

    fireEvent.changeText(getByTestId('review-input'), 'Excelente');
    fireEvent.press(getByTestId('five-stars'));

    fireEvent.press(getByTestId('btn-checkmark-outline'));

    await waitFor(() => {
      expect(addReadingLog).toHaveBeenCalled();
      expect(rateUserBook).toHaveBeenCalled();
      const rateCall = rateUserBook.mock.calls[0];
      expect(rateCall[0]).toBe(mockBook.isbn);
      expect(rateCall[1]).toBe(5);
      expect(rateCall[2]).toBe('Excelente');
      expect(rateCall[3]).toEqual(expect.any(Date));
      expect(rateCall[4]).toEqual(expect.any(Date));
      expect(mockReset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'MyBooksList', params: { doRefetch: true } }],
      });
    });
  });

  it('shows information of previous logs when they exist and allows rating', async () => {
    const logs = [
      { reading_date: '2020-01-01', to_page: 10 },
      { reading_date: '2020-01-05', to_page: 50 },
    ];
    getReadingLogs.mockResolvedValueOnce(logs);

    const { getByText, getByTestId } = render(<RateBookScreen />);

    await waitFor(() => {
      expect(getByText(/Empezaste a leer el libro el día/i)).toBeTruthy();
      expect(getByText(/Has leido este libro un total de/i)).toBeTruthy();
    });

    fireEvent.press(getByTestId('five-stars'));
    fireEvent.press(getByTestId('btn-checkmark-outline'));

    await waitFor(() => {
      expect(addReadingLog).toHaveBeenCalled();
      expect(rateUserBook).toHaveBeenCalled();
      expect(mockReset).toHaveBeenCalled();
    });
  });
});
