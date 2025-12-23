/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockRefetchFriendRequests = jest.fn();
const mockGetFriendsByRequests = jest.fn();
const mockDeleteFriend = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useTheme: () => ({ colors: { primary: '#00f', shadow: '#000', greyLight: '#ccc', grey: '#999' } }),
  };
});

// change useProfile mock to jest.fn() so it can be overridden per test
jest.mock('../../../hooks/useProfile', () => ({
  useProfile: jest.fn(),
}));

// mock use-cases
jest.mock('../../../../core/use-cases/user/get-friends-by-request.use-case', () => ({
  getFriendsByRequests: (...args: any[]) => mockGetFriendsByRequests(...args),
}));
jest.mock('../../../../core/use-cases/user/delete-friend.use-case', () => ({
  deleteFriend: (...args: any[]) => mockDeleteFriend(...args),
}));

// mock SearchBar (index) used by the screen
jest.mock('../../../components/inputs', () => {
  const React = require('react');
  const { TextInput, Pressable, Text, View } = require('react-native');
  return {
    SearchBar: (props: any) =>
      React.createElement(
        View,
        null,
        React.createElement(TextInput, {
          testID: 'search-input',
          value: '',
          onChangeText: (t: any) => props.onSearch?.(t),
          placeholder: props.placeholder ?? 'search',
        }),
        React.createElement(Pressable, {
          testID: 'search-btn',
          onPress: () => props.onSearch?.(''),
        }, React.createElement(Text, null, 'search'))
      ),
  };
});

// mock UserCard
jest.mock('../../../components/profile/UserCard', () => {
  const React = require('react');
  const { Pressable, View, Text } = require('react-native');
  return {
    UserCard: (props: any) =>
      React.createElement(View, { testID: `user-${props.nickname}` },
        React.createElement(Text, null, props.nickname),
        React.createElement(Pressable, { testID: `right-${props.nickname}`, onPress: props.onRightButtonPress },
          React.createElement(Text, null, 'right'))
      ),
  };
});

// mock feedback module (export both FullScreenLoader and CustomNotification)
jest.mock('../../../components/feedback', () => {
  const React = require('react');
  const RN = require('react-native');
  const { View, Text, Pressable, ActivityIndicator } = RN;

  return {
    FullScreenLoader: () => React.createElement(View, { testID: 'full-screen-loader' }, React.createElement(ActivityIndicator, null)),
    CustomNotification: (props: any) =>
      React.createElement(View, { testID: 'custom-notif' },
        React.createElement(Text, null, props.message),
        props.onClose ? React.createElement(Pressable, { testID: 'notif-close', onPress: props.onClose }, React.createElement(Text, null, 'close')) : null
      ),
  };
});

import { FriendsScreen } from '../FriendsScreen';

describe('FriendsScreen', () => {
  beforeAll(() => {
    // silence the specific act warning for this test suite
    const originalConsoleError = console.error;
    jest.spyOn(console, 'error').mockImplementation((message) => {
      if (message.includes('An update to FriendsScreen inside a test was not wrapped in act(...)')) {
        return;
      }
      originalConsoleError(message);
    });
  });

  afterAll(() => {
    // restore console.error
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    // reset mocks
    mockRefetchFriendRequests.mockClear();
    mockGetFriendsByRequests.mockClear();
    mockDeleteFriend.mockClear();
    // get the mocked useProfile
    const { useProfile } = require('../../../hooks/useProfile');
    // default mock for useProfile (empty, overridden in tests that need data)
    useProfile.mockReturnValue({
      friendRequests: [],
      refetchFriendRequests: mockRefetchFriendRequests,
    });
  });

  it('shows empty state when there are no friends', async () => {
    // override mocks for empty state
    const { useProfile } = require('../../../hooks/useProfile');
    useProfile.mockReturnValue({
      friendRequests: [],
      refetchFriendRequests: mockRefetchFriendRequests,
    });
    mockGetFriendsByRequests.mockResolvedValue([]);

    const renderResult = render(<FriendsScreen />);
    const { findByText } = renderResult;
    await waitFor(() => expect(mockGetFriendsByRequests).toHaveBeenCalled());
    expect(await findByText(/No tienes amigos aun/i)).toBeTruthy();
  });

  it('renders friends list when getFriendsByRequests returns users', async () => {
    const fetched = [{ user: { id: 'u1', nickname: 'nick1', full_name: 'Full One', avatarUrl: '' } }];
    // override mocks for this test
    const { useProfile } = require('../../../hooks/useProfile');
    useProfile.mockReturnValue({
      friendRequests: [
        { id: 'fr1', user: { id: 'u1', nickname: 'nick1', full_name: 'Full One', avatarUrl: '' } },
      ],
      refetchFriendRequests: mockRefetchFriendRequests,
    });
    mockGetFriendsByRequests.mockResolvedValue(fetched);

    const renderResult = render(<FriendsScreen />);
    const { findByTestId } = renderResult;
    await waitFor(() => expect(mockGetFriendsByRequests).toHaveBeenCalled());
    const userCard = await findByTestId('user-nick1');
    expect(userCard).toBeTruthy();
  });

  it('shows notification when filter yields no matches', async () => {
    const fetched = [
      { user: { id: 'u1', nickname: 'juan', full_name: 'Juan Perez', avatarUrl: '' } },
    ];
    // override mocks for this test
    const { useProfile } = require('../../../hooks/useProfile');
    useProfile.mockReturnValue({
      friendRequests: [
        { id: 'fr1', user: { id: 'u1', nickname: 'juan', full_name: 'Juan Perez', avatarUrl: '' } },
      ],
      refetchFriendRequests: mockRefetchFriendRequests,
    });
    mockGetFriendsByRequests.mockResolvedValue(fetched);

    const renderResult = render(<FriendsScreen />);
    const { findByTestId, getByTestId, findByText } = renderResult;
    await waitFor(() => expect(mockGetFriendsByRequests).toHaveBeenCalled());
    await findByTestId('user-juan');
    // simulate search with non-matching text
    fireEvent.changeText(getByTestId('search-input'), 'nomatch');
    // notification should appear
    expect(await findByText(/No tienes amigos que coincidan con la busqueda/i)).toBeTruthy();
  });

  it('deletes friend and calls refetchFriendRequests', async () => {
    const fetched = [
      { user: { id: 'u1', nickname: 'delme', full_name: 'To Delete', avatarUrl: '' } },
    ];
    // override mocks for this test
    const { useProfile } = require('../../../hooks/useProfile');
    useProfile.mockReturnValue({
      friendRequests: [
        { id: 'fr1', user: { id: 'u1', nickname: 'delme', full_name: 'To Delete', avatarUrl: '' } },
      ],
      refetchFriendRequests: mockRefetchFriendRequests,
    });
    mockGetFriendsByRequests.mockResolvedValue(fetched);
    mockDeleteFriend.mockResolvedValue(undefined);

    const renderResult = render(<FriendsScreen />);
    const { findByTestId, queryByTestId } = renderResult;
    await waitFor(() => expect(mockGetFriendsByRequests).toHaveBeenCalled());
    const card = await findByTestId('user-delme');
    expect(card).toBeTruthy();
    // press delete (right button)
    fireEvent.press(await findByTestId('right-delme'));
    await waitFor(() => expect(mockDeleteFriend).toHaveBeenCalledWith('u1'));
    await waitFor(() => expect(mockRefetchFriendRequests).toHaveBeenCalled());
    await waitFor(() => expect(queryByTestId('user-delme')).toBeNull());
  });
});
