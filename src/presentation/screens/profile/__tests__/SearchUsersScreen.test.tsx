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
const mockSearchUsersByNickname = jest.fn();
jest.mock('../../../../core/use-cases/user/search-users-by-nickname.use-case', () => ({
  searchUsersByNickname: (...args: any[]) => mockSearchUsersByNickname(...args),
}));

const mockDeleteFriend = jest.fn();
jest.mock('../../../../core/use-cases/user/delete-friend.use-case', () => ({
  deleteFriend: (...args: any[]) => mockDeleteFriend(...args),
}));

const mockHandleRequest = jest.fn();
jest.mock('../../../../core/use-cases/user/handle-request.use-case', () => ({
  handleRequest: (...args: any[]) => mockHandleRequest(...args),
}));

const mockSendRequest = jest.fn();
jest.mock('../../../../core/use-cases/user/send-request.use-case', () => ({
  sendRequest: (...args: any[]) => mockSendRequest(...args),
}));

// mock normalizeText
jest.mock('../../../../utils/normalizeText', () => ({
  normalizeText: jest.fn((text) => text),
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
          testID: 'search-bar',
          value: '',
          onChangeText: (t: any) => props.onSearch?.(t),
          placeholder: props.placeholder ?? 'search',
          editable: !props.disabled,
        }),
        React.createElement(Pressable, {
          testID: 'search-button',
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

import { SearchUsersScreen } from '../SearchUsersScreen';

describe('SearchUsersScreen', () => {
  beforeEach(() => {
    // reset mocks
    mockRefetchFriendRequests.mockClear();
    mockSearchUsersByNickname.mockClear();
    mockDeleteFriend.mockClear();
    mockHandleRequest.mockClear();
    mockSendRequest.mockClear();
    mockFriendRequests = [];
    // get the mocked useProfile
    const { useProfile } = require('../../../hooks/useProfile');
    // default mock for useProfile (empty, overridden in tests that need data)
    useProfile.mockReturnValue({
      friendRequests: mockFriendRequests,
      refetchFriendRequests: mockRefetchFriendRequests,
    });
  });

  it('renders correctly with initial state', () => {
    const { getByTestId, queryByTestId } = render(<SearchUsersScreen />);
    expect(getByTestId('search-bar')).toBeTruthy();
    expect(queryByTestId('custom-notif')).toBeNull();
    expect(queryByTestId('full-screen-loader')).toBeNull();
    expect(getByTestId('big-icon')).toBeTruthy();
  });

  it('shows loader when loading is true', async () => {
    mockSearchUsersByNickname.mockResolvedValue([]);
    const { getByTestId } = render(<SearchUsersScreen />);
    const searchBar = getByTestId('search-bar');
    act(() => {
      fireEvent.changeText(searchBar, 'test');
    });
    expect(getByTestId('full-screen-loader')).toBeTruthy();
  });

  it('searches users and displays results', async () => {
    const mockUser = { id: '1', nickname: 'testuser', full_name: 'Test User', avatarUrl: '' };
    mockSearchUsersByNickname.mockResolvedValue([mockUser]);
    const { getByTestId, findByTestId } = render(<SearchUsersScreen />);
    const searchBar = getByTestId('search-bar');
    act(() => {
      fireEvent.changeText(searchBar, 'test');
    });
    await waitFor(() => expect(mockSearchUsersByNickname).toHaveBeenCalledWith('test'));
    const userCard = await findByTestId('user-card-testuser');
    expect(userCard).toBeTruthy();
  });

  it('shows notification when no users found', async () => {
    mockSearchUsersByNickname.mockResolvedValue([]);
    const { getByTestId, findByTestId } = render(<SearchUsersScreen />);
    const searchBar = getByTestId('search-bar');
    act(() => {
      fireEvent.changeText(searchBar, 'test');
    });
    await waitFor(() => expect(mockSearchUsersByNickname).toHaveBeenCalledWith('test'));
    const notification = await findByTestId('custom-notif');
    expect(notification).toBeTruthy();
  });

  it('handles send request', async () => {
    const mockUser = { id: '1', nickname: 'testuser', full_name: 'Test User', avatarUrl: '' };
    mockSearchUsersByNickname.mockResolvedValue([mockUser]);
    mockSendRequest.mockResolvedValue(true);
    const { getByTestId, findByTestId } = render(<SearchUsersScreen />);
    const searchBar = getByTestId('search-bar');
    act(() => {
      fireEvent.changeText(searchBar, 'test');
    });
    await waitFor(() => expect(mockSearchUsersByNickname).toHaveBeenCalledWith('test'));
    const rightButton = await findByTestId('right-button-testuser');
    act(() => {
      fireEvent.press(rightButton);
    });
    await waitFor(() => expect(mockSendRequest).toHaveBeenCalledWith('1'));
  });

  it('handles delete friend', async () => {
    const mockUser = { id: '1', nickname: 'testuser', full_name: 'Test User', avatarUrl: '' };
    mockSearchUsersByNickname.mockResolvedValue([mockUser]);
    mockFriendRequests = [{ sender: '1', receiver: 'current', accepted: true }];
    mockDeleteFriend.mockResolvedValue(true);
    const { useProfile } = require('../../../hooks/useProfile');
    useProfile.mockReturnValue({
      friendRequests: mockFriendRequests,
      refetchFriendRequests: mockRefetchFriendRequests,
    });
    const { getByTestId, findByTestId } = render(<SearchUsersScreen />);
    const searchBar = getByTestId('search-bar');
    act(() => {
      fireEvent.changeText(searchBar, 'test');
    });
    await waitFor(() => expect(mockSearchUsersByNickname).toHaveBeenCalledWith('test'));
    const rightButton = await findByTestId('right-button-testuser');
    act(() => {
      fireEvent.press(rightButton);
    });
    await waitFor(() => expect(mockDeleteFriend).toHaveBeenCalledWith('1'));
  });

  it('handles accept request', async () => {
    const mockUser = { id: '1', nickname: 'testuser', full_name: 'Test User', avatarUrl: '' };
    mockSearchUsersByNickname.mockResolvedValue([mockUser]);
    mockFriendRequests = [{ sender: '1', receiver: 'current', accepted: false }];
    mockHandleRequest.mockResolvedValue(true);
    const { useProfile } = require('../../../hooks/useProfile');
    useProfile.mockReturnValue({
      friendRequests: mockFriendRequests,
      refetchFriendRequests: mockRefetchFriendRequests,
    });
    const { getByTestId, findByTestId } = render(<SearchUsersScreen />);
    const searchBar = getByTestId('search-bar');
    act(() => {
      fireEvent.changeText(searchBar, 'test');
    });
    await waitFor(() => expect(mockSearchUsersByNickname).toHaveBeenCalledWith('test'));
    const rightButton = await findByTestId('right-button-testuser');
    act(() => {
      fireEvent.press(rightButton);
    });
    await waitFor(() => expect(mockHandleRequest).toHaveBeenCalledWith('1', true));
  });

  it('handles reject request', async () => {
    const mockUser = { id: '1', nickname: 'testuser', full_name: 'Test User', avatarUrl: '' };
    mockSearchUsersByNickname.mockResolvedValue([mockUser]);
    mockFriendRequests = [{ sender: '1', receiver: 'current', accepted: false }];
    mockHandleRequest.mockResolvedValue(true);
    const { useProfile } = require('../../../hooks/useProfile');
    useProfile.mockReturnValue({
      friendRequests: mockFriendRequests,
      refetchFriendRequests: mockRefetchFriendRequests,
    });
    const { getByTestId, findByTestId } = render(<SearchUsersScreen />);
    const searchBar = getByTestId('search-bar');
    act(() => {
      fireEvent.changeText(searchBar, 'test');
    });
    await waitFor(() => expect(mockSearchUsersByNickname).toHaveBeenCalledWith('test'));
    const rejectButton = await findByTestId('reject-button-testuser');
    act(() => {
      fireEvent.press(rejectButton);
    });
    await waitFor(() => expect(mockHandleRequest).toHaveBeenCalledWith('1', false));
  });

  it('closes notification', async () => {
    mockSearchUsersByNickname.mockResolvedValue([]);
    const { getByTestId, findByTestId, queryByTestId } = render(<SearchUsersScreen />);
    const searchBar = getByTestId('search-bar');
    act(() => {
      fireEvent.changeText(searchBar, 'test');
    });
    await waitFor(() => expect(mockSearchUsersByNickname).toHaveBeenCalledWith('test'));
    const closeButton = await findByTestId('notif-close');
    act(() => {
      fireEvent.press(closeButton);
    });
    expect(queryByTestId('custom-notif')).toBeNull();
  });
});
