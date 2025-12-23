/* eslint-disable @typescript-eslint/no-shadow */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GoogleAuthButton } from '../GoogleAuthButton';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
      card: '#fff',
      cardPressed: '#f0f0f0',
      text: '#111',
      shadow: '#000',
    },
  }),
}));

// mock IonIcon
jest.mock('../../icons/IonIcon', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    IonIcon: (props: any) =>
      React.createElement(View, { testID: `ion-icon-${props.name}` }),
  };
});

describe('GoogleAuthButton', () => {
  const defaultProps = {
    onPress: jest.fn(),
  };

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(<GoogleAuthButton {...defaultProps} />);
    expect(getByText('Entrar con Google')).toBeTruthy();
    expect(getByTestId('ion-icon-logo-google')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(<GoogleAuthButton {...defaultProps} />);
    fireEvent.press(getByText('Entrar con Google'));
    expect(defaultProps.onPress).toHaveBeenCalled();
  });

  it('renders as disabled', () => {
    const props = { ...defaultProps, disabled: true };
    expect(() => render(<GoogleAuthButton {...props} />)).not.toThrow();
  });
});
