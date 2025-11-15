/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

let mockMyBooks: any[] = [];

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useTheme: () => ({ colors: { card: '#fff', shadow: '#000', text: '#000' } }),
  };
});

jest.mock('../../../../core/use-cases/books/get-reading-logs.use-case', () => {
  return { getReadingLogs: jest.fn() };
});
const { getReadingLogs } = require('../../../../core/use-cases/books/get-reading-logs.use-case');

jest.mock('../../../hooks/useBooks', () => ({
  useBooks: () => ({ myBooks: mockMyBooks }),
}));

jest.mock('../../../components/feedback/FullScreenLoader', () => {
  const React = require('react');
  const { View, ActivityIndicator } = require('react-native');
  return {
    FullScreenLoader: () => React.createElement(View, { testID: 'full-screen-loader' }, React.createElement(ActivityIndicator, null)),
  };
});

import { MonthReadingLogs } from '../MonthReadingLogs';

describe('MonthReadingLogs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMyBooks = [];
  });

  it('shows loader while fetching logs', () => {
    // leave promise pending
    getReadingLogs.mockImplementation(() => new Promise(() => {}));
    const { getByTestId } = render(<MonthReadingLogs />);
    expect(getByTestId('full-screen-loader')).toBeTruthy();
  });

  it('renders pages read per book for logs in current month', async () => {
    const now = new Date();
    const isbn = 'ISBN-1';
    // two logs for same isbn this month: from_page 10 -> to_page 110 => pagesRead 100
    const logThisMonth = {
      isbn,
      reading_date: now.toISOString(),
      from_page: 10,
      to_page: 110,
    };
    // prepare myBooks so title is found
    mockMyBooks = [{ isbn, title: 'My Title' }];

    getReadingLogs.mockResolvedValueOnce([logThisMonth]);

    const { getByText } = render(<MonthReadingLogs />);

    await waitFor(() => {
      expect(getByText('My Title')).toBeTruthy();
      expect(getByText(/100 páginas leídas/)).toBeTruthy();
    });
  });

  it('shows "Desconocido" when book info not available', async () => {
    const now = new Date();
    const unknownIsbn = 'UNKNOWN';
    const logThisMonth = {
      isbn: unknownIsbn,
      reading_date: now.toISOString(),
      from_page: 0,
      to_page: 5,
    };

    // myBooks empty -> title should be "Desconocido"
    mockMyBooks = [];
    getReadingLogs.mockResolvedValueOnce([logThisMonth]);

    const { getByText } = render(<MonthReadingLogs />);

    await waitFor(() => {
      expect(getByText('Desconocido')).toBeTruthy();
      expect(getByText(/5 páginas leídas/)).toBeTruthy();
    });
  });
});
