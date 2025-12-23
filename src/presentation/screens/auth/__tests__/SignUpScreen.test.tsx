import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SignUpScreen } from '../SignUpScreen';
import { FullScreenLoader } from '../../../components/feedback';

// Mocks
const mockAuth = {
  signUp: jest.fn().mockResolvedValue(true),
  loading: false,
};

jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => mockAuth,
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate }),
    useTheme: () => ({
      colors: { text: '#111', secondaryText: '#666' },
    }),
  };
});

// Helper render
const renderWithNav = () => render(<SignUpScreen />);

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth.signUp.mockResolvedValue(true);
    mockAuth.loading = false;
  });

  it('renders all inputs and the register button', () => {
    const { getAllByPlaceholderText, getByPlaceholderText, getAllByText } = renderWithNav();

    expect(getAllByText(/Registrarse/i).length).toBe(2);
    expect(getByPlaceholderText(/Nombre y apellidos/i)).toBeTruthy();
    expect(getByPlaceholderText(/Tu apodo/i)).toBeTruthy();
    expect(getByPlaceholderText(/something@provider\.com/i)).toBeTruthy();
    expect(getAllByPlaceholderText(/abcD5\*/i).length).toBe(2);

  });

  it('shows <FullScreenLoader /> when loading=true', () => {
    mockAuth.loading = true;
    const { UNSAFE_getByType } = renderWithNav();
    expect(UNSAFE_getByType(FullScreenLoader)).toBeTruthy();
  });

  it('does NOT call signUp and shows notification if email is invalid', async () => {
    const { getAllByPlaceholderText, getByPlaceholderText, UNSAFE_getAllByType, findByText } = renderWithNav();

    fireEvent.changeText(getByPlaceholderText(/Nombre y apellidos/i), 'Juan Pérez');
    fireEvent.changeText(getByPlaceholderText(/Tu apodo/i), 'juanp');
    fireEvent.changeText(getByPlaceholderText(/something@provider\.com/i), 'bad-email');
    fireEvent.changeText(getAllByPlaceholderText(/abcD5\*/i)[0], '123456');

    fireEvent.changeText(getAllByPlaceholderText(/abcD5\*/i)[1], '123456');

    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    const registerBtn = pressables.find(p =>
      p.props.children?.props?.children?.toString().includes('Registrarse')
    )!;

    fireEvent.press(registerBtn);

    expect(await findByText(/El correo electrónico no es válido/i)).toBeTruthy();
    expect(mockAuth.signUp).not.toHaveBeenCalled();
  });

  it('does NOT call signUp and shows notification if passwords do NOT match', async () => {
    const { getByPlaceholderText, getAllByPlaceholderText, UNSAFE_getAllByType, findByText } = renderWithNav();

    fireEvent.changeText(getByPlaceholderText(/Nombre y apellidos/i), 'Juan Pérez');
    fireEvent.changeText(getByPlaceholderText(/Tu apodo/i), 'juanp');
    fireEvent.changeText(getByPlaceholderText(/something@provider\.com/i), 'test@test.com');

    const pwd = getAllByPlaceholderText(/abcD5\*/i)[0];
    fireEvent.changeText(pwd, '123456');

    const confirmPwdInput = getAllByPlaceholderText(/abcD5\*/i)[1];
    fireEvent.changeText(confirmPwdInput, '999999');

    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    const registerBtn = pressables.find(p =>
      p.props.children?.props?.children?.toString().includes('Registrarse')
    )!;

    fireEvent.press(registerBtn);

    expect(await findByText(/Las contraseñas no coinciden/i)).toBeTruthy();
    expect(mockAuth.signUp).not.toHaveBeenCalled();
  });

  it('calls signUp with trimmed fields and resets form on success', async () => {
    const { getByPlaceholderText, getAllByPlaceholderText, UNSAFE_getAllByType, findByText } = renderWithNav();

    fireEvent.changeText(getByPlaceholderText(/Nombre y apellidos/i), '  Juan Pérez  ');
    fireEvent.changeText(getByPlaceholderText(/Tu apodo/i), 'juanp');
    fireEvent.changeText(getByPlaceholderText(/something@provider\.com/i), '  test@test.com  ');
    fireEvent.changeText(getAllByPlaceholderText(/abcD5\*/i)[0], ' 123456 ');

    // Confirm password
    const confirmPwdInput = getAllByPlaceholderText(/abcD5\*/i)[1];
    fireEvent.changeText(confirmPwdInput, '123456');

    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    const registerBtn = pressables.find(p =>
      p.props.children?.props?.children?.toString().includes('Registrarse')
    )!;

    fireEvent.press(registerBtn);

    await waitFor(() => {
      expect(mockAuth.signUp).toHaveBeenCalledWith(
        'test@test.com',
        '123456',
        'Juan Pérez',
        'juanp'
      );
    });

    expect(await findByText(/¡Registro exitoso!/i)).toBeTruthy();
  });

  it('shows notification if signUp throws error', async () => {
    mockAuth.signUp.mockRejectedValueOnce(new Error('Usuario ya existe'));

    const { getByPlaceholderText, getAllByPlaceholderText, UNSAFE_getAllByType, findByText } = renderWithNav();

    fireEvent.changeText(getByPlaceholderText(/Nombre y apellidos/i), 'Juan Perez');
    fireEvent.changeText(getByPlaceholderText(/Tu apodo/i), 'juanp');
    fireEvent.changeText(getByPlaceholderText(/something@provider\.com/i), 'test@test.com');

    const pwds = getAllByPlaceholderText(/abcD5\*/i);
    fireEvent.changeText(pwds[0], '123456');
    fireEvent.changeText(pwds[1], '123456');

    const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
    const registerBtn = pressables.find(p =>
      p.props.children?.props?.children?.toString().includes('Registrarse')
    )!;

    fireEvent.press(registerBtn);

    expect(await findByText(/Usuario ya existe/i)).toBeTruthy();
  });

  it('disables the register button when required fields are empty', () => {
    const { UNSAFE_getAllByType, getByPlaceholderText, getAllByPlaceholderText } = renderWithNav();

    const getBtn = () => {
      const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
      return pressables.find(p =>
        p.props.children?.props?.children?.toString().includes('Registrarse')
      )!;
    };

    // Case 1: all empty → disabled
    expect(getBtn().props.disabled).toBe(true);

    // Case 2: only email
    fireEvent.changeText(getByPlaceholderText(/something@provider\.com/i), 'test@test.com');
    expect(getBtn().props.disabled).toBe(true);

    // Case 3: email + password + name → still disabled because nickname missing
    fireEvent.changeText(getByPlaceholderText(/Nombre y apellidos/i), 'Juan Perez');
    fireEvent.changeText(getAllByPlaceholderText(/abcD5\*/i)[0], '123456');
    fireEvent.changeText(getAllByPlaceholderText(/abcD5\*/i)[1], '123456');
    expect(getBtn().props.disabled).toBe(true);

    // Case 4: all mandatory fields → enabled
    fireEvent.changeText(getByPlaceholderText(/Tu apodo/i), 'juanp');
    expect(getBtn().props.disabled).toBe(false);
  });
});
