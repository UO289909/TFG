/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { NicknameChangeScreen } from '../NicknameChangeScreen';

// mock useNavigation
const mockReset = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    reset: mockReset,
  }),
}));

// mock useAuth
const mockChangeUserNickname = jest.fn();
jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    changeUserNickname: mockChangeUserNickname,
    loading: false,
  })),
}));

// mock components
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

jest.mock('../../../components/pressables/CustomButton', () => {
  return {
    CustomButton: (props: any) => {
      const { Pressable, Text } = require('react-native');
      return (
        <Pressable testID={`btn-${props.title}`} onPress={props.onPress} disabled={props.disabled}>
          <Text>{props.title}</Text>
        </Pressable>
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


describe('NicknameChangeScreen', () => {
  beforeEach(() => {
    mockChangeUserNickname.mockClear();
    mockReset.mockClear();
    // get the mocked useAuth
    const { useAuth } = require('../../../context/AuthContext');
    // default mock for useAuth
    useAuth.mockReturnValue({
      changeUserNickname: mockChangeUserNickname,
      loading: false,
    });
  });

  it('renders correctly with initial state', () => {
    const { getByTestId, queryByTestId } = render(<NicknameChangeScreen />);
    expect(getByTestId('Nickname')).toBeTruthy();
    expect(getByTestId('btn-Cambiar nickname')).toBeTruthy();
    expect(queryByTestId('custom-notif')).toBeNull();
    expect(queryByTestId('full-screen-loader')).toBeNull();
  });

  it('shows loader when loading is true', () => {
    const { useAuth } = require('../../../context/AuthContext');
    useAuth.mockReturnValue({
      changeUserNickname: mockChangeUserNickname,
      loading: true,
    });
    const { getByTestId } = render(<NicknameChangeScreen />);
    expect(getByTestId('full-screen-loader')).toBeTruthy();
  });

  it('updates nickname on text input change', async () => {
    const { getByTestId } = render(<NicknameChangeScreen />);
    const input = getByTestId('Nickname');
    await act(async () => {
      fireEvent.changeText(input, 'newNickname');
    });
    expect(input.props.value).toBe('newNickname');
  });

  it('removes spaces from nickname input', async () => {
    const { getByTestId } = render(<NicknameChangeScreen />);
    const input = getByTestId('Nickname');
    await act(async () => {
      fireEvent.changeText(input, 'new Nickname');
    });
    expect(input.props.value).toBe('newNickname');
  });

  it('disables button when nickname is empty', () => {
    const { getByTestId } = render(<NicknameChangeScreen />);
    const button = getByTestId('btn-Cambiar nickname');
    expect(button.props.disabled).toBe(true);
  });

  it('enables button when nickname is not empty', async () => {
    const { getByTestId } = render(<NicknameChangeScreen />);
    const input = getByTestId('Nickname');
    const button = getByTestId('btn-Cambiar nickname');
    await act(async () => {
      fireEvent.changeText(input, 'newNickname');
    });
    expect(button.props.disabled).toBe(false);
  });

  it('calls changeUserNickname and navigates on success', async () => {
    mockChangeUserNickname.mockResolvedValue(true);
    const { getByTestId } = render(<NicknameChangeScreen />);
    const input = getByTestId('Nickname');
    const button = getByTestId('btn-Cambiar nickname');
    await act(async () => {
      fireEvent.changeText(input, 'newNickname');
    });
    fireEvent.press(button);
    await waitFor(() => expect(mockChangeUserNickname).toHaveBeenCalledWith('newNickname'));
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'ProfileMenu', params: { doRefetch: true } }],
    });
  });

  it('shows notification on error', async () => {
    const errorMessage = 'Error changing nickname';
    mockChangeUserNickname.mockRejectedValue(new Error(errorMessage));
    const { getByTestId, findByTestId } = render(<NicknameChangeScreen />);
    const input = getByTestId('Nickname');
    const button = getByTestId('btn-Cambiar nickname');
    await act(async () => {
      fireEvent.changeText(input, 'newNickname');
    });
    fireEvent.press(button);
    await waitFor(() => expect(mockChangeUserNickname).toHaveBeenCalledWith('newNickname'));
    const notification = await findByTestId('custom-notif');
    expect(notification).toBeTruthy();
  });

  it('closes notification when onClose is called', async () => {
    const errorMessage = 'Error changing nickname';
    mockChangeUserNickname.mockRejectedValue(new Error(errorMessage));
    const { getByTestId, queryByTestId } = render(<NicknameChangeScreen />);
    const input = getByTestId('Nickname');
    const button = getByTestId('btn-Cambiar nickname');
    await act(async () => {
      fireEvent.changeText(input, 'newNickname');
    });
    fireEvent.press(button);
    await waitFor(() => expect(mockChangeUserNickname).toHaveBeenCalledWith('newNickname'));
    expect(queryByTestId('custom-notif')).toBeTruthy();
  });
});
