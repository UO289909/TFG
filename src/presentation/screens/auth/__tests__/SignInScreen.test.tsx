import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

const mockSignIn = jest.fn().mockResolvedValue(true);

jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    loading: false,
  }),
}));

import { SignInScreen } from '../SignInScreen';

describe('SignInScreen', () => {
  const renderWithNavigation = () => (
    render(
      <NavigationContainer>
        <SignInScreen />
      </NavigationContainer>
    )
  );

  it('renders fields and buttons correctly', () => {
    const { getByPlaceholderText, getAllByText } = renderWithNavigation();
    expect(getByPlaceholderText(/something@provider.com/i)).toBeTruthy();
    expect(getByPlaceholderText(/abcD5*/i)).toBeTruthy();
    const title = getAllByText(/Iniciar sesión/i);
    expect(title.length).toBeGreaterThan(1);
  });

  it('shows error if trying to sign in without email or password', async () => {
    const { UNSAFE_getAllByType, getByText } = renderWithNavigation();
    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    const button = pressables.find(p =>
      p.props.children?.props?.children?.toString().includes('Iniciar sesión')
    );
    fireEvent.press(button);
    await waitFor(() =>
      expect(getByText(/El correo electrónico no es válido/i)).toBeTruthy()
    );
  });

  it('calls signIn with the correct data', async () => {
    const { getByPlaceholderText, UNSAFE_getAllByType } = renderWithNavigation();
    const emailInput = getByPlaceholderText(/something@provider.com/i);
    const passwordInput = getByPlaceholderText(/abcD5*/i);

    fireEvent.changeText(emailInput, 'user@test.com');
    fireEvent.changeText(passwordInput, '123456');

    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    const button = pressables.find(p =>
      p.props.children?.props?.children?.toString().includes('Iniciar sesión')
    );

    fireEvent.press(button);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('user@test.com', '123456');
    });
  });
});
