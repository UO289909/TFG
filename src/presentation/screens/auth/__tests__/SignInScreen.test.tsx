import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInScreen } from '../SignInScreen';

// AuthContext mock
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    signIn: jest.fn().mockResolvedValue(true),
    loading: false,
  }),
}));

describe('SignInScreen', () => {
  it('renderiza los campos correctamente', () => {
    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    expect(getByPlaceholderText(/email/i)).toBeTruthy();
    expect(getByPlaceholderText(/contraseña/i)).toBeTruthy();
    expect(getByText(/iniciar sesión/i)).toBeTruthy();
  });

  it('muestra error si se intenta iniciar sin email o contraseña', async () => {
    const { getByText, queryByText } = render(<SignInScreen />);
    const button = getByText(/iniciar sesión/i);

    fireEvent.press(button);
    await waitFor(() => {
      expect(queryByText(/introduce tus credenciales/i)).toBeTruthy();
    });
  });

  it('llama a signIn con los datos correctos', async () => {
    const mockSignIn = jest.fn().mockResolvedValue(true);
    jest.doMock('../../../context/AuthContext', () => ({
      useAuth: () => ({
        signIn: mockSignIn,
        loading: false,
      }),
    }));

    const { getByPlaceholderText, getByText } = render(<SignInScreen />);
    const emailInput = getByPlaceholderText(/email/i);
    const passwordInput = getByPlaceholderText(/contraseña/i);

    fireEvent.changeText(emailInput, 'user@test.com');
    fireEvent.changeText(passwordInput, '123456');
    fireEvent.press(getByText(/iniciar sesión/i));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('user@test.com', '123456');
    });
  });
});
