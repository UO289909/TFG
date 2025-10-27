
if (global.window !== global) {
    Object.defineProperty(global, 'window', {
        value: global,
        writable: true,
        configurable: true,
    });
}

import 'react-native';
import '@testing-library/react-native';
jest.mock('@react-native-vector-icons/ionicons', () => require('./__mocks__/react-native-vector-icons.js'));
