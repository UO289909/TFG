/* eslint-disable @typescript-eslint/no-shadow */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { UserCard } from '../UserCard';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
      primaryDark: '#0489A8',
      card: '#fff',
      text: '#111',
      secondaryText: '#666',
      shadow: '#000',
      danger: '#ff0000',
      dangerDark: '#cc0000',
    },
  }),
}));

// mock CustomIconButton
jest.mock('../../pressables/CustomIconButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    CustomIconButton: (props: any) =>
      React.createElement(Pressable, {
        testID: `icon-button-${props.icon}`,
        onPress: props.onPress,
      }, React.createElement(Text, null, props.icon)),
  };
});

describe('UserCard', () => {
  const defaultProps = {
    nickname: 'TestUser',
    avatarUrl: 'https://example.com/avatar.jpg',
    name: 'Test Name',
    type: 'user' as 'user' | 'friend' | 'requestSent' | 'requestReceived',
    onRightButtonPress: jest.fn(),
    onRejectRequest: jest.fn(),
  };

  it('renders correctly for user type', () => {
    const { getByText, getByTestId } = render(<UserCard {...defaultProps} />);
    expect(getByText('TestUser')).toBeTruthy();
    expect(getByText('Test Name')).toBeTruthy();
    expect(getByTestId('icon-button-person-add-outline')).toBeTruthy();
  });

  it('renders correctly for friend type', () => {
    const props = { ...defaultProps, type: 'friend' as 'user' | 'friend' | 'requestSent' | 'requestReceived' };
    const { getByText, getByTestId } = render(<UserCard {...props} />);
    expect(getByText('¡Ya es tu amigo!')).toBeTruthy();
    expect(getByTestId('icon-button-person-remove-outline')).toBeTruthy();
  });

  it('renders correctly for requestSent type', () => {
    const props = { ...defaultProps, type: 'requestSent' as 'user' | 'friend' | 'requestSent' | 'requestReceived' };
    const { getByText, getByTestId } = render(<UserCard {...props} />);
    expect(getByText('Solicitud enviada')).toBeTruthy();
    expect(getByTestId('icon-button-close')).toBeTruthy();
  });

  it('renders correctly for requestReceived type', () => {
    const props = { ...defaultProps, type: 'requestReceived' as 'user' | 'friend' | 'requestSent' | 'requestReceived' };
    const { getByText, getByTestId } = render(<UserCard {...props} />);
    expect(getByText('Solicitud recibida')).toBeTruthy();
    expect(getByTestId('icon-button-checkmark-outline')).toBeTruthy();
    expect(getByTestId('icon-button-close')).toBeTruthy(); // reject button
  });

  it('calls onRightButtonPress when right button is pressed', () => {
    const { getByTestId } = render(<UserCard {...defaultProps} />);
    const button = getByTestId('icon-button-person-add-outline');
    fireEvent.press(button);
    expect(defaultProps.onRightButtonPress).toHaveBeenCalled();
  });

  it('calls onRejectRequest when reject button is pressed', () => {
    const props = { ...defaultProps, type: 'requestReceived' as 'user' | 'friend' | 'requestSent' | 'requestReceived' };
    const { getAllByTestId } = render(<UserCard {...props} />);
    const buttons = getAllByTestId('icon-button-close');
    const rejectButton = buttons[0]; // First close button is reject
    fireEvent.press(rejectButton);
    expect(defaultProps.onRejectRequest).toHaveBeenCalled();
  });

  it('renders with default avatar when avatarUrl is null', () => {
    const props = { ...defaultProps, avatarUrl: null };
    expect(() => render(<UserCard {...props} />)).not.toThrow();
  });
});
