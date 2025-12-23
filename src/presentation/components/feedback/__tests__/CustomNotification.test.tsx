import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CustomNotification } from '../CustomNotification';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
  useTheme: () => ({
    colors: {
      notification: '#333',
    },
  }),
}));

// mock Animated
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  return RN;
});

describe('CustomNotification', () => {
  const defaultProps = {
    message: 'Test message',
    duration: 1000,
    onClose: jest.fn(),
    onAccept: undefined,
    position: 'top' as 'top' | 'bottom',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<CustomNotification {...defaultProps} />);
    expect(getByText('Test message')).toBeTruthy();
    expect(getByText('✕')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const { getByText } = render(<CustomNotification {...defaultProps} />);
    fireEvent.press(getByText('✕'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('renders accept button when onAccept is provided', () => {
    const props = { ...defaultProps, onAccept: jest.fn() };
    const { getByText } = render(<CustomNotification {...props} />);
    expect(getByText('✓')).toBeTruthy();
  });

  it('calls onAccept when accept button is pressed', () => {
    const props = { ...defaultProps, onAccept: jest.fn() };
    const { getByText } = render(<CustomNotification {...props} />);
    fireEvent.press(getByText('✓'));
    expect(props.onAccept).toHaveBeenCalled();
  });

  it('calls onClose after duration if no onAccept', async () => {
    const props = { ...defaultProps, duration: 100 };
    render(<CustomNotification {...props} />);
    await waitFor(() => expect(props.onClose).toHaveBeenCalled(), { timeout: 200 });
  });

  it('does not auto-close if onAccept is provided', async () => {
    const props = { ...defaultProps, onAccept: jest.fn(), duration: 100 };
    render(<CustomNotification {...props} />);
    await new Promise(resolve => setTimeout(resolve, 200));
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it('renders at bottom position', () => {
    const props = { ...defaultProps, position: 'bottom' as 'top' | 'bottom' };
    const { getByText } = render(<CustomNotification {...props} />);
    expect(getByText('Test message')).toBeTruthy();
  });
});
