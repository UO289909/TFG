import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { FullScreenLoader } from '../../../components/feedback';

// Mock AuthContext
const mockAuth = {
    changePassword: jest.fn().mockResolvedValue(true),
    loading: false,
};

jest.mock('../../../context/AuthContext', () => ({
    useAuth: () => mockAuth,
}));

// Mock Navigation + Route
const mockGoBack = jest.fn();

const mockUseRoute = jest.fn().mockReturnValue({
  params: { alreadySentCode: false, notifPosition: 'top' },
});

jest.mock('@react-navigation/native', () => {
    const actual = jest.requireActual('@react-navigation/native');
    return {
        ...actual,
        useNavigation: () => ({ goBack: mockGoBack }),
        useRoute: () => mockUseRoute(),
        useTheme: () => ({
            colors: { text: '#111', secondaryText: '#666' },
        }),
    };
});

import { PasswordChangeScreen } from '../PasswordChangeScreen';

// Helper render
const renderWithNav = () => render(<PasswordChangeScreen />);

describe('PasswordChangeScreen', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockAuth.changePassword.mockResolvedValue(true);
        mockAuth.loading = false;
    });

    it('renders fields and button', () => {
        const { getByPlaceholderText, getAllByPlaceholderText, getByText } = renderWithNav();

        expect(getByPlaceholderText(/123456/)).toBeTruthy(); // code
        expect(getAllByPlaceholderText(/abcD5\*/i).length).toBe(2); // password + confirm
        expect(getByText(/Cambiar contraseña/i)).toBeTruthy();
    });

    it('shows <FullScreenLoader /> when loading=true', () => {
        mockAuth.loading = true;
        const { UNSAFE_getByType } = renderWithNav();
        expect(UNSAFE_getByType(FullScreenLoader)).toBeTruthy();
    });

    it('shows initial notification if alreadySentCode = true', () => {
        mockUseRoute.mockReturnValueOnce({
            params: { alreadySentCode: true, notifPosition: 'top' },
        });

        const { getByText } = renderWithNav();

        expect(
            getByText(/Utiliza el código de verificación que solicitaste hace menos de 1 minuto/i)
        ).toBeTruthy();
    });

    it('does NOT call changePassword if passwords do NOT match', async () => {
        const { getByPlaceholderText, getAllByPlaceholderText, UNSAFE_getAllByType, findByText } =
            renderWithNav();

        fireEvent.changeText(getByPlaceholderText(/123456/), '999999'); // code
        const [pwd, confirmPwd] = getAllByPlaceholderText(/abcD5\*/i);

        fireEvent.changeText(pwd, '123456');
        fireEvent.changeText(confirmPwd, '654321');

        const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
        const changeBtn = pressables.find(p =>
            p.props.children?.props?.children?.toString().includes('Cambiar contraseña')
        )!;
        fireEvent.press(changeBtn);

        expect(await findByText(/Las contraseñas no coinciden/i)).toBeTruthy();
        expect(mockAuth.changePassword).not.toHaveBeenCalled();
    });

    it('calls changePassword on valid input and navigates back', async () => {
        const { getByPlaceholderText, getAllByPlaceholderText, UNSAFE_getAllByType } =
            renderWithNav();

        fireEvent.changeText(getByPlaceholderText(/123456/), '222222');
        const [pwd, confirmPwd] = getAllByPlaceholderText(/abcD5\*/i);

        fireEvent.changeText(pwd, 'NewPwd123!');
        fireEvent.changeText(confirmPwd, 'NewPwd123!');

        const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
        const changeBtn = pressables.find(p =>
            p.props.children?.props?.children?.toString().includes('Cambiar contraseña')
        )!;
        fireEvent.press(changeBtn);

        await waitFor(() => {
            expect(mockAuth.changePassword).toHaveBeenCalledWith('NewPwd123!', '222222');
            expect(mockGoBack).toHaveBeenCalled();
        });
    });

    it('shows notification if changePassword throws error', async () => {
        mockAuth.changePassword.mockRejectedValueOnce(new Error('Código inválido'));

        const { getByPlaceholderText, getAllByPlaceholderText, UNSAFE_getAllByType, findByText } =
            renderWithNav();

        fireEvent.changeText(getByPlaceholderText(/123456/), '222222');
        const [pwd, confirmPwd] = getAllByPlaceholderText(/abcD5\*/i);

        fireEvent.changeText(pwd, 'NewPwd123!');
        fireEvent.changeText(confirmPwd, 'NewPwd123!');

        const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
        const changeBtn = pressables.find(p =>
            p.props.children?.props?.children?.toString().includes('Cambiar contraseña')
        )!;
        fireEvent.press(changeBtn);

        expect(await findByText(/Código inválido/i)).toBeTruthy();
    });

    it('disables the button when any field is empty', () => {
        const { UNSAFE_getAllByType, getByPlaceholderText, getAllByPlaceholderText } = renderWithNav();

        const getBtn = () => {
            const pressables = UNSAFE_getAllByType(require('react-native').Pressable);
            return pressables.find(p =>
                p.props.children?.props?.children?.toString().includes('Cambiar contraseña')
            )!;
        };

        // Case 1: all empty
        expect(getBtn().props.disabled).toBe(true);

        // Case 2: only code
        fireEvent.changeText(getByPlaceholderText(/123456/), '123456');
        expect(getBtn().props.disabled).toBe(true);

        // Case 3: code + password
        fireEvent.changeText(getAllByPlaceholderText(/abcD5\*/i)[0], 'NewPass');
        expect(getBtn().props.disabled).toBe(true);

        // Case 4: full form → enabled
        fireEvent.changeText(getAllByPlaceholderText(/abcD5\*/i)[1], 'NewPass');
        expect(getBtn().props.disabled).toBe(false);
    });

});
