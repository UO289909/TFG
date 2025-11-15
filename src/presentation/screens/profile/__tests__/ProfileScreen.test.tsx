/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

const mockNavigate = jest.fn();
const mockSetParams = jest.fn();
const mockRefetch = jest.fn();
const mockRefetchProfile = jest.fn();
const mockChangeAvatar = jest.fn();
const mockSignOut = jest.fn();
const mockSendNonceCode = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate, setParams: mockSetParams }),
    useRoute: () => ({ params: {} }),
    useTheme: () => ({ colors: { primary: '#00f', shadow: '#000', card: '#fff', text: '#000' } }),
  };
});

jest.mock('../../../../core/use-cases/profile/use-profile', () => ({}), { virtual: true });

jest.mock('../../../hooks/useProfile', () => ({
  useProfile: () => ({
    isLoading: false,
    isLoadingProfile: false,
    isLoadingFriendRequests: false,
    myProfile: { nickname: 'me', full_name: 'Full Name', avatarUrl: '' },
    refetch: mockRefetch,
    refetchProfile: mockRefetchProfile,
    changeAvatar: mockChangeAvatar,
  }),
}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    signOut: mockSignOut,
    sendNonceCode: mockSendNonceCode,
    loading: false,
  }),
}));

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

jest.mock('../../../components/profile', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    ProfileInfoHeader: (props: any) =>
      React.createElement(View, { testID: 'profile-header' }, React.createElement(Text, null, props.nickname)),
    ThemeSelectorMenu: (props: any) =>
      React.createElement(View, { testID: 'theme-selector' }),
  };
});

jest.mock('../../../components/pressables/CustomMenuButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    CustomMenuButton: (props: any) =>
      React.createElement(Pressable, { testID: `btn-${props.label}`, onPress: props.onPress, disabled: props.disabled },
        React.createElement(Text, null, props.label)
      ),
  };
});

jest.mock('../../../components/feedback', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');
  return {
    CustomNotification: (props: any) =>
      React.createElement(View, { testID: 'custom-notif' },
        React.createElement(Text, null, props.message),
        props.onAccept ? React.createElement(Pressable, { testID: 'notif-accept', onPress: props.onAccept }, React.createElement(Text, null, 'accept')) : null,
        props.onClose ? React.createElement(Pressable, { testID: 'notif-close', onPress: props.onClose }, React.createElement(Text, null, 'close')) : null
      ),
  };
});

// mock image picker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

import { launchImageLibrary } from 'react-native-image-picker';
import { ProfileScreen } from '../ProfileScreen';

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // defaults
    mockSendNonceCode.mockReset();
    (launchImageLibrary as jest.Mock).mockReset();
  });

  it('change password navigates with alreadySentCode=false on success', async () => {
    mockSendNonceCode.mockResolvedValueOnce(undefined);
    const { getByTestId } = render(<ProfileScreen />);
    fireEvent.press(getByTestId('btn-Cambiar contraseña'));
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('PasswordChange', { alreadySentCode: false, notifPosition: 'bottom' })
    );
  });

  it('change password navigates with alreadySentCode=true on failure', async () => {
    mockSendNonceCode.mockRejectedValueOnce(new Error('fail'));
    const { getByTestId } = render(<ProfileScreen />);
    fireEvent.press(getByTestId('btn-Cambiar contraseña'));
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('PasswordChange', { alreadySentCode: true, notifPosition: 'bottom' })
    );
  });

  it('change avatar calls image picker, changeAvatar and refetchProfile', async () => {
    (launchImageLibrary as jest.Mock).mockResolvedValueOnce({ assets: [{ uri: 'file://pic' }], didCancel: false });
    const { getByTestId } = render(<ProfileScreen />);
    fireEvent.press(getByTestId('btn-Cambiar foto de avatar'));
    await waitFor(() => {
      expect(launchImageLibrary).toHaveBeenCalled();
      expect(mockChangeAvatar).toHaveBeenCalledWith('file://pic');
      expect(mockRefetchProfile).toHaveBeenCalled();
    });
  });

  it('sign out flow shows notification and calls signOut on accept', () => {
    const { getByTestId } = render(<ProfileScreen />);
    fireEvent.press(getByTestId('btn-Cerrar sesión'));
    expect(getByTestId('custom-notif')).toBeTruthy();
    fireEvent.press(getByTestId('notif-accept'));
    expect(mockSignOut).toHaveBeenCalled();
  });
});
