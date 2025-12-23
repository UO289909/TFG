
if (global.window !== global) {
    Object.defineProperty(global, 'window', {
        value: global,
        writable: true,
        configurable: true,
    });
}

require('@testing-library/react-native');

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
