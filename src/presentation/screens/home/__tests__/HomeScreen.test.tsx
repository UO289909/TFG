/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockNavigate = jest.fn();
const mockReset = jest.fn();
const mockRefetchUserStats = jest.fn();
const mockRefetchFriendsStats = jest.fn();
const mockRefetchRecommendations = jest.fn();

let mockLoadingUserStats = false;
let mockLoadingFriendsRecentReads = false;
let mockLoadingFriendsPagesRead = false;
let mockPagesThisMonth = 0;
let mockLastBook: any = null;
let mockTotalBooks = 0;
let mockFriendsRecentReads: any[] = [];
let mockFriendsPagesRead: any[] = [];
let mockRecommendations: any[] = [];
let mockLoadingRecommendations = false;

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate, reset: mockReset }),
    useTheme: () => ({ colors: { primary: '#00f', shadow: '#000', card: '#fff', text: '#000' } }),
  };
});

// mocks de hooks: valores mutables arriba
jest.mock('../../../hooks/useStats', () => ({
  useStats: () => ({
    loadingUserStats: mockLoadingUserStats,
    loadingFriendsRecentReads: mockLoadingFriendsRecentReads,
    loadingFriendsPagesRead: mockLoadingFriendsPagesRead,
    pagesThisMonth: mockPagesThisMonth,
    lastBook: mockLastBook,
    totalBooks: mockTotalBooks,
    friendsRecentReads: mockFriendsRecentReads,
    friendsPagesRead: mockFriendsPagesRead,
    refetchUserStats: mockRefetchUserStats,
    refetchFriendsStats: mockRefetchFriendsStats,
  }),
}));

jest.mock('../../../hooks/useRecomendations', () => ({
  useRecommendations: () => ({
    recommendations: mockRecommendations,
    refetchRecommendations: mockRefetchRecommendations,
    loadingRecommendations: mockLoadingRecommendations,
  }),
}));

jest.mock('../../../components/home', () => {
  const React = require('react');
  const { Pressable, Text, View } = require('react-native');
  return {
    StatsCard: (props: any) =>
      React.createElement(
        Pressable,
        { testID: `stats-${props.topLabel}`, onPress: props.onPress },
        React.createElement(Text, null, String(props.value ?? props.topLabel))
      ),
    PagesReadRanking: (props: any) =>
      React.createElement(View, { testID: 'pages-ranking' }, React.createElement(Text, null, 'pages-ranking')),
  };
});

jest.mock('../../../components/home/RecentReadsBox', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    RecentReadsBox: (props: any) =>
      React.createElement(View, { testID: 'recent-reads' }, React.createElement(Text, null, 'recent-reads')),
  };
});

jest.mock('../../../components/recommendations/RecommendationsBox', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    RecommendationBox: (props: any) =>
      React.createElement(View, { testID: 'recommendation-box' }, React.createElement(Text, null, 'recommendations')),
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

import { HomeScreen } from '../HomeScreen';

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // valores por defecto
    mockLoadingUserStats = false;
    mockLoadingFriendsRecentReads = false;
    mockLoadingFriendsPagesRead = false;
    mockPagesThisMonth = 0;
    mockLastBook = null;
    mockTotalBooks = 0;
    mockFriendsRecentReads = [];
    mockFriendsPagesRead = [];
    mockRecommendations = [];
    mockLoadingRecommendations = false;
  });

  it('shows initial loader when loadingUserStats is true', () => {
    mockLoadingUserStats = true;
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('full-screen-loader')).toBeTruthy();
  });

  it('shows "no stats" message when totalBooks is 0', () => {
    mockTotalBooks = 0;
    mockLoadingUserStats = false;
    const { getByText } = render(<HomeScreen />);
    expect(getByText(/No tienes libros de los que generar estadísticas/i)).toBeTruthy();
  });

  it('renders stats and navigates to MonthLogs, MyBooks and BookDetails', () => {
    mockTotalBooks = 3;
    mockPagesThisMonth = 42;
    mockLastBook = { title: 'Last Book', rating: null, cover_url: '' };

    const { getByTestId } = render(<HomeScreen />);

    // StatsCard de "Has leido" debe mostrar el valor
    expect(getByTestId('stats-Has leido')).toBeTruthy();
    fireEvent.press(getByTestId('stats-Has leido'));
    expect(mockNavigate).toHaveBeenCalledWith('MonthLogs');

    // StatsCard de "Tienes" -> MyBooks (bottomTabsNavigation)
    fireEvent.press(getByTestId('stats-Tienes'));
    expect(mockNavigate).toHaveBeenCalledWith('MyBooks');

    // StatsCard cover (lastBook) -> BookDetails
    const coverLabel = mockLastBook.rating !== null ? 'El último libro que has leido es' : 'El último libro que has empezado es';
    fireEvent.press(getByTestId(`stats-${coverLabel}`));
    expect(mockNavigate).toHaveBeenCalledWith('BookDetails', { book: mockLastBook });
  });

  it('calls refetchRecommendations when pressing ask-for-recommendations button', () => {
    const { getByTestId } = render(<HomeScreen />);
    fireEvent.press(getByTestId('btn-Pedir 4 recomendaciones a la IA'));
    expect(mockRefetchRecommendations).toHaveBeenCalled();
  });

  it('shows RecommendationBox when recommendations exist or loading', () => {
    mockRecommendations = ['a', 'b'];
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('recommendation-box')).toBeTruthy();
  });

  it('shows RecentReadsBox when friendsRecentReads exist', () => {
    mockFriendsRecentReads = [{
      nickname: 'friend1',
      book: { title: 'Book A', cover_url: '', rating: null },
      reading_date: '2025-01-01',
    }];
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('recent-reads')).toBeTruthy();
  });

  it('shows PagesReadRanking when friendsPagesRead has entries', () => {
    mockFriendsPagesRead = [{ user: 'A', pages: 120 }, { user: 'B', pages: 80 }];
    const { getByTestId } = render(<HomeScreen />);
    expect(getByTestId('pages-ranking')).toBeTruthy();
  });
});
