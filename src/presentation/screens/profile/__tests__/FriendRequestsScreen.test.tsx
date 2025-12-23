/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
      primaryDark: '#0489A8',
      card: '#fff',
      cardPressed: '#f0f0f0',
      text: '#111',
      grey: '#ccc',
      greyDark: '#999',
      greyLight: '#eee',
      shadow: '#000',
    },
  }),
}));

// mock useProfile with configurable friendRequests
const mockRefetchFriendRequests = jest.fn();
let mockFriendRequests: any[] = [];
jest.mock('../../../hooks/useProfile', () => ({
  useProfile: jest.fn(),
}));

// mock use-cases
const mockGetFriendsByRequests = jest.fn();
jest.mock('../../../../core/use-cases/user/get-friends-by-request.use-case', () => ({
  getFriendsByRequests: (...args: any[]) => mockGetFriendsByRequests(...args),
}));

const mockDeleteFriend = jest.fn();
jest.mock('../../../../core/use-cases/user/delete-friend.use-case', () => ({
  deleteFriend: (...args: any[]) => mockDeleteFriend(...args),
}));

const mockHandleRequest = jest.fn();
jest.mock('../../../../core/use-cases/user/handle-request.use-case', () => ({
  handleRequest: (...args: any[]) => mockHandleRequest(...args),
}));

// mock UserCard
jest.mock('../../../components/profile/UserCard', () => {
  const React = require('react');
  const { Pressable, View, Text } = require('react-native');
  return {
    UserCard: (props: any) =>
      React.createElement(View, { testID: `user-card-${props.nickname}` },
        React.createElement(Text, null, props.nickname),
        React.createElement(Text, null, props.name),
        React.createElement(Pressable, { testID: `right-button-${props.nickname}`, onPress: props.onRightButtonPress },
          React.createElement(Text, null, 'right')),
        props.onRejectRequest ? React.createElement(Pressable, { testID: `reject-button-${props.nickname}`, onPress: props.onRejectRequest },
          React.createElement(Text, null, 'reject')) : null
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

jest.mock('../../../components/icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    IonIcon: (props: any) =>
      React.createElement(View, { testID: 'big-icon' }),
  };
});

import { FriendRequestsScreen } from '../FriendRequestsScreen';

describe('FriendRequestsScreen', () => {
  beforeEach(() => {
    // reset mocks
    mockRefetchFriendRequests.mockClear();
    mockGetFriendsByRequests.mockClear();
    mockDeleteFriend.mockClear();
    mockHandleRequest.mockClear();
    mockFriendRequests = [];
    // get the mocked useProfile
    const { useProfile } = require('../../../hooks/useProfile');
    // default mock for useProfile (empty, overridden in tests that need data)
    useProfile.mockReturnValue({
      friendRequests: mockFriendRequests,
      refetchFriendRequests: mockRefetchFriendRequests,
    });
  });

  it('renders correctly with initial state and shows loader', () => {
    mockGetFriendsByRequests.mockResolvedValue([]);
    const { getByTestId } = render(<FriendRequestsScreen />);
    expect(getByTestId('full-screen-loader')).toBeTruthy();
  });

  it('displays received and sent requests after loading', async () => {
    const receivedUser = { user: { id: '1', nickname: 'receiver', full_name: 'Receiver User', avatarUrl: '' }, request: 'received', accepted: false };
    const sentUser = { user: { id: '2', nickname: 'sender', full_name: 'Sender User', avatarUrl: '' }, request: 'sent', accepted: false };
    mockGetFriendsByRequests.mockResolvedValue([receivedUser, sentUser]);
    const { findByTestId } = render(<FriendRequestsScreen />);
    const receivedCard = await findByTestId('user-card-receiver');
    const sentCard = await findByTestId('user-card-sender');
    expect(receivedCard).toBeTruthy();
    expect(sentCard).toBeTruthy();
  });

  it('handles accept received request', async () => {
    const receivedUser = { user: { id: '1', nickname: 'receiver', full_name: 'Receiver User', avatarUrl: '' }, request: 'received', accepted: false };
    mockGetFriendsByRequests.mockResolvedValue([receivedUser]);
    mockHandleRequest.mockResolvedValue(true);
    const { findByTestId } = render(<FriendRequestsScreen />);
    const rightButton = await findByTestId('right-button-receiver');
    act(() => {
      fireEvent.press(rightButton);
    });
    await waitFor(() => expect(mockHandleRequest).toHaveBeenCalledWith('1', true));
    expect(mockRefetchFriendRequests).toHaveBeenCalled();
  });

  it('handles reject received request', async () => {
    const receivedUser = { user: { id: '1', nickname: 'receiver', full_name: 'Receiver User', avatarUrl: '' }, request: 'received', accepted: false };
    mockGetFriendsByRequests.mockResolvedValue([receivedUser]);
    mockHandleRequest.mockResolvedValue(true);
    const { findByTestId } = render(<FriendRequestsScreen />);
    const rejectButton = await findByTestId('reject-button-receiver');
    act(() => {
      fireEvent.press(rejectButton);
    });
    await waitFor(() => expect(mockHandleRequest).toHaveBeenCalledWith('1', false));
    expect(mockRefetchFriendRequests).toHaveBeenCalled();
  });

  it('handles delete sent request', async () => {
    const sentUser = { user: { id: '2', nickname: 'sender', full_name: 'Sender User', avatarUrl: '' }, request: 'sent', accepted: false };
    mockGetFriendsByRequests.mockResolvedValue([sentUser]);
    mockDeleteFriend.mockResolvedValue(true);
    const { findByTestId } = render(<FriendRequestsScreen />);
    const rightButton = await findByTestId('right-button-sender');
    act(() => {
      fireEvent.press(rightButton);
    });
    await waitFor(() => expect(mockDeleteFriend).toHaveBeenCalledWith('2'));
    expect(mockRefetchFriendRequests).toHaveBeenCalled();
  });

  it('calls refetchFriendRequests on mount', () => {
    render(<FriendRequestsScreen />);
    expect(mockRefetchFriendRequests).toHaveBeenCalled();
  });
});
