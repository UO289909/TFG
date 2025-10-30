
if (global.window !== global) {
    Object.defineProperty(global, 'window', {
        value: global,
        writable: true,
        configurable: true,
    });
}

import 'react-native';
import '@testing-library/react-native';

const originalError = console.error;
console.error = (...args) => {
    if (
        typeof args[0] === 'string' &&
        args[0].includes('react-test-renderer is deprecated')
    ) {
        return;
    }
    originalError(...args);
};

jest.mock('@react-native-vector-icons/ionicons', () => require('./__mocks__/react-native-vector-icons.js'));

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
        }),
        useTheme: () => ({
            colors: {
                background: '#fff',
                text: '#000',
                primary: '#6200ee',
                card: '#f5f5f5',
                border: '#ccc',
                notification: '#f00',
            },
        }),
        NavigationContainer: ({ children }) => children,
    };
});
