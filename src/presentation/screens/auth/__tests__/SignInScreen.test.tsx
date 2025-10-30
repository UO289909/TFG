import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignInScreen } from '../SignInScreen';
import { FullScreenLoader } from '../../../components/feedback';

// Mocks
const mockAuth = {
  signIn: jest.fn().mockResolvedValue(true),
  signInWithGoogle: jest.fn().mockResolvedValue(true),
  loading: false,
};
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => mockAuth,
}));

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
  useNavigation: () => ({ navigate: jest.fn() }),
  useTheme: () => ({
    colors: { text: '#111', secondaryText: '#666' },
  }),
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate }),
    useTheme: () => ({
      colors: {
        text: '#111',
        secondaryText: '#666',
      },
    }),
  };
});

// Helper render
const renderWithNav = () =>
  render(
    <SignInScreen />
  );

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.signIn.mockResolvedValue(true);
    mockAuth.signInWithGoogle.mockResolvedValue(true);
    mockAuth.loading = false;
  });

  it('renders fields, title and buttons', () => {
    const { getByPlaceholderText, getAllByText } = renderWithNav();
    expect(getByPlaceholderText(/something@provider\.com/i)).toBeTruthy();
    expect(getByPlaceholderText(/abcD5\*/i)).toBeTruthy();
    expect(getAllByText(/Iniciar sesión/i).length).toBe(2);
    expect(getAllByText(/Entrar con Google/i).length).toBe(1);
    expect(getAllByText(/¿Has olvidado tu contraseña\?/i).length).toBe(1);
  });

  it('shows <FullScreenLoader /> when loading=true', () => {
    mockAuth.loading = true;
    const { UNSAFE_getByType } = renderWithNav();
    expect(UNSAFE_getByType(FullScreenLoader)).toBeTruthy();
  });

  it('does not call signIn and shows notification if email is invalid', async () => {
    const { getByPlaceholderText, getByText, UNSAFE_getAllByType } = renderWithNav();

    fireEvent.changeText(getByPlaceholderText(/something@provider\.com/i), 'no-email');
    fireEvent.changeText(getByPlaceholderText(/abcD5\*/i), '123456');

    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    const signInBtn = pressables.find(p =>
      p.props.children?.props?.children?.toString().includes('Iniciar sesión')
    )!;
    fireEvent.press(signInBtn);

    await waitFor(() => {
      expect(getByText(/El correo electrónico no es válido/i)).toBeTruthy();
      expect(mockAuth.signIn).not.toHaveBeenCalled();
    });
  });

  it('calls signIn with correct email/password (sanitizes spaces)', async () => {
    const { getByPlaceholderText, UNSAFE_getAllByType } = renderWithNav();

    fireEvent.changeText(getByPlaceholderText(/something@provider\.com/i), ' user @test.com ');
    fireEvent.changeText(getByPlaceholderText(/abcD5\*/i), ' 123 456 ');

    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    const signInBtn = pressables.find(p =>
      p.props.children?.props?.children?.toString().includes('Iniciar sesión')
    )!;
    fireEvent.press(signInBtn);

    await waitFor(() => {
      expect(mockAuth.signIn).toHaveBeenCalledWith('user@test.com', '123456');
    });
  });

  it('shows notification if signIn rejects with error', async () => {
    mockAuth.signIn.mockRejectedValueOnce(new Error('Fallo login'));
    const { getByPlaceholderText, getByText, UNSAFE_getAllByType } = renderWithNav();

    fireEvent.changeText(getByPlaceholderText(/something@provider\.com/i), 'user@test.com');
    fireEvent.changeText(getByPlaceholderText(/abcD5\*/i), '123456');

    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    const signInBtn = pressables.find(p =>
      p.props.children?.props?.children?.toString().includes('Iniciar sesión')
    )!;
    fireEvent.press(signInBtn);

    await waitFor(() => {
      expect(getByText(/Fallo login/i)).toBeTruthy();
    });
  });

  it('sign in button is disabled when email or password is empty', () => {
    const { getByPlaceholderText, UNSAFE_getAllByType } = renderWithNav();

    // Case 1: both empty
    let pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    let signInBtn = pressables.find(p =>
      p.props.children?.props?.children?.toString().includes('Iniciar sesión')
    )!;
    expect(signInBtn.props.disabled).toBe(true);

    // Case 2: only email
    fireEvent.changeText(getByPlaceholderText(/something@provider\.com/i), 'user@test.com');
    pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    signInBtn = pressables.find(p =>
      p.props.children?.props?.children?.toString().includes('Iniciar sesión')
    )!;
    expect(signInBtn.props.disabled).toBe(true);

    // Case 3: email + password -> enabled
    fireEvent.changeText(getByPlaceholderText(/abcD5\*/i), '123456');
    pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    signInBtn = pressables.find(p =>
      p.props.children?.props?.children?.toString().includes('Iniciar sesión')
    )!;
    expect(signInBtn.props.disabled).toBe(false);
  });

  it('navigates to PasswordReset when “¿Has olvidado tu contraseña?” is pressed', () => {
    const { getByText } = renderWithNav();
    fireEvent.press(getByText(/¿Has olvidado tu contraseña\?/i));
    expect(mockNavigate).toHaveBeenCalledWith('PasswordReset');
  });

  it('calls signInWithGoogle (OK)', async () => {
    const { getByText } = renderWithNav();
    fireEvent.press(getByText(/Entrar con Google/i));
    await waitFor(() => {
      expect(mockAuth.signInWithGoogle).toHaveBeenCalled();
    });
  });

  it('shows notification if signInWithGoogle rejects', async () => {
    mockAuth.signInWithGoogle.mockRejectedValueOnce(new Error('Google KO'));
    const { getByText } = renderWithNav();
    fireEvent.press(getByText(/Entrar con Google/i));
    await waitFor(() => {
      expect(getByText(/Error al Iniciar sesión con Google\./i)).toBeTruthy();
    });
  });
});
