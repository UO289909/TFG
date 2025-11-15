/* eslint-disable @typescript-eslint/no-shadow */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CustomIconButton } from '../CustomIconButton';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
      primaryDark: '#0489A8',
      buttonDisabled: '#ccc',
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

describe('CustomIconButton', () => {
  const defaultProps = {
    icon: 'add' as any,
    onPress: jest.fn(),
  };

  it('renders correctly', () => {
    const { getByTestId } = render(<CustomIconButton {...defaultProps} />);
    expect(getByTestId('ion-icon-add')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(<CustomIconButton {...defaultProps} />);
    const button = getByTestId('ion-icon-add').parent;
    expect(button).toBeTruthy();
    fireEvent.press(button!);
    expect(defaultProps.onPress).toHaveBeenCalled();
  });

  it('renders as disabled', () => {
    const props = { ...defaultProps, disabled: true };
    expect(() => render(<CustomIconButton {...props} />)).not.toThrow();
  });

  it('applies custom color', () => {
    const props = { ...defaultProps, color: '#ff0000' };
    expect(() => render(<CustomIconButton {...props} />)).not.toThrow();
  });

  it('applies custom style', () => {
    const props = { ...defaultProps, style: { marginTop: 20 } };
    expect(() => render(<CustomIconButton {...props} />)).not.toThrow();
  });
});
