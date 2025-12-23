import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { PasswordResetScreen } from '../PasswordResetScreen';
import { FullScreenLoader } from '../../../components/feedback';

// Mocks
const mockAuth = {
    resetPassword: jest.fn().mockResolvedValue(true),
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
const renderWithNav = () => render(<PasswordResetScreen />);

describe('PasswordResetScreen', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockAuth.resetPassword.mockResolvedValue(true);
        mockAuth.loading = false;
    });

    it('renders email field and reset button', () => {
        const { getByPlaceholderText, getByText } = renderWithNav();

        expect(getByPlaceholderText(/something@provider\.com/i)).toBeTruthy();
        expect(getByText(/Resetear contraseña/i)).toBeTruthy();
    });

    it('shows <FullScreenLoader /> when loading = true', () => {
        mockAuth.loading = true;
        const { UNSAFE_getByType } = renderWithNav();
        expect(UNSAFE_getByType(FullScreenLoader)).toBeTruthy();
    });

    it('does NOT call resetPassword when email invalid', async () => {
        const { getByPlaceholderText, findByText, UNSAFE_getAllByType } = renderWithNav();

        fireEvent.changeText(getByPlaceholderText(/something@provider\.com/i), 'bad-email');

        const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
        const resetBtn = pressables.find(p =>
            p.props.children?.props?.children?.toString().includes('Resetear contraseña')
        )!;
        fireEvent.press(resetBtn);

        expect(await findByText(/El correo electrónico no es válido/i)).toBeTruthy();
        expect(mockAuth.resetPassword).not.toHaveBeenCalled();
    });

    it('calls resetPassword and navigates on success', async () => {
        const { getByPlaceholderText, findByText, UNSAFE_getAllByType } = renderWithNav();

        fireEvent.changeText(getByPlaceholderText(/something@provider\.com/i), 'user@test.com');

        const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
        const resetBtn = pressables.find(p =>
            p.props.children?.props?.children?.toString().includes('Resetear contraseña')
        )!;
        fireEvent.press(resetBtn);

        await waitFor(() => {
            expect(mockAuth.resetPassword).toHaveBeenCalledWith('user@test.com');
        });

        expect(await findByText(/Revisa tu correo para las instrucciones de reseteo/i)).toBeTruthy();
        expect(mockNavigate).toHaveBeenCalledWith('PasswordChange', { alreadySentCode: true, notifPosition: 'top' });
    });

    it('shows notification if resetPassword throws error', async () => {
        mockAuth.resetPassword.mockRejectedValueOnce(new Error('No existe el usuario'));

        const { getByPlaceholderText, findByText, UNSAFE_getAllByType } = renderWithNav();

        fireEvent.changeText(getByPlaceholderText(/something@provider\.com/i), 'user@test.com');

        const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
        const resetBtn = pressables.find(p =>
            p.props.children?.props?.children?.toString().includes('Resetear contraseña')
        )!;
        fireEvent.press(resetBtn);

        expect(await findByText(/No existe el usuario/i)).toBeTruthy();
    });

    it('disables the reset button when email is empty', () => {
        const { UNSAFE_getAllByType } = renderWithNav();

        const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
        const resetBtn = pressables.find(p =>
            p.props.children?.props?.children?.toString().includes('Resetear contraseña')
        )!;

        expect(resetBtn.props.disabled).toBe(true);
    });

});
