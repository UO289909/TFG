import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CustomButton } from '../CustomButton';

// mock useTheme
jest.mock('@react-navigation/native', () => ({
    useTheme: () => ({
        colors: {
            primary: '#06B3DC',
            secondaryText: '#666',
            buttonDisabled: '#ccc',
            greyDark: '#999',
            shadow: '#000',
        },
    }),
}));

describe('CustomButton', () => {
    const defaultProps = {
        onPress: jest.fn(),
        title: 'Test Button',
        disabled: false,
    };

    it('renders correctly', () => {
        const { getByText } = render(<CustomButton {...defaultProps} />);
        expect(getByText('Test Button')).toBeTruthy();
    });

    it('renders as disabled', () => {
        const props = { ...defaultProps, disabled: true };
        const { getByText } = render(<CustomButton {...props} />);
        expect(getByText('Test Button')).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
        const { getByText } = render(<CustomButton {...defaultProps} />);
        fireEvent.press(getByText('Test Button'));
        expect(defaultProps.onPress).toHaveBeenCalled();
    });

    it('applies custom style', () => {
        const props = { ...defaultProps, style: { marginTop: 20 } };
        expect(() => render(<CustomButton {...props} />)).not.toThrow();
    });
});
