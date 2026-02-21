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

// mock useNotification
const mockHideNotification = jest.fn();
const mockShowNotification = jest.fn();
let mockState = {
  visible: true,
  message: 'Test message',
  position: 'top' as 'top' | 'bottom',
  duration: 1000,
  onAccept: undefined as (() => void) | undefined,
  onClose: undefined as (() => void) | undefined,
};

jest.mock('../../../../presentation/context/NotificationContext', () => ({
  useNotification: () => ({
    state: mockState,
    showNotification: mockShowNotification,
    hideNotification: mockHideNotification,
  }),
}));

describe('CustomNotification', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      visible: true,
      message: 'Test message',
      position: 'top',
      duration: 1000,
      onAccept: undefined,
      onClose: undefined,
    };
  });

  it('renders correctly when visible', () => {
    const { getByText } = render(<CustomNotification />);
    expect(getByText('Test message')).toBeTruthy();
    expect(getByText('✕')).toBeTruthy();
  });

  it('returns null when not visible', () => {
    mockState = { ...mockState, visible: false };
    const { queryByText } = render(<CustomNotification />);
    expect(queryByText('Test message')).toBeNull();
  });

  it('calls hideNotification when close button is pressed', () => {
    const { getByText } = render(<CustomNotification />);
    fireEvent.press(getByText('✕'));
    expect(mockHideNotification).toHaveBeenCalled();
  });

  it('renders accept button when onAccept is provided', () => {
    mockState = { ...mockState, onAccept: jest.fn() };
    const { getByText } = render(<CustomNotification />);
    expect(getByText('✓')).toBeTruthy();
  });

  it('calls onAccept when accept button is pressed', () => {
    const onAccept = jest.fn();
    mockState = { ...mockState, onAccept };
    const { getByText } = render(<CustomNotification />);
    fireEvent.press(getByText('✓'));
    expect(onAccept).toHaveBeenCalled();
  });

  it('calls hideNotification after duration if no onAccept', async () => {
    mockState = { ...mockState, duration: 100 };
    render(<CustomNotification />);
    await waitFor(() => expect(mockHideNotification).toHaveBeenCalled(), { timeout: 200 });
  });

  it('does not auto-close if onAccept is provided', async () => {
    mockState = { ...mockState, onAccept: jest.fn(), duration: 100 };
    render(<CustomNotification />);
    await new Promise(resolve => setTimeout(resolve, 200));
    expect(mockHideNotification).not.toHaveBeenCalled();
  });

  it('renders at bottom position', () => {
    mockState = { ...mockState, position: 'bottom' };
    const { getByText } = render(<CustomNotification />);
    expect(getByText('Test message')).toBeTruthy();
  });
});
