/* eslint-disable @typescript-eslint/no-shadow */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeSelectorMenu } from '../ThemeSelectorMenu';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      primary: '#06B3DC',
      card: '#fff',
      text: '#111',
    },
  }),
}));

// mock useThemeMode
jest.mock('../../../context/ThemeContext', () => ({
  useThemeMode: jest.fn(),
}));

// mock Animated
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  RN.Animated.parallel = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  return RN;
});

// mock CustomMenuButton
jest.mock('../../pressables/CustomMenuButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    CustomMenuButton: (props: any) =>
      React.createElement(Pressable, {
        testID: `menu-button-${props.label.replace(' ', '-').toLowerCase()}`,
        onPress: props.onPress,
        disabled: props.disabled,
      }, React.createElement(Text, null, props.label)),
  };
});

describe('ThemeSelectorMenu', () => {
  const mockSetThemeMode = jest.fn();
  const mockOnClose = jest.fn();
  const mockUseThemeMode = require('../../../context/ThemeContext').useThemeMode;

  beforeEach(() => {
    mockUseThemeMode.mockReturnValue({ themeMode: 'light', setThemeMode: mockSetThemeMode });
    mockSetThemeMode.mockClear();
    mockOnClose.mockClear();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(<ThemeSelectorMenu onClose={mockOnClose} />);
    expect(getByTestId('menu-button-tema-claro')).toBeTruthy();
    expect(getByTestId('menu-button-tema-oscuro')).toBeTruthy();
    expect(getByTestId('menu-button-según-sistema')).toBeTruthy();
  });

  it('calls setThemeMode and onClose when light theme is selected', () => {
    const { getByTestId } = render(<ThemeSelectorMenu onClose={mockOnClose} />);
    const button = getByTestId('menu-button-tema-claro');
    fireEvent.press(button);
    expect(mockSetThemeMode).toHaveBeenCalledWith('light');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls setThemeMode and onClose when dark theme is selected', () => {
    const { getByTestId } = render(<ThemeSelectorMenu onClose={mockOnClose} />);
    const button = getByTestId('menu-button-tema-oscuro');
    fireEvent.press(button);
    expect(mockSetThemeMode).toHaveBeenCalledWith('dark');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls setThemeMode and onClose when system theme is selected', () => {
    const { getByTestId } = render(<ThemeSelectorMenu onClose={mockOnClose} />);
    const button = getByTestId('menu-button-según-sistema');
    fireEvent.press(button);
    expect(mockSetThemeMode).toHaveBeenCalledWith('system');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('disables current theme button', () => {
    const { getByTestId } = render(<ThemeSelectorMenu onClose={mockOnClose} />);
    const button = getByTestId('menu-button-tema-claro');
    expect(button.props.disabled).toBe(true);
  });
});
