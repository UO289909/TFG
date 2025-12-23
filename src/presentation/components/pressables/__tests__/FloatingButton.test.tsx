/* eslint-disable @typescript-eslint/no-shadow */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FloatingButton } from '../FloatingButton';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
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

describe('FloatingButton', () => {
  const defaultProps = {
    onPress: jest.fn(),
    icon: 'add' as any,
    position: 'bottom-right' as 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left',
    color: '#06B3DC',
  };

  it('renders correctly', () => {
    const { getByTestId } = render(<FloatingButton {...defaultProps} />);
    expect(getByTestId('ion-icon-add')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(<FloatingButton {...defaultProps} />);
    const button = getByTestId('ion-icon-add').parent;
    expect(button).toBeTruthy();
    fireEvent.press(button!);
    expect(defaultProps.onPress).toHaveBeenCalled();
  });

  it('renders with different shape', () => {
    const props = { ...defaultProps, shape: 'round' as 'default' | 'round' };
    expect(() => render(<FloatingButton {...props} />)).not.toThrow();
  });

  it('renders with different size', () => {
    const props = { ...defaultProps, size: 'large' as 'large' | 'small' };
    expect(() => render(<FloatingButton {...props} />)).not.toThrow();
  });

  it('renders with different position', () => {
    const props = { ...defaultProps, position: 'top-left' as 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'top-left' };
    expect(() => render(<FloatingButton {...props} />)).not.toThrow();
  });

  it('renders as disabled', () => {
    const props = { ...defaultProps, disabled: true };
    expect(() => render(<FloatingButton {...props} />)).not.toThrow();
  });
});
